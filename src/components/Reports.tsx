import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Package, 
  Clock,
  BarChart3
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';

interface MissionReport {
  id: string;
  name: string;
  date: string;
  duration: string;
  victimsRescued: number;
  suppliesDelivered: number;
  unitsDeployed: number;
  status: 'completed' | 'ongoing' | 'failed';
}

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedReport, setSelectedReport] = useState<MissionReport | null>(null);

  const missionReports: MissionReport[] = [
    {
      id: 'M-001',
      name: 'Emergency Response Alpha-7',
      date: '2025-01-10',
      duration: '4h 32m',
      victimsRescued: 23,
      suppliesDelivered: 15,
      unitsDeployed: 8,
      status: 'completed'
    },
    {
      id: 'M-002',
      name: 'Flood Relief Beta-3',
      date: '2025-01-09',
      duration: '6h 18m',
      victimsRescued: 45,
      suppliesDelivered: 32,
      unitsDeployed: 12,
      status: 'completed'
    },
    {
      id: 'M-003',
      name: 'Fire Suppression Gamma-1',
      date: '2025-01-08',
      duration: '2h 45m',
      victimsRescued: 8,
      suppliesDelivered: 6,
      unitsDeployed: 5,
      status: 'failed'
    },
    {
      id: 'M-004',
      name: 'Search & Rescue Delta-5',
      date: '2025-01-11',
      duration: '3h 12m',
      victimsRescued: 12,
      suppliesDelivered: 8,
      unitsDeployed: 6,
      status: 'ongoing'
    }
  ];

  const chartData = [
    { name: 'Mon', victims: 12, supplies: 8 },
    { name: 'Tue', victims: 23, supplies: 15 },
    { name: 'Wed', victims: 8, supplies: 6 },
    { name: 'Thu', victims: 45, supplies: 32 },
    { name: 'Fri', victims: 18, supplies: 12 },
    { name: 'Sat', victims: 32, supplies: 24 },
    { name: 'Sun', victims: 28, supplies: 19 }
  ];

  const performanceData = [
    { name: 'Week 1', efficiency: 85 },
    { name: 'Week 2', efficiency: 92 },
    { name: 'Week 3', efficiency: 78 },
    { name: 'Week 4', efficiency: 96 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ongoing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const exportReport = (format: 'pdf' | 'csv') => {
    // Simulate export functionality
    const filename = `sudarshan_report_${selectedPeriod}.${format}`;
    alert(`Exporting ${filename}...`);
  };

  const totalStats = missionReports.reduce((acc, mission) => ({
    victims: acc.victims + mission.victimsRescued,
    supplies: acc.supplies + mission.suppliesDelivered,
    missions: acc.missions + 1,
    units: acc.units + mission.unitsDeployed
  }), { victims: 0, supplies: 0, missions: 0, units: 0 });

  return (
    <div className="min-h-screen p-4 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-lime-400 bg-clip-text text-transparent">
              Reports & Analytics
            </h1>
            <p className="text-gray-400 text-sm">Mission data and performance insights</p>
          </div>
          <Calendar className="w-6 h-6 text-cyan-400" />
        </div>
      </motion.div>

      {/* Period Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex items-center space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40 bg-gray-900/50 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24hours">Last 24 Hours</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => exportReport('pdf')}
              size="sm"
              variant="outline"
              className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
            >
              <FileText className="w-4 h-4 mr-1" />
              PDF
            </Button>
            <Button
              onClick={() => exportReport('csv')}
              size="sm"
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              <Download className="w-4 h-4 mr-1" />
              CSV
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <Card className="p-4 bg-gray-900/50 border-green-500/30 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{totalStats.victims}</p>
              <p className="text-xs text-gray-400">Victims Rescued</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-900/50 border-blue-500/30 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">{totalStats.supplies}</p>
              <p className="text-xs text-gray-400">Supplies Delivered</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-900/50 border-purple-500/30 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">{totalStats.missions}</p>
              <p className="text-xs text-gray-400">Missions Completed</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-900/50 border-cyan-500/30 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-400">92%</p>
              <p className="text-xs text-gray-400">Success Rate</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4 mb-6"
      >
        {/* Daily Performance Chart */}
        <Card className="p-4 bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
          <h3 className="font-semibold text-white mb-4">Daily Performance</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Bar dataKey="victims" fill="#10B981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="supplies" fill="#3B82F6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-400">Victims Rescued</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-400">Supplies Delivered</span>
            </div>
          </div>
        </Card>

        {/* Efficiency Trend */}
        <Card className="p-4 bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
          <h3 className="font-semibold text-white mb-4">Mission Efficiency Trend</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} domain={[70, 100]} />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#06B6D4" 
                  strokeWidth={2}
                  dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Mission Reports List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
          <div className="p-4 border-b border-gray-700/50">
            <h3 className="font-semibold text-white">Mission History</h3>
          </div>
          <div className="divide-y divide-gray-700/50">
            {missionReports.map((mission, index) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="p-4 hover:bg-gray-800/30 cursor-pointer"
                onClick={() => setSelectedReport(selectedReport?.id === mission.id ? null : mission)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-white">{mission.name}</h4>
                      <Badge className={getStatusColor(mission.status)}>
                        {mission.status}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {mission.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {mission.duration}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">{mission.id}</div>
                    <div className="text-xs text-gray-500">{mission.unitsDeployed} units</div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedReport?.id === mission.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-gray-700/50"
                  >
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold text-green-400">{mission.victimsRescued}</p>
                        <p className="text-xs text-gray-400">Victims Rescued</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-blue-400">{mission.suppliesDelivered}</p>
                        <p className="text-xs text-gray-400">Supplies Delivered</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-purple-400">{mission.unitsDeployed}</p>
                        <p className="text-xs text-gray-400">Units Deployed</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}