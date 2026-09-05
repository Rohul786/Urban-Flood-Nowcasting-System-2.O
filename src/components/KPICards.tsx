import React from 'react';
import { useFlood } from '../context/FloodContext';
import { CloudRain, AlertTriangle, MapPin, Navigation, BellRing, Users, TrendingUp } from 'lucide-react';

export const KPICards: React.FC = () => {
  const { kpis, calculatedZones, setCurrentView, emergencyMode } = useFlood();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'SEVERE':
        return 'text-rose-400 bg-rose-950/60 border-rose-600/60 ring-1 ring-rose-500/40';
      case 'HIGH':
        return 'text-amber-400 bg-amber-950/60 border-amber-600/60 ring-1 ring-amber-500/40';
      case 'MODERATE':
        return 'text-yellow-400 bg-yellow-950/60 border-yellow-600/60 ring-1 ring-yellow-500/30';
      default:
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-600/60 ring-1 ring-emerald-500/30';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'SEVERE':
        return 'bg-rose-500 text-white';
      case 'HIGH':
        return 'bg-orange-500 text-white';
      case 'MODERATE':
        return 'bg-yellow-500 text-slate-950 font-bold';
      default:
        return 'bg-emerald-500 text-slate-950 font-bold';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6">
      {/* 1. CURRENT RAINFALL */}
      <div 
        id="kpi-rainfall"
        onClick={() => setCurrentView('simulation-lab')}
        className="cursor-pointer transition-all hover:bg-[#1A222E] bg-[#151B24] border border-[#1E293B] border-l-4 border-l-cyan-400 rounded p-4 relative"
      >
        <div className="flex items-center justify-between text-slate-400 text-[9px] font-bold font-mono uppercase tracking-widest mb-1.5">
          <span>Rainfall</span>
          <CloudRain className="w-3.5 h-3.5 text-[#00D1FF]" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-mono font-bold text-white leading-none">
            {kpis.currentRainfall}
          </span>
          <span className="text-xs text-slate-500 font-mono uppercase">mm/h</span>
        </div>
        <div className="text-[9px] text-[#00D1FF] mt-2 uppercase font-bold font-mono tracking-tighter flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-ping" />
          <span>Doppler Radar Coupled</span>
        </div>
      </div>

      {/* 2. FLOOD RISK */}
      <div 
        id="kpi-risk"
        onClick={() => setCurrentView('risk-analysis')}
        className={`cursor-pointer transition-all hover:bg-[#1A222E] bg-[#151B24] border border-[#1E293B] border-l-4 rounded p-4 relative ${
          kpis.cityFloodRisk === 'SEVERE' ? 'border-l-red-500' : 'border-l-amber-500'
        } ${emergencyMode ? 'ring-1 ring-red-500/50' : ''}`}
      >
        <div className="flex items-center justify-between text-slate-400 text-[9px] font-bold font-mono uppercase tracking-widest mb-1.5">
          <span>Risk Level</span>
          <AlertTriangle className={`w-3.5 h-3.5 ${kpis.cityFloodRisk === 'SEVERE' ? 'text-red-400' : 'text-amber-400'}`} />
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-xl sm:text-2xl font-mono font-bold uppercase leading-none ${
            kpis.cityFloodRisk === 'SEVERE' ? 'text-red-500' : 'text-amber-400'
          }`}>
            {kpis.cityFloodRisk}
          </span>
        </div>
        <div className="text-[9px] text-slate-400 mt-2 uppercase font-bold font-mono tracking-tighter">
          <span>{kpis.highRiskZonesCount} Monitored Zones</span>
        </div>
      </div>

      {/* 3. DRAINAGE / ZONES */}
      <div 
        id="kpi-zones"
        onClick={() => setCurrentView('live-map')}
        className="cursor-pointer transition-all hover:bg-[#1A222E] bg-[#151B24] border border-[#1E293B] border-l-4 border-l-orange-500 rounded p-4 relative"
      >
        <div className="flex items-center justify-between text-slate-400 text-[9px] font-bold font-mono uppercase tracking-widest mb-1.5">
          <span>High-Risk Zones</span>
          <MapPin className="w-3.5 h-3.5 text-orange-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-mono font-bold text-white leading-none">
            {kpis.highRiskZonesCount}
          </span>
          <span className="text-xs text-slate-500 font-mono uppercase">/ {calculatedZones.length || 23}</span>
        </div>
        <div className="text-[9px] text-orange-400 mt-2 uppercase font-bold font-mono tracking-tighter truncate">
          <span>National Basins</span>
        </div>
      </div>

      {/* 4. AFFECTED ROADS */}
      <div 
        id="kpi-roads"
        onClick={() => setCurrentView('safe-routes')}
        className="cursor-pointer transition-all hover:bg-[#1A222E] bg-[#151B24] border border-[#1E293B] border-l-4 border-l-rose-500 rounded p-4 relative"
      >
        <div className="flex items-center justify-between text-slate-400 text-[9px] font-bold font-mono uppercase tracking-widest mb-1.5">
          <span>Road Inundation</span>
          <Navigation className="w-3.5 h-3.5 text-rose-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-mono font-bold text-white leading-none">
            {kpis.affectedRoadsCount}
          </span>
          <span className="text-xs text-slate-500 font-mono uppercase">Arterials</span>
        </div>
        <div className="text-[9px] text-rose-400 mt-2 uppercase font-bold font-mono tracking-tighter">
          <span>Submerged / Caution</span>
        </div>
      </div>

      {/* 5. ACTIVE ALERTS */}
      <div 
        id="kpi-alerts"
        onClick={() => setCurrentView('alerts')}
        className="cursor-pointer transition-all hover:bg-[#1A222E] bg-[#151B24] border border-[#1E293B] border-l-4 border-l-blue-500 rounded p-4 relative"
      >
        <div className="flex items-center justify-between text-slate-400 text-[9px] font-bold font-mono uppercase tracking-widest mb-1.5">
          <span>Active Alerts</span>
          <BellRing className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-mono font-bold text-white leading-none">
            {kpis.activeAlertsCount}
          </span>
          <span className="text-xs text-slate-500 font-mono uppercase">CAP Triggers</span>
        </div>
        <div className="text-[9px] text-blue-400 mt-2 uppercase font-bold font-mono tracking-tighter">
          <span>NDMA / SDMA Unified Alert</span>
        </div>
      </div>

      {/* 6. POPULATION AT RISK */}
      <div 
        id="kpi-population"
        onClick={() => setCurrentView('infrastructure')}
        className="cursor-pointer transition-all hover:bg-[#1A222E] bg-[#151B24] border border-[#1E293B] border-l-4 border-l-purple-500 rounded p-4 relative"
      >
        <div className="flex items-center justify-between text-slate-400 text-[9px] font-bold font-mono uppercase tracking-widest mb-1.5">
          <span>Pop. At Risk</span>
          <Users className="w-3.5 h-3.5 text-purple-400" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-mono font-bold text-white leading-none">
            {kpis.populationAtRisk.toLocaleString()}
          </span>
        </div>
        <div className="text-[9px] text-purple-400 mt-2 uppercase font-bold font-mono tracking-tighter">
          <span>Urban Center Catchment</span>
        </div>
      </div>
    </div>
  );
};
