import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, User, Eye, EyeOff, Badge, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate government authentication process
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-background">
      {/* Subtle animated background elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/8 blur-xl animate-pulse"></div>
      <div className="absolute bottom-40 right-10 w-16 h-16 rounded-full bg-accent/8 blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 rounded-full bg-warning/8 blur-xl animate-pulse delay-500"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm space-y-8"
      >
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mb-6"
          >
            <Shield className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            SUDARSHAN
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-muted-foreground text-sm"
          >
            Government Emergency Response System
          </motion.p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-6 p-6 rounded-2xl bg-card border border-border backdrop-blur-sm"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="officerId" className="text-primary flex items-center">
                <Badge className="w-4 h-4 mr-2" />
                Officer ID
              </Label>
              <Input
                id="officerId"
                type="text"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                className="bg-input border-border focus:border-primary text-foreground placeholder-muted-foreground"
                placeholder="GOV-XXXX-XXXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-accent flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                Department
              </Label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-3 bg-input border border-border focus:border-accent text-foreground placeholder-muted-foreground rounded-lg"
              >
                <option value="">Select Department</option>
                <option value="emergency">Emergency Management</option>
                <option value="fire">Fire Department</option>
                <option value="police">Police Department</option>
                <option value="medical">Medical Services</option>
                <option value="rescue">Search & Rescue</option>
                <option value="military">Military Operations</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-primary flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Secure Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border focus:border-primary text-foreground placeholder-muted-foreground pr-10"
                  placeholder="Government-issued password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-primary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground border-0"
              disabled={!officerId || !password || !department || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                  Verifying Credentials...
                </div>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Authorized Access
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Government Authorization Required • Emergency Response Personnel Only
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}