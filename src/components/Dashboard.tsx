import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Drone, 
  Users, 
  Package, 
  AlertTriangle, 
  Battery, 
  MapPin,
  Play,
  Bell,
  Cloud,
  Phone,
  Shield,
  Clock,
  CheckCircle,
  TrendingUp,
  Zap,
  Eye
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { WeatherIntegration } from './WeatherIntegration';
import { EmergencyServices } from './EmergencyServices';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  message: string;
  timestamp: string;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState({
    activeDrones: 8,
    activeRovers: 4,
    victimsLocated: 23,
    suppliesDelivered: 15,
    activeMissions: 3,
    missionSuccess: 92,
    responseTime: 4.2
  });

  const [activeMissions] = useState([
    {
      id: 'M-001',
      name: 'Earthquake Response Alpha-7',
      status: 'active',
      progress: 75,
      unitsDeployed: 5,
      priority: 'high'
    },
    {
      id: 'M-002',
      name: 'Flood Relief Beta-3',
      status: 'active',
      progress: 45,
      unitsDeployed: 3,
      priority: 'medium'
    },
    {
      id: 'M-003',
      name: 'Medical Supply Drop',
      status: 'completing',
      progress: 90,
      unitsDeployed: 2,
      priority: 'high'
    }
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      message: 'Drone D-003 low battery (15%)',
      timestamp: '2 min ago'
    },
    {
      id: '2',
      type: 'info',
      message: 'Victim detected at Grid B-7',
      timestamp: '5 min ago'
    },
    {
      id: '3',
      type: 'danger',
      message: 'Rover R-002 obstacle detected',
      timestamp: '8 min ago'
    }
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        victimsLocated: prev.victimsLocated + Math.floor(Math.random() * 2),
        suppliesDelivered: prev.suppliesDelivered + Math.floor(Math.random() * 2)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-warning/20 bg-warning/10 text-warning';
      case 'danger': return 'border-destructive/20 bg-destructive/10 text-destructive';
      case 'info': return 'border-primary/20 bg-primary/10 text-primary';
      default: return 'border-border bg-muted/50 text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen p-4 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Sudarshan Control</h1>
              <p className="text-muted-foreground text-sm">
                Mission Command Center • {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Online
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Key Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <Card className="p-4 bg-card border border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Drone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.activeDrones}</p>
              <p className="text-xs text-muted-foreground">Active Drones</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Activity className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.activeRovers}</p>
              <p className="text-xs text-muted-foreground">Active Rovers</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Users className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.victimsLocated}</p>
              <p className="text-xs text-muted-foreground">Victims Located</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.suppliesDelivered}</p>
              <p className="text-xs text-muted-foreground">Supplies Delivered</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Mission Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Active Missions</h3>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            {stats.activeMissions} Active
          </Badge>
        </div>
        
        <div className="space-y-3">
          {activeMissions.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="p-4 bg-card border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      mission.priority === 'high' ? 'bg-red-500' : 
                      mission.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-foreground">{mission.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {mission.unitsDeployed} units deployed
                      </p>
                    </div>
                  </div>
                  <Badge className={
                    mission.status === 'active' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                    mission.status === 'completing' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                    'bg-gray-500/10 text-gray-600 border-gray-500/20'
                  }>
                    {mission.status}
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{mission.progress}%</span>
                  </div>
                  <Progress value={mission.progress} className="h-2" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-card border border-border text-center">
            <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.missionSuccess}%</p>
            <p className="text-xs text-muted-foreground">Success Rate</p>
          </Card>
          
          <Card className="p-4 bg-card border border-border text-center">
            <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.responseTime}m</p>
            <p className="text-xs text-muted-foreground">Avg Response</p>
          </Card>
          
          <Card className="p-4 bg-card border border-border text-center">
            <CheckCircle className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.activeMissions}</p>
            <p className="text-xs text-muted-foreground">Active Operations</p>
          </Card>
        </div>
      </motion.div>

      {/* Start New Mission Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-6"
      >
        <Button
          onClick={() => onNavigate('planning')}
          className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-lg"
        >
          <Play className="w-6 h-6 mr-3" />
          START NEW MISSION
        </Button>
      </motion.div>

      {/* Recent Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-4 mb-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Alerts</h3>
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            {alerts.length} Active
          </Badge>
        </div>

        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <Card className={`p-4 border ${getAlertColor(alert.type)}`}>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs opacity-70 mt-1">{alert.timestamp}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weather Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="mt-6"
      >
        <WeatherIntegration latitude={37.7749} longitude={-122.4194} />
      </motion.div>

      {/* Emergency Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-4"
      >
        <EmergencyServices latitude={37.7749} longitude={-122.4194} />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="mt-6 grid grid-cols-2 gap-4"
      >
        <Button
          onClick={() => onNavigate('map')}
          variant="outline"
          className="h-12 border-primary/50 text-primary hover:bg-primary/10"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Live Map
        </Button>
        <Button
          onClick={() => onNavigate('devices')}
          variant="outline"
          className="h-12 border-accent/50 text-accent hover:bg-accent/10"
        >
          <Battery className="w-4 h-4 mr-2" />
          Device Status
        </Button>
      </motion.div>
    </div>
  );
}