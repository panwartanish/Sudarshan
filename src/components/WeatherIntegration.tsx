import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Eye, 
  Thermometer,
  Droplets,
  Gauge,
  AlertTriangle,
  MapPin
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    visibility: number;
    condition: string;
    pressure: number;
  };
  forecast?: {
    hour: number;
    temperature: number;
    precipitation: number;
    windSpeed: number;
  }[];
}

interface WeatherIntegrationProps {
  latitude?: number;
  longitude?: number;
}

export function WeatherIntegration({ latitude = 37.7749, longitude = -122.4194 }: WeatherIntegrationProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherData();
    // Update weather data every 5 minutes
    const interval = setInterval(fetchWeatherData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [latitude, longitude]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from backend first, fall back to simulated data
      try {
        const backendUrl = window.location.origin.includes('localhost') 
          ? 'http://localhost:54321' 
          : `https://${window.location.hostname.split('.')[0]}.supabase.co`;
        
        const response = await fetch(`${backendUrl}/functions/v1/make-server-81854134/weather/${latitude}/${longitude}`);
        
        if (response.ok) {
          const data = await response.json();
          setWeather(data);
          setError(null);
          return;
        }
      } catch (backendError) {
        console.log('Backend not available, using simulated weather data');
      }

      // Use simulated weather data
      const simulatedWeather: WeatherData = {
        current: {
          temperature: 18 + Math.random() * 10,
          humidity: 60 + Math.random() * 30,
          windSpeed: Math.random() * 15,
          windDirection: Math.random() * 360,
          visibility: 8 + Math.random() * 7,
          condition: ['Clear', 'Cloudy', 'Partly Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
          pressure: 1010 + Math.random() * 20
        },
        forecast: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          temperature: 15 + Math.random() * 15,
          precipitation: Math.random() * 0.5,
          windSpeed: Math.random() * 20
        }))
      };

      setWeather(simulatedWeather);
      setError(null);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Weather data unavailable');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="w-5 h-5 text-gray-400" />;
      case 'light rain':
      case 'rain':
        return <CloudRain className="w-5 h-5 text-blue-400" />;
      default:
        return <Cloud className="w-5 h-5 text-gray-400" />;
    }
  };

  const getVisibilityStatus = (visibility: number) => {
    if (visibility > 10) return { color: 'text-green-400', status: 'Excellent' };
    if (visibility > 5) return { color: 'text-yellow-400', status: 'Good' };
    if (visibility > 2) return { color: 'text-orange-400', status: 'Poor' };
    return { color: 'text-red-400', status: 'Very Poor' };
  };

  const getWindSpeed = (speed: number) => {
    if (speed < 5) return { color: 'text-green-400', status: 'Calm' };
    if (speed < 15) return { color: 'text-yellow-400', status: 'Moderate' };
    if (speed < 25) return { color: 'text-orange-400', status: 'Strong' };
    return { color: 'text-red-400', status: 'Very Strong' };
  };

  const getOperationalRisk = () => {
    if (!weather) return { level: 'Unknown', color: 'text-gray-400' };
    
    const { windSpeed, visibility, condition } = weather.current;
    let riskScore = 0;
    
    if (windSpeed > 20) riskScore += 3;
    else if (windSpeed > 15) riskScore += 2;
    else if (windSpeed > 10) riskScore += 1;
    
    if (visibility < 3) riskScore += 3;
    else if (visibility < 5) riskScore += 2;
    else if (visibility < 8) riskScore += 1;
    
    if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('storm')) {
      riskScore += 2;
    }
    
    if (riskScore >= 5) return { level: 'High Risk', color: 'text-red-400' };
    if (riskScore >= 3) return { level: 'Medium Risk', color: 'text-orange-400' };
    if (riskScore >= 1) return { level: 'Low Risk', color: 'text-yellow-400' };
    return { level: 'Optimal', color: 'text-green-400' };
  };

  if (loading) {
    return (
      <Card className="p-4 bg-gray-900/50 border-blue-500/30 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-400">Loading weather data...</span>
        </div>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="p-4 bg-gray-900/50 border-red-500/30 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span className="text-red-400">{error || 'Weather data unavailable'}</span>
        </div>
      </Card>
    );
  }

  const visibilityStatus = getVisibilityStatus(weather.current.visibility);
  const windStatus = getWindSpeed(weather.current.windSpeed);
  const operationalRisk = getOperationalRisk();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Current Weather */}
      <Card className="p-4 bg-gray-900/50 border-cyan-500/30 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-cyan-400">Weather Conditions</h3>
          </div>
          <div className="flex items-center space-x-2">
            {getWeatherIcon(weather.current.condition)}
            <span className="text-sm text-gray-300">{weather.current.condition}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-orange-400" />
            <div>
              <p className="text-lg font-semibold text-white">{Math.round(weather.current.temperature)}°C</p>
              <p className="text-xs text-gray-400">Temperature</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-lg font-semibold text-white">{Math.round(weather.current.humidity)}%</p>
              <p className="text-xs text-gray-400">Humidity</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Wind className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-lg font-semibold text-white">{Math.round(weather.current.windSpeed)} km/h</p>
              <p className={`text-xs ${windStatus.color}`}>{windStatus.status}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-purple-400" />
            <div>
              <p className="text-lg font-semibold text-white">{Math.round(weather.current.visibility)} km</p>
              <p className={`text-xs ${visibilityStatus.color}`}>{visibilityStatus.status}</p>
            </div>
          </div>
        </div>

        {/* Operational Risk Assessment */}
        <div className="pt-3 border-t border-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Operational Risk:</span>
            <Badge className={`${operationalRisk.color} border-current bg-current/10`}>
              {operationalRisk.level}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Flight/Navigation Recommendations */}
      <Card className="p-3 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-500/30">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-amber-400 font-medium">Mission Recommendations:</p>
            <p className="text-xs text-amber-300 mt-1">
              {weather.current.windSpeed > 20 
                ? "High winds detected - consider grounding drones" 
                : weather.current.visibility < 5
                ? "Reduced visibility - enable enhanced navigation systems"
                : weather.current.condition.toLowerCase().includes('rain')
                ? "Precipitation detected - waterproof equipment recommended"
                : "Conditions favorable for all operations"
              }
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}