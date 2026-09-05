import React from 'react';
import { useFlood } from '../context/FloodContext';
import { 
  Sparkles, 
  BrainCircuit, 
  AlertTriangle, 
  Droplets, 
  Mountain, 
  Activity, 
  Clock, 
  Navigation,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export const ExplainableAIPanel: React.FC = () => {
  const { currentSelectedZone, calculatedZones, setSelectedZoneId, setCurrentView } = useFlood();

  if (!currentSelectedZone) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center text-slate-400">
        Select a zone on the map to inspect AI flood risk factors.
      </div>
    );
  }

  const zone = currentSelectedZone;
  const contrib = zone.contributions;

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'SEVERE':
        return 'bg-red-500/20 text-red-400 border border-red-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/40';
      case 'MODERATE':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
    }
  };

  return (
    <div className="bg-[#151B24] border border-[#1E293B] rounded p-5 shadow-xl space-y-4 font-mono">
      
      {/* Zone Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase text-[#00D1FF] font-bold tracking-widest">
              Micro-Catchment Diagnostic
            </span>
            <span className="text-slate-600 text-xs">•</span>
            <span className="text-[10px] text-slate-500">ZONE_ID: {zone.zoneId}</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
            <h2 className="text-lg font-bold text-white tracking-tight uppercase">
              {zone.name}
            </h2>
            {zone.state && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
                {zone.state} {zone.riverBasin ? `• ${zone.riverBasin}` : ''}
              </span>
            )}
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${getRiskBadge(zone.riskLevel)}`}>
              {zone.riskLevel}
            </span>
          </div>
        </div>

        {/* Quick Dropdown Zone Switcher */}
        <div className="relative">
          <select
            id="zone-select-dropdown"
            value={zone.zoneId}
            onChange={(e) => setSelectedZoneId(e.target.value)}
            className="w-full sm:w-auto bg-[#0A0E14] border border-[#1E293B] rounded px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#00D1FF] cursor-pointer"
          >
            {calculatedZones.map(z => (
              <option key={z.zoneId} value={z.zoneId}>
                {z.state ? `[${z.state}] ` : ''}{z.name} ({z.riskLevel} - {z.floodProbability}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Key Hydrodynamic Parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="bg-[#0A0E14] border border-[#1E293B] rounded p-3">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Rainfall</span>
          <div className="text-base font-bold text-white mt-1 flex items-baseline gap-1">
            {zone.rainfall} <span className="text-[9px] text-[#00D1FF]">mm/h</span>
          </div>
        </div>

        <div className="bg-[#0A0E14] border border-[#1E293B] rounded p-3">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Elevation</span>
          <div className="text-base font-bold text-white mt-1 flex items-baseline gap-1">
            {zone.elevation} <span className="text-[9px] text-slate-500">m ASL</span>
          </div>
        </div>

        <div className="bg-[#0A0E14] border border-[#1E293B] rounded p-3">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Drainage Cap.</span>
          <div className="text-base font-bold text-white mt-1 flex items-baseline gap-1">
            {zone.drainageCapacity} <span className="text-[9px] text-slate-500">%</span>
          </div>
        </div>

        <div className="bg-[#0A0E14] border border-[#1E293B] rounded p-3">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Drain Stress</span>
          <div className={`text-base font-bold mt-1 flex items-baseline gap-1 ${
            zone.drainageStress > 80 ? 'text-red-400' : 'text-amber-400'
          }`}>
            {zone.drainageStress} <span className="text-[9px] text-slate-500">%</span>
          </div>
        </div>

        <div className="bg-[#0A0E14] border border-[#1E293B] rounded p-3">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Water Depth</span>
          <div className="text-base font-bold text-red-400 mt-1 flex items-baseline gap-1">
            {zone.waterDepth} <span className="text-[9px] text-slate-500">m</span>
          </div>
        </div>

        <div className="bg-[#0A0E14] border border-[#1E293B] rounded p-3">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Flood Prob.</span>
          <div className="text-base font-bold text-[#00D1FF] mt-1 flex items-baseline gap-1">
            {zone.floodProbability} <span className="text-[9px] text-slate-500">%</span>
          </div>
        </div>
      </div>

      {/* Inundation Timing & Action Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded bg-[#0A0E14] border border-[#1E293B]">
        <div className="flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Inundation Window</span>
            <p className="text-xs font-bold text-slate-200 mt-0.5">{zone.expectedFloodingTime}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Recommended Municipal Action</span>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-sans">{zone.recommendedAction}</p>
          </div>
        </div>
      </div>

      {/* EXPLAINABLE AI (XAI) SECTION */}
      <div className="p-4 rounded bg-[#0A0E14] border border-[#1E293B] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-[#00D1FF]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Explainable AI (XAI) Factor Attribution
            </h3>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#151B24] border border-[#1E293B] text-[#00D1FF] text-[10px]">
            <Sparkles className="w-3 h-3 text-[#00D1FF]" />
            <span>AI CONFIDENCE: <b>{zone.confidence}%</b></span>
          </div>
        </div>

        {/* Natural Language Diagnostic Summary */}
        <div className="p-3 rounded bg-[#151B24] border border-[#1E293B] text-xs text-slate-300 leading-relaxed font-sans">
          "{zone.explanation}"
        </div>

        {/* Contribution Breakdown Bars */}
        <div className="space-y-2 pt-1 text-xs">
          {/* 1. Heavy Rainfall */}
          <div>
            <div className="flex justify-between text-slate-300 text-[10px] mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] inline-block" />
                Heavy Rainfall Intensity
              </span>
              <span className="text-[#00D1FF] font-bold">+{contrib.rainfall}%</span>
            </div>
            <div className="w-full h-1.5 rounded bg-[#151B24] overflow-hidden">
              <div 
                className="h-full bg-[#00D1FF] transition-all duration-700" 
                style={{ width: `${contrib.rainfall}%` }}
              />
            </div>
          </div>

          {/* 2. Poor Drainage / Stress */}
          <div>
            <div className="flex justify-between text-slate-300 text-[10px] mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                Drainage Hydraulic Stress & Siltation
              </span>
              <span className="text-red-400 font-bold">+{contrib.drainageStress}%</span>
            </div>
            <div className="w-full h-1.5 rounded bg-[#151B24] overflow-hidden">
              <div 
                className="h-full bg-red-500 transition-all duration-700" 
                style={{ width: `${contrib.drainageStress}%` }}
              />
            </div>
          </div>

          {/* 3. Low Elevation */}
          <div>
            <div className="flex justify-between text-slate-300 text-[10px] mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                Low Elevation / Depression Bowl
              </span>
              <span className="text-amber-400 font-bold">+{contrib.elevation}%</span>
            </div>
            <div className="w-full h-1.5 rounded bg-[#151B24] overflow-hidden">
              <div 
                className="h-full bg-amber-400 transition-all duration-700" 
                style={{ width: `${contrib.elevation}%` }}
              />
            </div>
          </div>

          {/* 4. Historical Waterlogging */}
          <div>
            <div className="flex justify-between text-slate-300 text-[10px] mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
                Historical Waterlogging Recurrence
              </span>
              <span className="text-purple-400 font-bold">+{contrib.historical}%</span>
            </div>
            <div className="w-full h-1.5 rounded bg-[#151B24] overflow-hidden">
              <div 
                className="h-full bg-purple-500 transition-all duration-700" 
                style={{ width: `${contrib.historical}%` }}
              />
            </div>
          </div>

          {/* 5. Impervious Surface */}
          <div>
            <div className="flex justify-between text-slate-300 text-[10px] mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Impervious Paved Surface
              </span>
              <span className="text-emerald-400 font-bold">+{contrib.impervious}%</span>
            </div>
            <div className="w-full h-1.5 rounded bg-[#151B24] overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-700" 
                style={{ width: `${contrib.impervious}%` }}
              />
            </div>
          </div>

          {/* 6. Soil & Other Factors */}
          <div>
            <div className="flex justify-between text-slate-300 text-[10px] mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
                Soil Saturation & Topographic Slope
              </span>
              <span className="text-slate-400 font-bold">+{contrib.soilSaturation + contrib.other}%</span>
            </div>
            <div className="w-full h-1.5 rounded bg-[#151B24] overflow-hidden">
              <div 
                className="h-full bg-slate-500 transition-all duration-700" 
                style={{ width: `${contrib.soilSaturation + contrib.other}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button
          id="btn-inspect-safe-route"
          onClick={() => setCurrentView('safe-routes')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0A0E14] hover:bg-[#1E293B] text-[#00D1FF] border border-[#1E293B] text-xs font-semibold transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Calculate Safe Bypass Corridor</span>
        </button>

        <button
          id="btn-inspect-nowcast"
          onClick={() => setCurrentView('nowcast')}
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          View 0-3h Nowcast Curve →
        </button>
      </div>

    </div>
  );
};
