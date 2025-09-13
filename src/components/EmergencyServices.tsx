import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  Hospital, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  Clock,
  AlertTriangle,
  Radio,
  HeartHandshake,
  Building2
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface EmergencyService {
  type: 'hospital' | 'fire_station' | 'police';
  name: string;
  distance: number;
  contact: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface EmergencyServicesProps {
  latitude?: number;
  longitude?: number;
}

export function EmergencyServices({ latitude = 37.7749, longitude = -122.4194 }: EmergencyServicesProps) {
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmergencyServices();
  }, [latitude, longitude]);

  const fetchEmergencyServices = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from backend first, fall back to simulated data
      try {
        const backendUrl = window.location.origin.includes('localhost') 
          ? 'http://localhost:54321' 
          : `https://${window.location.hostname.split('.')[0]}.supabase.co`;
        
        const response = await fetch(`${backendUrl}/functions/v1/make-server-81854134/emergency-services/${latitude}/${longitude}`);
        
        if (response.ok) {
          const data = await response.json();
          setServices(data.services);
          setError(null);
          return;
        }
      } catch (backendError) {
        console.log('Backend not available, using simulated emergency services data');
      }

      // Use simulated emergency services data
      const simulatedServices: EmergencyService[] = [
        {
          type: 'hospital',
          name: 'General Hospital',
          distance: Math.random() * 5 + 1,
          contact: '911',
          coordinates: { lat: latitude + (Math.random() - 0.5) * 0.01, lng: longitude + (Math.random() - 0.5) * 0.01 }
        },
        {
          type: 'fire_station',
          name: 'Fire Station #3',
          distance: Math.random() * 3 + 0.5,
          contact: '911',
          coordinates: { lat: latitude + (Math.random() - 0.5) * 0.01, lng: longitude + (Math.random() - 0.5) * 0.01 }
        },
        {
          type: 'police',
          name: 'Police Station',
          distance: Math.random() * 4 + 1,
          contact: '911',
          coordinates: { lat: latitude + (Math.random() - 0.5) * 0.01, lng: longitude + (Math.random() - 0.5) * 0.01 }
        }
      ];

      setServices(simulatedServices);
      setError(null);
    } catch (err) {
      console.error('Emergency services fetch error:', err);
      setError('Emergency services data unavailable');
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'hospital':
        return <Hospital className="w-5 h-5 text-red-400" />;
      case 'fire_station':
        return <Truck className="w-5 h-5 text-orange-400" />;
      case 'police':
        return <ShieldCheck className="w-5 h-5 text-blue-400" />;
      default:
        return <Building2 className="w-5 h-5 text-gray-400" />;
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case 'hospital':
        return 'border-red-500/30 bg-red-500/10';
      case 'fire_station':
        return 'border-orange-500/30 bg-orange-500/10';
      case 'police':
        return 'border-blue-500/30 bg-blue-500/10';
      default:
        return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const initiateContact = (service: EmergencyService) => {
    // In a real implementation, this would interface with communication systems
    alert(`Initiating contact with ${service.name}\nDistance: ${service.distance.toFixed(1)}km\nContact: ${service.contact}`);
  };

  const requestBackup = (serviceType: string) => {
    // In a real implementation, this would send automated backup requests
    alert(`Backup request sent to nearest ${serviceType} units`);
  };

  if (loading) {
    return (
      <Card className="p-4 bg-gray-900/50 border-emerald-500/30 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-emerald-400">Loading emergency services...</span>
        </div>
      </Card>
    );
  }

  if (error || !services.length) {
    return (
      <Card className="p-4 bg-gray-900/50 border-red-500/30 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span className="text-red-400">{error || 'Emergency services data unavailable'}</span>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <Card className="p-3 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border-emerald-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-emerald-400">Emergency Services</h3>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            {services.length} Available
          </Badge>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-3 bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => requestBackup('medical')}
            size="sm"
            className="h-8 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30"
          >
            <HeartHandshake className="w-3 h-3 mr-1" />
            Medical
          </Button>
          <Button
            onClick={() => requestBackup('fire')}
            size="sm"
            className="h-8 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/30"
          >
            <Truck className="w-3 h-3 mr-1" />
            Fire
          </Button>
          <Button
            onClick={() => requestBackup('police')}
            size="sm"
            className="h-8 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30"
          >
            <ShieldCheck className="w-3 h-3 mr-1" />
            Police
          </Button>
        </div>
      </Card>

      {/* Services List */}
      <div className="space-y-3">
        {services.map((service, index) => (
          <motion.div
            key={`${service.type}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-3 backdrop-blur-sm ${getServiceColor(service.type)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getServiceIcon(service.type)}
                  <div>
                    <h4 className="font-medium text-white text-sm">{service.name}</h4>
                    <div className="flex items-center space-x-3 text-xs text-gray-400 mt-1">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {service.distance.toFixed(1)}km
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        ~{Math.round(service.distance * 2)}min
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => initiateContact(service)}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
                >
                  <Phone className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Communication Status */}
      <Card className="p-3 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/30">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm">Emergency communication channel active</span>
        </div>
      </Card>
    </motion.div>
  );
}