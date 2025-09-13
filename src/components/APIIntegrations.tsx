import React from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  Cloud, 
  Phone, 
  MapPin, 
  Satellite,
  Radio,
  Database,
  Shield,
  Camera,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface APIStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  description: string;
  icon: React.ReactNode;
  capabilities: string[];
}

export function APIIntegrations() {
  const apiStatuses: APIStatus[] = [
    {
      name: 'Google Maps API',
      status: 'connected',
      description: 'Real-time mapping and geolocation services',
      icon: <MapPin className="w-5 h-5" />,
      capabilities: [
        'Real-time GPS tracking',
        'Satellite imagery',
        'Route optimization',
        'Geocoding & reverse geocoding'
      ]
    },
    {
      name: 'Weather API',
      status: 'connected',
      description: 'Live weather conditions and forecasting',
      icon: <Cloud className="w-5 h-5" />,
      capabilities: [
        'Current weather conditions',
        'Wind speed & direction',
        'Visibility & precipitation',
        'Operational risk assessment'
      ]
    },
    {
      name: 'Emergency Services API',
      status: 'connected',
      description: 'Direct communication with emergency services',
      icon: <Phone className="w-5 h-5" />,
      capabilities: [
        'Nearest hospital/fire/police location',
        'Emergency contact integration',
        'Automated backup requests',
        'Response time estimation'
      ]
    },
    {
      name: 'Drone Telemetry API',
      status: 'connected',
      description: 'Real-time drone and rover communication',
      icon: <Satellite className="w-5 h-5" />,
      capabilities: [
        'Live telemetry data',
        'Battery monitoring',
        'GPS positioning',
        'Payload status tracking'
      ]
    },
    {
      name: 'Communication Relay',
      status: 'connected',
      description: 'Encrypted communication channels',
      icon: <Radio className="w-5 h-5" />,
      capabilities: [
        'Secure voice/data transmission',
        'Multi-unit coordination',
        'Command relay system',
        'Emergency broadcast'
      ]
    },
    {
      name: 'Mission Database',
      status: 'connected',
      description: 'Mission planning and data storage',
      icon: <Database className="w-5 h-5" />,
      capabilities: [
        'Mission plan storage',
        'Historical data analysis',
        'Real-time sync',
        'Backup & recovery'
      ]
    },
    {
      name: 'Government Security',
      status: 'connected',
      description: 'Secure authentication and authorization',
      icon: <Shield className="w-5 h-5" />,
      capabilities: [
        'Government ID verification',
        'Role-based access control',
        'Encrypted data transmission',
        'Audit trail logging'
      ]
    },
    {
      name: 'Live Video Feed',
      status: 'connected',
      description: 'Real-time video streaming from units',
      icon: <Camera className="w-5 h-5" />,
      capabilities: [
        'HD video streaming',
        'Multi-angle coverage',
        'Recording & playback',
        'AI-assisted recognition'
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-gray-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'disconnected':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const connectedAPIs = apiStatuses.filter(api => api.status === 'connected').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <Card className="p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-blue-400">API Integrations</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-green-400" />
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {connectedAPIs}/{apiStatuses.length} Active
            </Badge>
          </div>
        </div>
      </Card>

      {/* API Status Grid */}
      <div className="grid grid-cols-1 gap-3">
        {apiStatuses.map((api, index) => (
          <motion.div
            key={api.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-3 bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-400">
                    {api.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm">{api.name}</h4>
                    <p className="text-xs text-gray-400">{api.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(api.status)}
                  <Badge className={`text-xs ${getStatusColor(api.status)}`}>
                    {api.status}
                  </Badge>
                </div>
              </div>

              {/* Capabilities */}
              <div className="mt-2">
                <div className="grid grid-cols-2 gap-1">
                  {api.capabilities.slice(0, 4).map((capability, capIndex) => (
                    <div key={capIndex} className="text-xs text-gray-500 flex items-center">
                      <div className="w-1 h-1 bg-gray-500 rounded-full mr-2"></div>
                      {capability}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Integration Benefits */}
      <Card className="p-3 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border-emerald-500/30">
        <div className="space-y-2">
          <h4 className="font-medium text-emerald-400 text-sm">Enhanced Capabilities</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-emerald-300">
            <div>• Real-time situational awareness</div>
            <div>• Automated emergency response</div>
            <div>• Multi-agency coordination</div>
            <div>• Predictive mission planning</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}