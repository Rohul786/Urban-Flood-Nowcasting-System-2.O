import React from 'react';
import { useFlood } from '../context/FloodContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { Clock, Play, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';
import { NowcastStep } from '../types';

export const NowcastTimeline: React.FC = () => {
  const { 
    nowcastStep, 
    setNowcastStep, 
    currentSelectedZone, 
    simulationParams, 
    calculatedZones,
    setSelectedZoneId
  } = useFlood();

  const timeOptions: { step: NowcastStep; label: string; minute: number }[] = [
    { step: 0, label: '0 min (Current)', minute: 0 },
    { step: 0.5, label: '+30 min', minute: 30 },
    { step: 1.0, label: '+60 min', minute: 60 },
    { step: 1.5, label: '+90 min', minute: 90 },
    { step: 2.0, label: '+120 min', minute: 120 },
    { step: 3.0, label: '+180 min', minute: 180 },
  ];

  const zone = currentSelectedZone || calculatedZones[0];

  // Generate 0-3 hour predicted water level curve based on zone's rainfall & drainage
  const generateWaterLevelCurve = () => {
    const baseRain = zone.rainfall;
    const baseStress = zone.drainageStress / 100;
    const lowElevBonus = Math.max(0, (8 - zone.elevation) * 0.05);

    const data = [
      { time: '0m', depth: +(0.15 * baseStress + lowElevBonus).toFixed(2), rainfall: baseRain, threshold: 0.30 },
      { time: '+30m', depth: +(0.28 * baseStress * 1.1 + lowElevBonus).toFixed(2), rainfall: Math.round(baseRain * 1.08), threshold: 0.30 },
      { time: '+60m', depth: +(0.48 * baseStress * 1.25 + lowElevBonus).toFixed(2), rainfall: Math.round(baseRain * 1.2), threshold: 0.30 },
      { time: '+90m', depth: +(0.62 * baseStress * 1.35 + lowElevBonus).toFixed(2), rainfall: Math.round(baseRain * 1.15), threshold: 0.30 },
      { time: '+120m', depth: +(0.54 * baseStress * 1.2 + lowElevBonus).toFixed(2), rainfall: Math.round(baseRain * 0.95), threshold: 0.30 },
      { time: '+180m', depth: +(0.38 * baseStress * 0.95 + lowElevBonus).toFixed(2), rainfall: Math.round(baseRain * 0.7), threshold: 0.30 },
    ];
    return data;
  };

  const chartData = generateWaterLevelCurve();

  return (
    <div className="bg-[#151B24] border border-[#1E293B] rounded p-5 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00D1FF]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              AI Hydrodynamic Nowcast (0–3 Hours Horizon)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            Micro-catchment rainfall runoff routing coupled with drainage backwater propagation
          </p>
        </div>

        {/* Selected Zone Label */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-mono uppercase tracking-wider">Location:</span>
          <select
            value={zone.zoneId}
            onChange={(e) => setSelectedZoneId(e.target.value)}
            className="bg-[#0A0E14] border border-[#1E293B] text-xs font-mono font-bold text-[#00D1FF] rounded px-2.5 py-1 focus:outline-none focus:border-cyan-500"
          >
            {calculatedZones.map(z => (
              <option key={z.zoneId} value={z.zoneId}>{z.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Time Slider & Quick Buttons */}
      <div className="p-4 rounded bg-[#0A0E14] border border-[#1E293B] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
            Selected Nowcast Horizon:
          </span>
          <span className="px-2.5 py-1 rounded bg-[#00D1FF] text-slate-950 text-[10px] font-mono font-bold shadow-sm">
            +{Math.round(nowcastStep * 60)} MINUTES AHEAD
          </span>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min={0}
          max={5}
          step={1}
          value={timeOptions.findIndex(t => t.step === nowcastStep)}
          onChange={(e) => setNowcastStep(timeOptions[Number(e.target.value)].step)}
          className="w-full accent-[#00D1FF] cursor-pointer h-1.5 bg-[#1E293B] rounded appearance-none"
        />

        {/* Discrete Step Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
          {timeOptions.map((opt) => {
            const isActive = nowcastStep === opt.step;
            return (
              <button
                key={opt.step}
                id={`nowcast-btn-${opt.step}`}
                onClick={() => setNowcastStep(opt.step)}
                className={`px-2.5 py-2 rounded text-[11px] font-mono transition-all text-center border ${
                  isActive
                    ? 'bg-[#00D1FF] text-slate-950 font-bold border-cyan-400'
                    : 'bg-[#11161D] text-slate-400 hover:text-white border-[#1E293B] hover:bg-[#1E293B]'
                }`}
              >
                <div>{opt.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3-Hour Projected Inundation Line Chart */}
      <div className="p-4 rounded bg-[#0A0E14] border border-[#1E293B] space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold flex items-center gap-1.5 text-[11px]">
            <TrendingUp className="w-3.5 h-3.5 text-[#00D1FF]" />
            Predicted Water Depth & Drainage Inundation Curve ({zone.name})
          </span>
          <span className="text-[#FF4B2B] text-[10px] font-mono font-semibold">
            --- Inundation Threshold: 0.30m
          </span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="depthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D1FF" stopOpacity={0.7}/>
                  <stop offset="95%" stopColor="#00D1FF" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontStyle="monospace" />
              <YAxis stroke="#64748b" fontSize={11} fontStyle="monospace" unit="m" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#151B24', borderColor: '#1E293B', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
                formatter={(value: any) => [`${value} meters`, 'Water Depth']}
              />
              <ReferenceLine y={0.30} stroke="#FF4B2B" strokeDasharray="3 3" label={{ value: 'Inundation Warning (0.3m)', fill: '#FF4B2B', fontSize: 10, position: 'insideTopRight' }} />
              <Area type="monotone" dataKey="depth" stroke="#00D1FF" strokeWidth={2} fillOpacity={1} fill="url(#depthGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
          <span>Simulation Time-Step: Δt = 30 min</span>
          <span className="text-[#00D1FF]">Peak predicted at +60m to +90m</span>
        </div>
      </div>

    </div>
  );
};
