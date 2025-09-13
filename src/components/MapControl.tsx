import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Navigation, 
  Search,
  Package,
  Target,
  RotateCcw,
  Zap,
  AlertTriangle,
  Users,
  Plane,
  Truck,
  MapPin,
  Battery,
  Wifi,
  Video,
  Navigation2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface Unit {
  id: string;
  type: 'drone' | 'rover';
  lat: number;
  lng: number;
  status: 'active' | 'scanning' | 'delivering' | 'returning';
  battery: number;
}

interface Victim {
  id: string;
  lat: number;
  lng: number;
  rescued: boolean;
}

interface Hazard {
  id: string;
  lat: number;
  lng: number;
  type: 'fire' | 'debris' | 'unstable';
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function MapControl() {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [units, setUnits] = useState<Unit[]>([
    { id: 'D-001', type: 'drone', lat: 37.7749, lng: -122.4194, status: 'active', battery: 85 },
    { id: 'D-002', type: 'drone', lat: 37.7849, lng: -122.4094, status: 'scanning', battery: 62 },
    { id: 'D-003', type: 'drone', lat: 37.7649, lng: -122.4294, status: 'delivering', battery: 15 },
    { id: 'R-001', type: 'rover', lat: 37.7549, lng: -122.4394, status: 'active', battery: 94 },
    { id: 'R-002', type: 'rover', lat: 37.7949, lng: -122.3994, status: 'returning', battery: 38 }
  ]);

  const [victims, setVictims] = useState<Victim[]>([
    { id: 'V-001', lat: 37.7729, lng: -122.4174, rescued: false },
    { id: 'V-002', lat: 37.7829, lng: -122.4074, rescued: true },
    { id: 'V-003', lat: 37.7629, lng: -122.4274, rescued: false }
  ]);

  const [hazards] = useState<Hazard[]>([
    { id: 'H-001', lat: 37.7769, lng: -122.4154, type: 'fire' },
    { id: 'H-002', lat: 37.7689, lng: -122.4234, type: 'debris' },
    { id: 'H-003', lat: 37.7809, lng: -122.4034, type: 'unstable' }
  ]);

  const [aiSuggestion, setAiSuggestion] = useState("AI suggests: Deploy D-002 to optimal GPS coordinates for maximum coverage");
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps API key is available
        const key = process.env.GOOGLE_MAPS_API_KEY || window.GOOGLE_MAPS_API_KEY;
        
        if (key && key !== 'undefined' && key !== 'null') {
          setApiKey(key);
          loadGoogleMapsScript(key);
        } else {
          console.log('Google Maps API key not configured. Using fallback visualization.');
          // The fallback map will be used automatically
        }
      } catch (error) {
        console.log('Unable to load Google Maps API. Using fallback visualization.');
      }
    };

    loadGoogleMaps();
  }, []);

  const loadGoogleMapsScript = (key: string) => {
    if (window.google) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    window.initMap = initializeMap;
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: 13,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      mapTypeControlOptions: {
        style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: window.google.maps.ControlPosition.TOP_CENTER,
        mapTypeIds: ['roadmap', 'satellite', 'terrain', 'hybrid']
      },
      styles: [] // Use default Google Maps styling for professional look
    });

    mapInstanceRef.current = map;
    setIsMapLoaded(true);
    updateMapMarkers();
    addMissionZones();
  };

  const addMissionZones = () => {
    if (!mapInstanceRef.current) return;

    // Mission zones with colored radius circles
    const missionZones = [
      {
        center: { lat: 37.7749, lng: -122.4194 },
        radius: 500, // meters
        fillColor: '#10b981',
        strokeColor: '#059669',
        name: 'Safe Zone Alpha'
      },
      {
        center: { lat: 37.7849, lng: -122.4094 },
        radius: 800,
        fillColor: '#f59e0b',
        strokeColor: '#d97706',
        name: 'Active Mission Beta'
      },
      {
        center: { lat: 37.7649, lng: -122.4294 },
        radius: 600,
        fillColor: '#ef4444',
        strokeColor: '#dc2626',
        name: 'High-Risk Zone Gamma'
      }
    ];

    missionZones.forEach(zone => {
      const circle = new window.google.maps.Circle({
        strokeColor: zone.strokeColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: zone.fillColor,
        fillOpacity: 0.15,
        map: mapInstanceRef.current,
        center: zone.center,
        radius: zone.radius
      });

      // Add info window for zone details
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; color: #000;">
            <h4 style="margin: 0 0 8px 0; color: ${zone.strokeColor};">${zone.name}</h4>
            <p style="margin: 0; font-size: 12px;">Radius: ${zone.radius}m</p>
            <p style="margin: 0; font-size: 12px;">Status: ${zone.fillColor === '#10b981' ? 'Secure' : zone.fillColor === '#f59e0b' ? 'Active Operations' : 'High Risk'}</p>
          </div>
        `
      });

      circle.addListener('click', () => {
        infoWindow.setPosition(zone.center);
        infoWindow.open(mapInstanceRef.current);
      });
    });
  };

  const updateMapMarkers = () => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add unit markers
    units.forEach(unit => {
      const marker = new window.google.maps.Marker({
        position: { lat: unit.lat, lng: unit.lng },
        map: mapInstanceRef.current,
        title: `${unit.id} - ${unit.type}`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: getUnitMarkerColor(unit),
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      marker.addListener('click', () => handleUnitClick(unit));
      markersRef.current.push(marker);
    });

    // Add victim markers
    victims.forEach(victim => {
      const marker = new window.google.maps.Marker({
        position: { lat: victim.lat, lng: victim.lng },
        map: mapInstanceRef.current,
        title: `Victim ${victim.id}`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: victim.rescued ? '#10b981' : '#ef4444',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 1
        }
      });

      markersRef.current.push(marker);
    });

    // Add hazard markers
    hazards.forEach(hazard => {
      const marker = new window.google.maps.Marker({
        position: { lat: hazard.lat, lng: hazard.lng },
        map: mapInstanceRef.current,
        title: `Hazard ${hazard.id}`,
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 8,
          fillColor: getHazardMarkerColor(hazard.type),
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 1
        }
      });

      markersRef.current.push(marker);
    });
  };

  const getUnitMarkerColor = (unit: Unit) => {
    switch (unit.status) {
      case 'active': return unit.type === 'drone' ? '#3b82f6' : '#10b981';
      case 'scanning': return '#eab308';
      case 'delivering': return '#f59e0b';
      case 'returning': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getHazardMarkerColor = (type: string) => {
    switch (type) {
      case 'fire': return '#ef4444';
      case 'debris': return '#f97316';
      case 'unstable': return '#eab308';
      default: return '#6b7280';
    }
  };

  // Real-time unit movement simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setUnits(prev => prev.map(unit => ({
        ...unit,
        lat: unit.lat + (Math.random() - 0.5) * 0.001,
        lng: unit.lng + (Math.random() - 0.5) * 0.001
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Update markers when units change
  useEffect(() => {
    if (isMapLoaded) {
      updateMapMarkers();
    }
  }, [units, victims, isMapLoaded]);

  // AI suggestions with real GPS coordinates
  useEffect(() => {
    const suggestions = [
      "AI suggests: Deploy D-002 to 37.7829°N, 122.4074°W for optimal victim rescue coverage",
      "AI suggests: Route R-001 to avoid hazard zone at 37.7769°N, 122.4154°W",
      "AI suggests: Coordinate D-001 and D-003 for synchronized search pattern",
      "AI suggests: Battery level critical for D-003 - return to base at 37.7749°N, 122.4194°W",
      "AI suggests: New victim signal detected - dispatch nearest unit to investigate",
      "AI suggests: Weather conditions optimal for drone deployment in sector 7",
      "AI suggests: Communication relay established - extending operational range by 2km"
    ];

    const suggestionInterval = setInterval(() => {
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setAiSuggestion(randomSuggestion);
    }, 8000);

    return () => clearInterval(suggestionInterval);
  }, []);

  const handleUnitClick = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  const handleCommand = (command: string) => {
    if (!selectedUnit) return;
    
    setUnits(prev => prev.map(unit => 
      unit.id === selectedUnit.id 
        ? { ...unit, status: command as any }
        : unit
    ));
    
    setAiSuggestion(`AI: ${selectedUnit.id} executing ${command}. Optimal path calculated.`);
  };

  const getUnitIcon = (unit: Unit) => {
    return unit.type === 'drone' ? <Plane className="w-4 h-4" /> : <Truck className="w-4 h-4" />;
  };

  const getUnitColor = (unit: Unit) => {
    switch (unit.status) {
      case 'active': return unit.type === 'drone' ? 'text-primary' : 'text-accent';
      case 'scanning': return 'text-yellow-500';
      case 'delivering': return 'text-warning';
      case 'returning': return 'text-purple-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen p-4 pb-20 bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Live Map Control
        </h1>
        <p className="text-muted-foreground text-sm flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          Real-time GPS positioning & control
        </p>
      </motion.div>

      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mb-4"
      >
        <Card className="h-80 bg-card border-border backdrop-blur-sm overflow-hidden">
          {apiKey ? (
            // Real Google Maps
            <div
              ref={mapRef}
              className="w-full h-full"
              style={{ minHeight: '320px' }}
            />
          ) : (
            // Fallback Map with Icons
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-muted to-card">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                
                {/* Street patterns */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-gray-600 opacity-50"></div>
                  <div className="absolute top-2/4 left-0 right-0 h-0.5 bg-gray-600 opacity-50"></div>
                  <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-gray-600 opacity-50"></div>
                  <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-gray-600 opacity-50"></div>
                  <div className="absolute left-2/4 top-0 bottom-0 w-0.5 bg-gray-600 opacity-50"></div>
                  <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-gray-600 opacity-50"></div>
                </div>

                {/* GPS Coordinates Display */}
                <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-blue-400 flex items-center">
                  <Navigation2 className="w-3 h-3 mr-1" />
                  37.7749° N, 122.4194° W
                </div>

                {/* Live indicator */}
                <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/70 px-2 py-1 rounded text-xs text-green-400">
                  <Wifi className="w-3 h-3 animate-pulse" />
                  <span>LIVE GPS</span>
                </div>

                {/* Map Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                  <button className="w-8 h-8 bg-black/70 hover:bg-black/90 text-white rounded flex items-center justify-center">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 bg-black/70 hover:bg-black/90 text-white rounded flex items-center justify-center">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 bg-black/70 hover:bg-black/90 text-white rounded flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Units positioned by GPS coordinates */}
              <div className="absolute inset-0 p-4">
                {units.map((unit) => {
                  const x = ((unit.lng + 122.44) / 0.04) * 100;
                  const y = ((37.79 - unit.lat) / 0.04) * 100;
                  
                  return (
                    <motion.button
                      key={unit.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleUnitClick(unit)}
                      className={`absolute w-10 h-10 ${getUnitColor(unit)} ${selectedUnit?.id === unit.id ? 'ring-2 ring-white' : ''} rounded-full flex items-center justify-center bg-black/70 backdrop-blur-sm shadow-lg group`}
                      style={{ 
                        left: `${Math.max(5, Math.min(90, x))}%`, 
                        top: `${Math.max(5, Math.min(90, y))}%`, 
                        transform: 'translate(-50%, -50%)' 
                      }}
                    >
                      {getUnitIcon(unit)}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${unit.battery < 20 ? 'bg-red-500' : 'bg-green-500'} border-2 border-black flex items-center justify-center`}>
                        <Battery className="w-2 h-2 text-white" />
                      </div>
                      
                      {/* GPS coordinates tooltip */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {unit.lat.toFixed(4)}°, {unit.lng.toFixed(4)}°
                      </div>
                    </motion.button>
                  );
                })}

                {/* Victims */}
                {victims.map((victim) => {
                  const x = ((victim.lng + 122.44) / 0.04) * 100;
                  const y = ((37.79 - victim.lat) / 0.04) * 100;
                  
                  return (
                    <motion.div
                      key={victim.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute w-6 h-6 ${victim.rescued ? 'text-green-400' : 'text-red-400'} animate-pulse`}
                      style={{ 
                        left: `${Math.max(5, Math.min(90, x))}%`, 
                        top: `${Math.max(5, Math.min(90, y))}%`, 
                        transform: 'translate(-50%, -50%)' 
                      }}
                    >
                      <div className="w-full h-full bg-current rounded-full flex items-center justify-center text-white">
                        <Users className="w-4 h-4" />
                      </div>
                    </motion.div>
                  );
                })}

                {/* Hazards */}
                {hazards.map((hazard) => {
                  const x = ((hazard.lng + 122.44) / 0.04) * 100;
                  const y = ((37.79 - hazard.lat) / 0.04) * 100;
                  
                  return (
                    <motion.div
                      key={hazard.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute w-7 h-7 ${hazard.type === 'fire' ? 'text-red-500' : hazard.type === 'debris' ? 'text-orange-500' : 'text-yellow-500'} animate-pulse`}
                      style={{ 
                        left: `${Math.max(5, Math.min(90, x))}%`, 
                        top: `${Math.max(5, Math.min(90, y))}%`, 
                        transform: 'translate(-50%, -50%)' 
                      }}
                    >
                      <AlertTriangle className="w-full h-full drop-shadow-lg" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* AI Suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="mb-4"
      >
        <Card className="p-3 bg-gradient-to-r from-green-900/30 to-cyan-900/30 border-green-500/30">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-green-400 animate-pulse" />
            <p className="text-sm text-green-400">{aiSuggestion}</p>
          </div>
        </Card>
      </motion.div>

      {/* Selected Unit Info */}
      {selectedUnit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Card className="p-4 bg-gray-900/70 border-blue-500/50 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-blue-400 flex items-center">
                  {getUnitIcon(selectedUnit)}
                  <span className="ml-2">{selectedUnit.id}</span>
                </h3>
                <p className="text-sm text-gray-400 capitalize">{selectedUnit.type} • {selectedUnit.status}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  GPS: {selectedUnit.lat.toFixed(6)}°, {selectedUnit.lng.toFixed(6)}°
                </p>
              </div>
              <Badge variant="secondary" className={`${selectedUnit.battery < 20 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'} flex items-center`}>
                <Battery className="w-3 h-3 mr-1" />
                {selectedUnit.battery}%
              </Badge>
            </div>
            
            {/* Live Feed Placeholder */}
            <div className="h-24 bg-black rounded-lg mb-3 flex items-center justify-center">
              <div className="flex items-center text-gray-500 text-sm">
                <Video className="w-4 h-4 mr-2" />
                Live {selectedUnit.type === 'drone' ? 'Aerial' : 'Ground'} Feed
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Control Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="grid grid-cols-2 gap-3"
      >
        <Button
          onClick={() => handleCommand('scanning')}
          disabled={!selectedUnit}
          className="h-12 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white border-0"
        >
          <Search className="w-4 h-4 mr-2" />
          Scan Area
        </Button>
        <Button
          onClick={() => handleCommand('delivering')}
          disabled={!selectedUnit}
          className="h-12 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0"
        >
          <Package className="w-4 h-4 mr-2" />
          Deliver Aid
        </Button>
        <Button
          onClick={() => handleCommand('active')}
          disabled={!selectedUnit}
          className="h-12 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white border-0"
        >
          <Target className="w-4 h-4 mr-2" />
          Extract
        </Button>
        <Button
          onClick={() => handleCommand('returning')}
          disabled={!selectedUnit}
          className="h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Return Base
        </Button>
      </motion.div>
    </div>
  );
}