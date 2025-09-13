import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  Map, 
  Activity, 
  Target, 
  FileText,
  Settings
} from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'map', icon: Map, label: 'Map' },
    { id: 'devices', icon: Activity, label: 'Devices' },
    { id: 'planning', icon: Target, label: 'Planning' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const getColorClasses = (isActive: boolean) => {
    return isActive 
      ? 'text-primary bg-primary/10 border-primary/20' 
      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50';
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg"
    >
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 border ${getColorClasses(isActive)}`}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Icon className="w-5 h-5" />
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  />
                )}
              </motion.div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
      
      {/* Sudarshan Footer Branding */}
      <div className="text-center py-1 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Sudarshan Disaster Response System
        </p>
      </div>
    </motion.div>
  );
}