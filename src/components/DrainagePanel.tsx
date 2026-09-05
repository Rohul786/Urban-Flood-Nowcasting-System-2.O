import React, { useState } from 'react';
import { useFlood } from '../context/FloodContext';
import { 
  GitFork, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Search, 
  ArrowUpRight, 
  Gauge,
  SlidersHorizontal
} from 'lucide-react';
import { DrainageSegment, DrainageStatus } from '../types';

export const DrainagePanel: React.FC = () => {
  const { drainageNetworks, setCurrentView, setSelectedZoneId } = useFlood();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredDrains = drainageNetworks.filter(d => {
    if (filterStatus === 'ALL') return true;
    return d.status === filterStatus;
  });

  const getStatusBadge = (status: DrainageStatus) => {
    switch (status) {
      case 'BLOCKED':
        return 'bg-purple-950/60 text-purple-300 border border-purple-600/50';
      case 'CRITICAL':
        return 'bg-red-950/60 text-red-300 border border-red-600/50';
      case 'STRESSED':
        return 'bg-amber-950/60 text-amber-300 border border-amber-600/50';
      default:
        return 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/50';
    }
  };

  const getProgressBarColor = (status: DrainageStatus) => {
    switch (status) {
      case 'BLOCKED': return 'bg-purple-500';
      case 'CRITICAL': return 'bg-red-500';
      case 'STRESSED': return 'bg-amber-500';
      default: return 'bg-[#00D1FF]';
    }
  };

  const totalCapacity = drainageNetworks.reduce((sum, d) => sum + d.baseCapacity, 0);
  const totalLoad = drainageNetworks.reduce((sum, d) => sum + d.currentLoad, 0);
  const overallUtilization = Math.round((totalLoad / totalCapacity) * 100);

  return (
    <div className="bg-[#151B24] border border-[#1E293B] rounded p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="w-4 h-4 text-[#00D1FF]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Drainage Network Intelligence (KMC & I&W Department)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            Real-time hydrodynamic hydraulic loading & culvert blockage probability telemetry
          </p>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#0A0E14] border border-[#1E293B] text-xs font-mono">
          <Gauge className="w-3.5 h-3.5 text-[#00D1FF]" />
          <span className="text-slate-400 text-[11px]">GRID LOAD:</span>
          <span className={`font-bold text-xs ${overallUtilization > 85 ? 'text-red-400' : 'text-[#00D1FF]'}`}>
            {overallUtilization}%
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5 text-xs font-mono">
          {['ALL', 'CRITICAL', 'BLOCKED', 'STRESSED', 'NORMAL'].map((s) => (
            <button
              key={s}
              id={`filter-drain-${s}`}
              onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                filterStatus === s 
                  ? 'bg-[#00D1FF] text-slate-950 font-bold border border-[#00D1FF]' 
                  : 'bg-[#0A0E14] text-slate-400 hover:text-white border border-[#1E293B]'
              }`}
            >
              {s} {s !== 'ALL' && `(${drainageNetworks.filter(d => d.status === s).length})`}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentView('simulation-lab')}
          className="text-xs text-[#00D1FF] hover:underline flex items-center gap-1 font-mono"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Adjust Siltation in Sim Lab →</span>
        </button>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
        {filteredDrains.map((drain) => {
          const isOverloaded = drain.status === 'CRITICAL' || drain.status === 'BLOCKED';
          return (
            <div
              key={drain.id}
              id={`drain-card-${drain.id}`}
              className={`p-3.5 rounded border transition-all relative overflow-hidden bg-[#0A0E14] border-[#1E293B] hover:border-slate-700 ${
                isOverloaded ? 'ring-1 ring-red-500/20' : ''
              }`}
            >
              {/* Top Row: Drain ID, Name, Status Badge */}
              <div className="flex items-start justify-between gap-2 pl-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-[#00D1FF]">{drain.id}</span>
                    <span className="text-slate-600 text-xs">•</span>
                    <h4 className="text-xs font-bold text-white line-clamp-1 font-mono">{drain.name}</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 line-clamp-1">
                    Outfall: {drain.outfall}
                  </p>
                </div>

                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase ${getStatusBadge(drain.status)}`}>
                  {drain.status}
                </span>
              </div>

              {/* Capacity vs Load Bar */}
              <div className="mt-3 space-y-1 pl-2">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-500 uppercase tracking-widest">Hydraulic Load</span>
                  <span className="text-slate-300 font-bold">
                    {drain.currentLoad} / {drain.baseCapacity} m³/min
                  </span>
                </div>
                <div className="w-full h-1.5 rounded bg-[#151B24] overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${getProgressBarColor(drain.status)}`}
                    style={{ width: `${Math.min(100, drain.utilization)}%` }}
                  />
                </div>
              </div>

              {/* Metrics Bottom Row */}
              <div className="mt-3 pt-2.5 border-t border-[#1E293B] grid grid-cols-2 gap-2 text-[10px] font-mono pl-2">
                <div>
                  <span className="text-slate-500 uppercase tracking-widest block">Utilization</span>
                  <span className={`font-bold text-xs ${drain.utilization > 90 ? 'text-red-400' : 'text-slate-300'}`}>
                    {drain.utilization}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-widest block">Blockage Risk</span>
                  <span className={`font-bold text-xs ${drain.blockageProbability > 70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {drain.blockageProbability}%
                  </span>
                </div>
              </div>

              {/* Visual Highlight Bar on Left */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                drain.status === 'BLOCKED' ? 'bg-purple-500' :
                drain.status === 'CRITICAL' ? 'bg-red-500' :
                drain.status === 'STRESSED' ? 'bg-amber-500' : 'bg-[#00D1FF]'
              }`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
