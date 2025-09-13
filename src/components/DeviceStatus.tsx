import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Battery, 
  Wifi, 
  Package, 
  Settings, 
  ChevronDown, 
  ChevronUp,
  Activity,
  Thermometer,
  Gauge,
  Plane,
  Truck
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface Device {
  id: string;
  type: 'drone' | 'rover';
  name: string;
  battery: number;
  connectivity: 'excellent' | 'good' | 'poor' | 'offline';
  payload: number;
  maxPayload: number;
  status: 'active' | 'standby' | 'maintenance' | 'charging';
  temperature: number;
  altitude?: number;
  speed: number;
  lastUpdate: string;
}

export function DeviceStatus() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 'D-001',
      type: 'drone',
      name: 'Falcon Alpha',
      battery: 85,
      connectivity: 'excellent',
      payload: 2.5,
      maxPayload: 5.0,
      status: 'active',
      temperature: 32,
      altitude: 150,
      speed: 25,
      lastUpdate: '2s ago'
    },
    {
      id: 'D-002',
      type: 'drone',
      name: 'Eagle Beta',
      battery: 62,
      connectivity: 'good',
      payload: 4.2,
      maxPayload: 5.0,
      status: 'active',
      temperature: 35,
      altitude: 200,
      speed: 18,
      lastUpdate: '5s ago'
    },
    {
      id: 'D-003',
      type: 'drone',
      name: 'Hawk Gamma',
      battery: 15,
      connectivity: 'poor',
      payload: 0,
      maxPayload: 5.0,
      status: 'charging',
      temperature: 28,
      altitude: 0,
      speed: 0,
      lastUpdate: '1m ago'
    },
    {
      id: 'R-001',
      type: 'rover',
      name: 'Titan One',
      battery: 94,
      connectivity: 'excellent',
      payload: 15.5,
      maxPayload: 25.0,
      status: 'active',
      temperature: 42,
      speed: 12,
      lastUpdate: '3s ago'
    },
    {
      id: 'R-002',
      type: 'rover',
      name: 'Atlas Two',
      battery: 38,
      connectivity: 'good',
      payload: 8.0,
      maxPayload: 25.0,
      status: 'standby',
      temperature: 39,
      speed: 0,
      lastUpdate: '10s ago'
    }
  ]);

  const [expandedDevices, setExpandedDevices] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setDevices(prev => prev.map(device => ({
        ...device,
        battery: device.status === 'charging' 
          ? Math.min(100, device.battery + 1)
          : Math.max(0, device.battery - 0.1),
        temperature: device.temperature + (Math.random() - 0.5) * 2,
        speed: device.status === 'active' 
          ? device.speed + (Math.random() - 0.5) * 3
          : 0
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const toggleExpanded = (deviceId: string) => {
    setExpandedDevices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deviceId)) {
        newSet.delete(deviceId);
      } else {
        newSet.add(deviceId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'standby': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'maintenance': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'charging': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getConnectivityColor = (connectivity: string) => {
    switch (connectivity) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-yellow-400';
      case 'poor': return 'text-orange-400';
      case 'offline': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return 'text-green-400';
    if (battery > 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen p-4 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Device Status
        </h1>
        <p className="text-gray-400 text-sm">
          {devices.filter(d => d.status === 'active').length} active • {devices.length} total units
        </p>
      </motion.div>

      {/* Device List */}
      <div className="space-y-4">
        {devices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm overflow-hidden">
              {/* Device Header */}
              <div 
                className="p-4 cursor-pointer"
                onClick={() => toggleExpanded(device.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${device.type === 'drone' ? 'bg-blue-500/20' : 'bg-emerald-500/20'}`}>
                      {device.type === 'drone' ? (
                        <Plane className="w-5 h-5 text-blue-400" />
                      ) : (
                        <Truck className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{device.name}</h3>
                      <p className="text-sm text-gray-400">{device.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(device.status)}>
                      {device.status}
                    </Badge>
                    {expandedDevices.has(device.id) ? 
                      <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    }
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-3 grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Battery className={`w-4 h-4 ${getBatteryColor(device.battery)}`} />
                    <span className={`text-sm ${getBatteryColor(device.battery)}`}>
                      {Math.round(device.battery)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Wifi className={`w-4 h-4 ${getConnectivityColor(device.connectivity)}`} />
                    <span className={`text-sm ${getConnectivityColor(device.connectivity)} capitalize`}>
                      {device.connectivity}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {device.payload}/{device.maxPayload}kg
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedDevices.has(device.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-700/50"
                >
                  <div className="p-4 space-y-4">
                    {/* Battery Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Battery Level</span>
                        <span className={`text-sm ${getBatteryColor(device.battery)}`}>
                          {Math.round(device.battery)}%
                        </span>
                      </div>
                      <Progress 
                        value={device.battery} 
                        className="h-2 bg-gray-800"
                      />
                    </div>

                    {/* Payload Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Payload</span>
                        <span className="text-sm text-white">
                          {device.payload}/{device.maxPayload}kg
                        </span>
                      </div>
                      <Progress 
                        value={(device.payload / device.maxPayload) * 100} 
                        className="h-2 bg-gray-800"
                      />
                    </div>

                    {/* Sensor Readings */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Thermometer className="w-4 h-4 text-orange-400" />
                        <div>
                          <p className="text-xs text-gray-400">Temperature</p>
                          <p className="text-sm text-white">{Math.round(device.temperature)}°C</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Gauge className="w-4 h-4 text-cyan-400" />
                        <div>
                          <p className="text-xs text-gray-400">Speed</p>
                          <p className="text-sm text-white">{Math.round(device.speed)} km/h</p>
                        </div>
                      </div>

                      {device.altitude !== undefined && (
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-lime-400" />
                          <div>
                            <p className="text-xs text-gray-400">Altitude</p>
                            <p className="text-sm text-white">{device.altitude}m</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse"></div>
                        <div>
                          <p className="text-xs text-gray-400">Last Update</p>
                          <p className="text-sm text-white">{device.lastUpdate}</p>
                        </div>
                      </div>
                    </div>

                    {/* Manual Control */}
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                      >
                        <Activity className="w-3 h-3 mr-1" />
                        Manual Control
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}