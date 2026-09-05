import React, { useState } from 'react';
import { useFlood } from '../context/FloodContext';
import { ROUTE_PRESETS } from '../services/routingEngine';
import { 
  Navigation, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Share2, 
  Info,
  Car
} from 'lucide-react';

export const RoutePanel: React.FC = () => {
  const { 
    routes, 
    selectedRoutePreset, 
    setSelectedRoutePreset, 
    setCurrentView,
    showToast 
  } = useFlood();

  const [isCalculating, setIsCalculating] = useState(false);

  const activePreset = ROUTE_PRESETS.find(p => p.id === selectedRoutePreset) || ROUTE_PRESETS[0];

  const handleRecalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      showToast(`Safe route recomputed for ${activePreset.name}: -${routes.exposureReductionPercent}% flood hazard reduction applied.`);
    }, 600);
  };

  return (
    <div className="bg-[#151B24] border border-[#1E293B] rounded p-5 shadow-xl space-y-4 font-mono">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#00D1FF]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Safe Route Recommendation Engine (Flood-Weighted Dijkstra / A*)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            Coupling live road inundation depths with elevated bypass corridors
          </p>
        </div>

        <button
          id="btn-view-route-on-map"
          onClick={() => setCurrentView('live-map')}
          className="text-xs text-[#00D1FF] hover:underline flex items-center gap-1 font-mono"
        >
          <span>View Overlays on Full Map →</span>
        </button>
      </div>

      {/* Origin & Destination Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded bg-[#0A0E14] border border-[#1E293B]">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
            Select Origin ➔ Destination Corridor
          </label>
          <select
            id="route-preset-selector"
            value={selectedRoutePreset}
            onChange={(e) => setSelectedRoutePreset(e.target.value)}
            className="w-full bg-[#151B24] border border-[#1E293B] rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#00D1FF] cursor-pointer"
          >
            {ROUTE_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            id="btn-find-safest-route"
            onClick={handleRecalculate}
            disabled={isCalculating}
            className="w-full h-[38px] flex items-center justify-center gap-2 bg-[#00D1FF] hover:bg-[#00B8E6] text-slate-950 font-bold text-xs rounded transition-all shadow-sm disabled:opacity-50 font-mono"
          >
            <Navigation className="w-3.5 h-3.5 fill-current" />
            <span>{isCalculating ? 'COMPUTING CORRIDORS...' : 'CALCULATE SAFE ROUTE'}</span>
          </button>
        </div>
      </div>

      {/* Comparative Route Cards: FASTEST vs FLOOD-SAFE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* ROUTE 1: FASTEST (DIRECT / FLOODED) */}
        <div className="p-4 rounded bg-[#0A0E14] border border-[#1E293B] border-l-4 border-l-red-500 relative overflow-hidden space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              Standard GPS Route (Direct)
            </span>
            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 text-[9px] font-mono font-bold">
              NOT RECOMMENDED
            </span>
          </div>

          <div className="flex items-baseline gap-4">
            <div>
              <span className="text-2xl font-bold font-mono text-white">{routes.fastest.durationMinutes}</span>
              <span className="text-xs text-slate-500 font-mono ml-1">min</span>
            </div>
            <div>
              <span className="text-lg font-bold text-slate-300">{routes.fastest.distanceKm}</span>
              <span className="text-xs text-slate-500 font-mono ml-1">km</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#151B24] border border-red-900/40 text-[11px] text-red-300 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Crosses Flood Zones:</span>
              <b className="text-red-400">{routes.fastest.floodZonesCrossed} critical basins</b>
            </div>
            <div className="flex justify-between">
              <span>Max Road Water Depth:</span>
              <b className="text-red-400">{routes.fastest.maxWaterDepth} m</b>
            </div>
          </div>

          <ul className="text-xs text-slate-400 space-y-1.5 pt-1 font-mono">
            {routes.fastest.instructions.map((inst, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-red-400 font-mono">•</span>
                <span className="text-[11px]">{inst}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ROUTE 2: FLOOD-SAFE (RECOMMENDED) */}
        <div className="p-4 rounded bg-[#0A0E14] border border-[#1E293B] border-l-4 border-l-[#00D1FF] relative overflow-hidden space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#00D1FF] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00D1FF]" />
              Flood-Safe Route (AI Engineered)
            </span>
            <span className="px-2 py-0.5 rounded bg-[#00D1FF] text-slate-950 text-[9px] font-mono font-bold">
              RECOMMENDED
            </span>
          </div>

          <div className="flex items-baseline gap-4">
            <div>
              <span className="text-2xl font-bold font-mono text-[#00D1FF]">{routes.floodSafe.durationMinutes}</span>
              <span className="text-xs text-slate-500 font-mono ml-1">min</span>
            </div>
            <div>
              <span className="text-lg font-bold text-slate-300">{routes.floodSafe.distanceKm}</span>
              <span className="text-xs text-slate-500 font-mono ml-1">km</span>
            </div>
          </div>

          {/* Prompt Delta Highlight Banner */}
          <div className="p-2.5 rounded bg-[#151B24] border border-[#1E293B] text-[11px] font-mono flex items-center justify-between">
            <div className="text-slate-300">
              Travel Time Delta: <b className="text-white">+{routes.deltaMinutes} min</b>
            </div>
            <div className="text-emerald-400 font-bold">
              -{routes.exposureReductionPercent}% flood exposure
            </div>
          </div>

          <ul className="text-xs text-slate-300 space-y-1.5 pt-1 font-mono">
            {routes.floodSafe.instructions.map((inst, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00D1FF] flex-shrink-0 mt-0.5" />
                <span className="text-[11px]">{inst}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Share & Export Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Info className="w-3.5 h-3.5 text-[#00D1FF]" />
          <span>Bypasses low-lying subways: Ultadanga, Behala Tram line, and Thanthania basin</span>
        </div>

        <button
          id="btn-dispatch-traffic-advisory"
          onClick={() => showToast('Dispatched traffic advisory to Kolkata Police Traffic HQ & Emergency Broadcast SMS.')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0A0E14] hover:bg-[#1E293B] text-white text-xs font-semibold transition-colors border border-[#1E293B] font-mono"
        >
          <Share2 className="w-3.5 h-3.5 text-[#00D1FF]" />
          <span>Dispatch Citizen Traffic Advisory</span>
        </button>
      </div>

    </div>
  );
};
