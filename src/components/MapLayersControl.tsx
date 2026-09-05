import React from 'react';
import { useFlood } from '../context/FloodContext';
import { 
  Layers, 
  Droplets, 
  CloudRain, 
  Wind,
  Zap,
  Radio,
  Compass,
  GitFork, 
  Navigation, 
  Mountain, 
  Building2, 
  Shield, 
  Flame, 
  Home, 
  GraduationCap, 
  Check,
  Power
} from 'lucide-react';
import { MapLayerVisibility } from '../types';

export const MapLayersControl: React.FC<{ isCompact?: boolean }> = ({ isCompact = false }) => {
  const { mapLayers, toggleMapLayer, showToast } = useFlood();

  // Real-time Weather Radar Layer Definitions
  const weatherRadarItems: {
    key: keyof MapLayerVisibility;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    tag: string;
  }[] = [
    {
      key: 'weatherRadar',
      label: 'Weather Radar Master Overlay',
      description: 'Doppler 2.8GHz sweep beam & range rings',
      icon: Radio,
      accentColor: '#00D1FF',
      tag: 'MASTER'
    },
    {
      key: 'rainfall',
      label: 'Precipitation Density (dBZ)',
      description: 'Doppler reflectivity contours (15 - 65+ dBZ)',
      icon: CloudRain,
      accentColor: '#38bdf8',
      tag: 'DENSITY'
    },
    {
      key: 'windVectors',
      label: 'Wind Speed Vectors & Flow',
      description: 'Directional streamlines & velocity arrows',
      icon: Wind,
      accentColor: '#2dd4bf',
      tag: 'VECTORS'
    },
    {
      key: 'thunderZones',
      label: 'Thunder Probability Zones',
      description: 'CAPE convective instability zones (30 - 95%)',
      icon: Zap,
      accentColor: '#fbbf24',
      tag: 'CONVECTIVE'
    },
    {
      key: 'lightningStrikes',
      label: 'Lightning Flashpoints',
      description: 'Real-time ground strikes & peak kA discharges',
      icon: Zap,
      accentColor: '#f59e0b',
      tag: 'STRIKES'
    }
  ];

  // Hydrological & Infrastructure Layer Definitions
  const hydroLayers: { key: keyof MapLayerVisibility; label: string; icon: React.ComponentType<{ className?: string }>; count?: string }[] = [
    { key: 'floodRisk', label: 'Flood Risk Polygons', icon: Droplets },
    { key: 'waterlogging', label: 'Waterlogging Hotspots', icon: Droplets },
    { key: 'drainageNetwork', label: 'Drainage Conduits', icon: GitFork, count: '10' },
    { key: 'roadNetwork', label: 'Road Risk Status', icon: Navigation, count: '22' },
    { key: 'elevation', label: 'Elevation Contours', icon: Mountain },
  ];

  const infraLayers: { key: keyof MapLayerVisibility; label: string; icon: React.ComponentType<{ className?: string }>; count?: string }[] = [
    { key: 'hospitals', label: 'Hospitals', icon: Building2, count: '6' },
    { key: 'policeStations', label: 'Police Stations', icon: Shield, count: '4' },
    { key: 'fireStations', label: 'Fire Stations', icon: Flame, count: '3' },
    { key: 'emergencyShelters', label: 'Emergency Shelters', icon: Home, count: '5' },
    { key: 'schools', label: 'Schools / Universities', icon: GraduationCap, count: '5' },
    { key: 'powerStations', label: 'Power Substations', icon: Zap, count: '4' },
  ];

  const allRadarActive = mapLayers.weatherRadar && mapLayers.rainfall && mapLayers.windVectors && mapLayers.thunderZones;

  const handleToggleAllRadar = (enable: boolean) => {
    weatherRadarItems.forEach(item => {
      if (enable !== mapLayers[item.key]) {
        toggleMapLayer(item.key);
      }
    });
    showToast(enable ? 'Enabled Full Weather Radar Overlay' : 'Muted Weather Radar Layers');
  };

  return (
    <div className="bg-[#151B24] border border-[#1E293B] rounded p-4 shadow-xl space-y-4">
      {/* Header & Overall Active Counter */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-300 font-mono">
          <Layers className="w-3.5 h-3.5 text-[#00D1FF]" />
          <span>GIS Operational Layers & Radar</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#00D1FF] bg-[#0A0E14] border border-[#1E293B] px-2 py-0.5 rounded">
            {Object.values(mapLayers).filter(Boolean).length} Active
          </span>
        </div>
      </div>

      {/* SECTION 1: REAL-TIME WEATHER RADAR OVERLAY */}
      <div className="bg-[#0B1119] border border-cyan-900/40 rounded-lg p-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2 border-b border-cyan-950/80">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                Real-Time Weather Radar Overlay
              </span>
              <div className="text-[9px] font-mono text-slate-400">
                Simulated Doppler Reflectivity • Vector Streamlines • Convective Hazard Zones
              </div>
            </div>
          </div>

          {/* Quick Radar Master Actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="btn-radar-all-on"
              onClick={() => handleToggleAllRadar(true)}
              className={`px-2 py-1 rounded text-[10px] font-mono transition-all border ${
                allRadarActive
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-[#0D1520] text-slate-400 border-[#1E293B] hover:text-white'
              }`}
              title="Enable all weather radar layers"
            >
              All On
            </button>
            <button
              type="button"
              id="btn-radar-all-off"
              onClick={() => handleToggleAllRadar(false)}
              className="px-2 py-1 rounded text-[10px] font-mono bg-[#0D1520] text-slate-400 border border-[#1E293B] hover:text-rose-300 hover:border-rose-900/50 transition-all"
              title="Mute all weather radar layers"
            >
              Mute
            </button>
          </div>
        </div>

        {/* Weather Radar Layers Grid */}
        <div className={`grid ${isCompact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-2`}>
          {weatherRadarItems.map((item) => {
            const active = mapLayers[item.key];
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                id={`layer-toggle-${item.key}`}
                type="button"
                onClick={() => {
                  toggleMapLayer(item.key);
                  showToast(`${item.label}: ${active ? 'OFF' : 'ON'}`);
                }}
                className={`flex items-center justify-between p-2 rounded text-left transition-all border font-mono group cursor-pointer ${
                  active
                    ? 'bg-[#132030] text-white border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'bg-[#0A0E14] text-slate-400 border-[#1E293B] hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                <div className="flex items-start gap-2 min-w-0 pr-1">
                  <div className={`p-1.5 rounded flex-shrink-0 mt-0.5 ${
                    active ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60' : 'bg-[#151B24] text-slate-500'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold truncate flex items-center gap-1.5">
                      <span className={active ? 'text-white' : 'text-slate-300'}>{item.label}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 truncate mt-0.5 leading-tight">
                      {item.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 pl-1">
                  <span className={`text-[8px] px-1 py-0.5 rounded font-bold uppercase tracking-wider ${
                    active ? 'bg-cyan-400/20 text-cyan-300' : 'bg-[#151B24] text-slate-500'
                  }`}>
                    {item.tag}
                  </span>
                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] transition-colors ${
                    active ? 'bg-cyan-400 text-slate-950 border-cyan-400 font-bold' : 'border-[#1E293B] bg-[#0A0E14]'
                  }`}>
                    {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: FLOOD RISK & DRAINAGE LAYERS */}
      <div className="space-y-1.5">
        <div className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold px-0.5">
          Hydrological & Inundation Layers
        </div>
        <div className={`grid ${isCompact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-2`}>
          {hydroLayers.map((item) => {
            const active = mapLayers[item.key];
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                id={`layer-toggle-${item.key}`}
                type="button"
                onClick={() => toggleMapLayer(item.key)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded text-[11px] font-mono transition-all border text-left cursor-pointer ${
                  active
                    ? 'bg-[#1A2332] text-white border-[#00D1FF]/40 shadow-sm'
                    : 'bg-[#0A0E14] text-slate-400 border-[#1E293B] hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-[#00D1FF]' : 'text-slate-500'}`} />
                  <span className="truncate font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                  {item.count && (
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-[#0A0E14] border border-[#1E293B] text-slate-400">
                      {item.count}
                    </span>
                  )}
                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                    active ? 'bg-[#00D1FF] text-slate-950 border-[#00D1FF] font-bold' : 'border-[#1E293B] bg-[#0A0E14]'
                  }`}>
                    {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: INFRASTRUCTURE & CRITICAL FACILITIES */}
      <div className="space-y-1.5">
        <div className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold px-0.5">
          Critical Infrastructure & Public Safety
        </div>
        <div className={`grid ${isCompact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-2`}>
          {infraLayers.map((item) => {
            const active = mapLayers[item.key];
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                id={`layer-toggle-${item.key}`}
                type="button"
                onClick={() => toggleMapLayer(item.key)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded text-[11px] font-mono transition-all border text-left cursor-pointer ${
                  active
                    ? 'bg-[#1A2332] text-white border-[#00D1FF]/40 shadow-sm'
                    : 'bg-[#0A0E14] text-slate-400 border-[#1E293B] hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-[#00D1FF]' : 'text-slate-500'}`} />
                  <span className="truncate font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                  {item.count && (
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-[#0A0E14] border border-[#1E293B] text-slate-400">
                      {item.count}
                    </span>
                  )}
                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                    active ? 'bg-[#00D1FF] text-slate-950 border-[#00D1FF] font-bold' : 'border-[#1E293B] bg-[#0A0E14]'
                  }`}>
                    {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

