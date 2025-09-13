import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Shield, 
  Sun, 
  Moon, 
  Database, 
  Wifi, 
  Save,
  ChevronRight,
  MapPin,
  Cloud,
  Phone,
  Zap,
  Bell,
  Lock
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useTheme } from './ThemeProvider';

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);

  const apiServices = [
    { name: 'Google Maps API', status: 'connected', icon: MapPin, color: 'green' },
    { name: 'Weather Service', status: 'connected', icon: Cloud, color: 'blue' },
    { name: 'Emergency Services', status: 'connected', icon: Phone, color: 'red' },
    { name: 'Drone Telemetry', status: 'connected', icon: Zap, color: 'yellow' },
    { name: 'Mission Database', status: 'connected', icon: Database, color: 'purple' },
    { name: 'Communication Relay', status: 'connected', icon: Wifi, color: 'teal' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'disconnected': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getIconColor = (color: string) => {
    const colors = {
      green: 'text-green-600',
      blue: 'text-blue-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
      purple: 'text-purple-600',
      teal: 'text-teal-600'
    };
    return colors[color as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">System configuration and preferences</p>
          </div>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="api">API Integration</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Sun className="w-5 h-5 mr-2" />
                Appearance & Display
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Theme Mode</Label>
                    <p className="text-sm text-muted-foreground">Choose between light and dark theme</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="w-4 h-4" />
                    <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                    <Moon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications & Alerts
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive real-time mission alerts</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Auto-save Data</Label>
                    <p className="text-sm text-muted-foreground">Automatically save mission data</p>
                  </div>
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Location Sharing</Label>
                    <p className="text-sm text-muted-foreground">Share location with command center</p>
                  </div>
                  <Switch checked={locationSharing} onCheckedChange={setLocationSharing} />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Government Personnel Profile
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Officer Name</Label>
                    <Input defaultValue="Commander Sarah Chen" className="mt-1" />
                  </div>
                  <div>
                    <Label>Badge ID</Label>
                    <Input defaultValue="CMD-2024-789" className="mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Department</Label>
                    <Input defaultValue="Emergency Response Division" className="mt-1" />
                  </div>
                  <div>
                    <Label>Clearance Level</Label>
                    <div className="mt-1">
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        Level 4 - Command Authority
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Contact Information</Label>
                  <Input defaultValue="s.chen@emergency.gov" className="mt-1" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Security Settings
              </h3>
              
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-between">
                  Change Password
                  <ChevronRight className="w-4 h-4" />
                </Button>
                
                <Button variant="outline" className="w-full justify-between">
                  Two-Factor Authentication
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    Enabled
                  </Badge>
                </Button>
                
                <Button variant="outline" className="w-full justify-between">
                  Security Logs
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* API Integration */}
          <TabsContent value="api" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                External Data Sources
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Manage connections to external APIs and services for real-time data integration.
              </p>
              
              <div className="space-y-3">
                {apiServices.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <motion.div
                      key={service.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${getIconColor(service.color)}`} />
                        <div>
                          <p className="font-medium text-foreground">{service.name}</p>
                          <p className="text-sm text-muted-foreground">Real-time data integration</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Wifi className="w-5 h-5 mr-2" />
                Connection Status
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-green-500/10">
                  <div className="text-2xl font-bold text-green-600">99.8%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-500/10">
                  <div className="text-2xl font-bold text-blue-600">47ms</div>
                  <div className="text-sm text-muted-foreground">Latency</div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button className="w-full h-12 bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save All Settings
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}