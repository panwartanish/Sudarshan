import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Users, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Play, 
  Save,
  Target,
  Zap,
  Plane,
  Truck,
  Crosshair,
  PersonStanding,
  ShieldAlert
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface MapMarker {
  id: string;
  type: 'zone' | 'victim' | 'hazard' | 'unit';
  x: number;
  y: number;
  label: string;
  assigned?: string[];
}

interface Assignment {
  unitId: string;
  unitType: 'drone' | 'rover';
  unitName: string;
  target: string;
  status: 'pending' | 'assigned';
}

export function MissionPlanning() {
  const [markers, setMarkers] = useState<MapMarker[]>([
    { id: 'Z1', type: 'zone', x: 30, y: 40, label: 'Zone Alpha', assigned: ['D-001'] },
    { id: 'V1', type: 'victim', x: 60, y: 20, label: 'Victim Group 1' },
    { id: 'V2', type: 'victim', x: 80, y: 70, label: 'Victim Group 2' },
    { id: 'H1', type: 'hazard', x: 45, y: 55, label: 'Fire Hazard' },
    { id: 'H2', type: 'hazard', x: 65, y: 80, label: 'Debris Field' }
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    { unitId: 'D-001', unitType: 'drone', unitName: 'Falcon Alpha', target: 'Zone Alpha', status: 'assigned' },
    { unitId: 'D-002', unitType: 'drone', unitName: 'Eagle Beta', target: 'Unassigned', status: 'pending' },
    { unitId: 'R-001', unitType: 'rover', unitName: 'Titan One', target: 'Victim Group 1', status: 'assigned' }
  ]);

  const [selectedMarkerType, setSelectedMarkerType] = useState<'zone' | 'victim' | 'hazard'>('zone');
  const [newMarkerLabel, setNewMarkerLabel] = useState('');
  const [missionName, setMissionName] = useState('Emergency Response Alpha-7');
  const [isPlacingMarker, setIsPlacingMarker] = useState(false);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlacingMarker || !newMarkerLabel) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const newMarker: MapMarker = {
      id: `${selectedMarkerType.toUpperCase()[0]}${markers.length + 1}`,
      type: selectedMarkerType,
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
      label: newMarkerLabel,
      assigned: []
    };

    setMarkers(prev => [...prev, newMarker]);
    setNewMarkerLabel('');
    setIsPlacingMarker(false);
  };

  const removeMarker = (markerId: string) => {
    setMarkers(prev => prev.filter(m => m.id !== markerId));
  };

  const assignUnit = (unitId: string, target: string) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.unitId === unitId 
        ? { ...assignment, target, status: 'assigned' as const }
        : assignment
    ));
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'zone': return <Target className="w-4 h-4" />;
      case 'victim': return <Users className="w-4 h-4" />;
      case 'hazard': return <AlertTriangle className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'zone': return 'border-cyan-500 bg-cyan-500/20 text-cyan-400';
      case 'victim': return 'border-orange-500 bg-orange-500/20 text-orange-400';
      case 'hazard': return 'border-red-500 bg-red-500/20 text-red-400';
      default: return 'border-gray-500 bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen p-4 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Mission Planning
        </h1>
        <p className="text-gray-400 text-sm">Design and deploy response missions</p>
      </motion.div>

      {/* Mission Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4"
      >
        <Card className="p-4 bg-gray-900/50 border-blue-500/30 backdrop-blur-sm">
          <div className="space-y-3">
            <div>
              <Label htmlFor="mission-name" className="text-blue-400">Mission Name</Label>
              <Input
                id="mission-name"
                value={missionName}
                onChange={(e) => setMissionName(e.target.value)}
                className="bg-black/50 border-gray-700 focus:border-blue-500 text-white mt-1"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Planning Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <Card className="h-64 bg-gray-900/50 border-cyan-500/30 backdrop-blur-sm overflow-hidden">
          <div 
            className="relative w-full h-full cursor-crosshair"
            onClick={handleMapClick}
          >
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            
            {/* Grid Labels */}
            <div className="absolute top-2 left-2 text-xs text-gray-500">
              A1
            </div>
            <div className="absolute top-2 right-2 text-xs text-gray-500">
              J1
            </div>
            <div className="absolute bottom-2 left-2 text-xs text-gray-500">
              A10
            </div>
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              J10
            </div>

            {/* Markers */}
            {markers.map((marker) => (
              <motion.div
                key={marker.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute group"
                style={{ left: `${marker.x}%`, top: `${marker.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div className={`w-8 h-8 rounded-full border-2 ${getMarkerColor(marker.type)} flex items-center justify-center text-lg relative cursor-pointer`}>
                  {getMarkerIcon(marker.type)}
                  
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMarker(marker.id);
                    }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-2 h-2 text-white" />
                  </button>
                </div>
                
                {/* Label */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                  {marker.label}
                </div>
              </motion.div>
            ))}

            {/* Placement Instructions */}
            {isPlacingMarker && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-gray-900 p-4 rounded-lg border border-cyan-500/50">
                  <p className="text-cyan-400 text-sm">Click anywhere to place {selectedMarkerType}</p>
                  <Button
                    onClick={() => setIsPlacingMarker(false)}
                    size="sm"
                    variant="outline"
                    className="mt-2 border-gray-500 text-gray-400"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Add Marker Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-4"
      >
        <Card className="p-4 bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
          <h3 className="font-semibold text-white mb-3">Add Map Markers</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-400">Marker Type</Label>
                <Select value={selectedMarkerType} onValueChange={(value: any) => setSelectedMarkerType(value)}>
                  <SelectTrigger className="bg-black/50 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zone">
                      <div className="flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Disaster Zone
                      </div>
                    </SelectItem>
                    <SelectItem value="victim">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Victim Location
                      </div>
                    </SelectItem>
                    <SelectItem value="hazard">
                      <div className="flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Hazard
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-400">Label</Label>
                <Input
                  value={newMarkerLabel}
                  onChange={(e) => setNewMarkerLabel(e.target.value)}
                  placeholder="Enter marker name"
                  className="bg-black/50 border-gray-700 text-white"
                />
              </div>
            </div>
            <Button
              onClick={() => setIsPlacingMarker(true)}
              disabled={!newMarkerLabel}
              className="w-full bg-gradient-to-r from-cyan-500 to-lime-500 hover:from-cyan-600 hover:to-lime-600 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Place Marker
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Unit Assignments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-4"
      >
        <Card className="p-4 bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
          <h3 className="font-semibold text-white mb-3">Unit Assignments</h3>
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <div key={assignment.unitId} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full ${assignment.unitType === 'drone' ? 'bg-cyan-500/20' : 'bg-lime-500/20'} flex items-center justify-center`}>
                    {assignment.unitType === 'drone' ? (
                      <Plane className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Truck className="w-4 h-4 text-lime-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{assignment.unitName}</p>
                    <p className="text-sm text-gray-400">{assignment.unitId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Select 
                    value={assignment.target} 
                    onValueChange={(value) => assignUnit(assignment.unitId, value)}
                  >
                    <SelectTrigger className="w-32 bg-black/50 border-gray-700 text-white text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unassigned">Unassigned</SelectItem>
                      {markers.map((marker) => (
                        <SelectItem key={marker.id} value={marker.label}>
                          <div className="flex items-center">
                            {getMarkerIcon(marker.type)}
                            <span className="ml-2">{marker.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Badge 
                    className={assignment.status === 'assigned' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }
                  >
                    {assignment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-2 gap-3"
      >
        <Button
          variant="outline"
          className="h-12 border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Plan
        </Button>
        <Button
          className="h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0"
        >
          <Play className="w-4 h-4 mr-2" />
          Deploy Mission
        </Button>
      </motion.div>
    </div>
  );
}