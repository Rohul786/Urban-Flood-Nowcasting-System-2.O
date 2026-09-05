import React from 'react';
import { 
  HISTORICAL_EVENTS, 
  DRAINAGE_BOTTLENECKS, 
  ACCURACY_BENCHMARKS,
  FLOOD_RECURRENCE_DATA
} from '../data/historical';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { LineChart as LineChartIcon, Award, AlertOctagon, TrendingUp, History } from 'lucide-react';

export const HistoricalAnalytics: React.FC = () => {
  return (
    <div className="bg-[#151B24] border border-[#1E293B] rounded p-5 shadow-xl space-y-5 font-mono">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#00D1FF]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Historical Flood Archive & Model Benchmarking (Kolkata Basin)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            NCMRWF meteorological archives coupled with KMC drainage bottleneck telemetry
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#0A0E14] border border-[#1E293B] text-xs font-mono">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400 text-[11px]">AI Model Skill Score:</span>
          <span className="text-[#00D1FF] font-bold">89.4% CSI</span>
        </div>
      </div>

      {/* Historical Major Events Cards */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase text-[#00D1FF] font-bold tracking-widest block">
          Historical Storm Inundation Benchmarks
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {HISTORICAL_EVENTS.map((evt) => (
            <div
              key={evt.year}
              className="p-3.5 rounded bg-[#0A0E14] border border-[#1E293B] border-l-4 border-l-[#00D1FF] hover:border-slate-700 transition-all space-y-2"
            >
              <div className="flex items-center justify-between pl-1">
                <span className="text-xs font-mono font-bold text-[#00D1FF]">{evt.year}</span>
                <span className="text-[10px] font-mono text-slate-500">{evt.duration}</span>
              </div>
              <h4 className="text-xs font-bold text-white font-mono pl-1">{evt.eventName}</h4>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-slate-300 pl-1">
                <div>
                  <span className="text-slate-500 block uppercase">Peak Rain</span>
                  <b>{evt.peakRainfall}</b>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">Max Depth</span>
                  <b className="text-red-400">{evt.maxWaterDepth}</b>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono pt-1.5 border-t border-[#1E293B] pl-1">
                Outfall Tide: <span className="text-slate-300">{evt.tideInfluence}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid: Accuracy Benchmark & Recurrence Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* 1. Accuracy Benchmark (Conventional vs FloodGuard AI) */}
        <div className="p-4 rounded bg-[#0A0E14] border border-[#1E293B] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#00D1FF]" />
              Nowcast Verification: Conventional vs AI
            </span>
            <span className="text-emerald-400 font-bold text-[11px]">+25% Skill Gain</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ACCURACY_BENCHMARKS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="metric" stroke="#64748B" fontSize={10} fontStyle="monospace" />
                <YAxis stroke="#64748B" fontSize={10} fontStyle="monospace" unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0E14', borderColor: '#1E293B', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Bar dataKey="conventional" name="Conventional 1D Physics" fill="#64748B" radius={[2, 2, 0, 0]} />
                <Bar dataKey="floodguard" name="FloodGuard AI (Coupled)" fill="#00D1FF" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[10px] text-slate-500 font-mono">
            Coupling drainage hydraulic conduit stress with elevation removes 78% of false alarms in coastal and delta cities.
          </p>
        </div>

        {/* 2. Drainage Bottlenecks Ranking */}
        <div className="p-4 rounded bg-[#0A0E14] border border-[#1E293B] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-red-500" />
              Critical Bottlenecks (Recurrence Frequency)
            </span>
            <span className="text-red-400 font-bold text-[11px]">KMC Telemetry</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={DRAINAGE_BOTTLENECKS} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis type="number" stroke="#64748B" fontSize={10} fontStyle="monospace" unit="%" />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={9} fontStyle="monospace" width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0E14', borderColor: '#1E293B', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
                  formatter={(value: any) => [`${value}% Overcapacity Risk`, 'Stress Index']}
                />
                <Bar dataKey="riskScore" name="Hydraulic Stress Score" fill="#FF4B2B" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[10px] text-slate-500 font-mono">
            Circular Canal and Ultadanga Subways present the highest backflow vulnerability during high tide.
          </p>
        </div>

      </div>

    </div>
  );
};
