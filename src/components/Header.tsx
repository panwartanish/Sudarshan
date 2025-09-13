import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sun, Moon, Settings, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from './ThemeProvider';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border-b border-border px-4 py-3 flex items-center justify-between"
    >
      {/* Logo and Branding */}
      <div className="flex items-center space-x-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2"
        >
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Sudarshan</h1>
            <p className="text-xs text-muted-foreground">Disaster Response Control</p>
          </div>
        </motion.div>
      </div>

      {/* Page Title */}
      <div className="flex-1 text-center">
        <h2 className="text-sm font-medium text-foreground capitalize">
          {currentPage === 'dashboard' ? 'Mission Control' : currentPage.replace('-', ' ')}
        </h2>
        <p className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative"
        >
          <Bell className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-destructive">
            3
          </Badge>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-9 h-9"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('settings')}
          className="w-9 h-9"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </motion.header>
  );
}