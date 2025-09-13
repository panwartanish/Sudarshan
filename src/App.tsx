import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { MapControl } from './components/MapControl';
import { DeviceStatus } from './components/DeviceStatus';
import { MissionPlanning } from './components/MissionPlanning';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { ThemeProvider } from './components/ThemeProvider';

type PageType = 'login' | 'dashboard' | 'map' | 'devices' | 'planning' | 'reports' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleNavigation = (page: PageType) => {
    if (isAuthenticated || page === 'login') {
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigation} />;
      case 'map':
        return <MapControl />;
      case 'devices':
        return <DeviceStatus />;
      case 'planning':
        return <MissionPlanning />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={handleNavigation} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground overflow-hidden">
        {/* Professional background pattern */}
        <div className="fixed inset-0 bg-background">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header - only show when authenticated and not on login */}
          {isAuthenticated && currentPage !== 'login' && (
            <Header onNavigate={handleNavigation} currentPage={currentPage} />
          )}

          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            {renderPage()}
          </motion.div>

          {/* Bottom Navigation - only show when authenticated and not on login */}
          {isAuthenticated && currentPage !== 'login' && (
            <Navigation currentPage={currentPage} onNavigate={handleNavigation} />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}