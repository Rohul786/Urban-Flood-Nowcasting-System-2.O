import React from 'react';
import { useFlood } from '../context/FloodContext';
import { 
  FlaskConical, 
  RotateCcw, 
  Sparkles, 
  CloudRain, 
  Clock, 
  GitFork, 
  Waves, 
  Droplets,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/historical';
import { TidalLevel, SoilSaturation } from '../types';

export const SimulationLab: React.FC = () => {
  const { 
    simulationParams, 
    runSimulationTrigger,
    applyPreset, 
    setCurrentView,
    kpis,
    emergencyMode
  } = useFlood();

  const updateSimulationParams = (updates: Partial<typeof simulationParams>) => {
    if (updates.rainfallIntensity !== undefined) {
      updates.rainfall = updates.rainfallIntensity;
    }
    if (updates.drainageBlockagePercent !== undefined) {
      updates.drainBlockage = updates.drainageBlockagePercent;
    }
    runSimulationTrigger(updates);
  };

  const resetSimulation = () => {
    applyPreset('NORMAL');
  };

  const currentRainfall = simulationParams.rainfallIntensity ?? simulationParams.rainfall;
  const currentBlockage = simulationParams.drainageBlockagePercent ?? simulationParams.drainBlockage;
  const currentDuration = simulationParams.durationMinutes ?? 60;
  const currentTidal: TidalLevel = simulationParams.tidalLevel ?? 'NORMAL';
  const currentSoil: SoilSaturation = typeof simulationParams.soilSaturation === 'string' 
    ? (simulationParams.soilSaturation as SoilSaturation)
    : (simulationParams.soilSaturation > 70 ? 'SATURATED' : simulationParams.soilSaturation > 40 ? 'NORMAL' : 'DRY');

  return (
    <div className="bg-[#151B24] border border-[#1E293B] rounded p-5 shadow-xl space-y-5 font-mono">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-[#00D1FF]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Simulation Lab (Hydrometeorological What-If Engine)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            Stress-test urban drainage capacity and simulate extreme meteorological cloudbursts
          </p>
        </div>

        <button
          id="btn-reset-simulation"
          onClick={resetSimulation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0A0E14] hover:bg-[#1E293B] text-slate-300 border border-[#1E293B] text-xs font-mono transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#00D1FF]" />
          <span>Reset Baseline</span>
        </button>
      </div>

      {/* Preset Scenarios Buttons */}
      <div className="space-y-2">
        <label className="text-[10px] font-mono text-[#00D1FF] uppercase font-bold tracking-widest block">
          Preset Operational Scenarios (Stress-Testing Matrix)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {PRESET_SCENARIOS.map((preset) => {
            const isMatch = 
              currentRainfall === preset.params.rainfallIntensity &&
              currentBlockage === preset.params.drainageBlockagePercent;

            return (
              <button
                key={preset.id}
                id={`preset-btn-${preset.id}`}
                onClick={() => {
                  applyPreset(preset.presetKey);
                  runSimulationTrigger(preset.params);
                }}
                className={`p-3 rounded border text-left transition-all relative overflow-hidden group ${
                  isMatch
                    ? 'bg-[#0A0E14] border-[#00D1FF] border-l-4 border-l-[#00D1FF]'
                    : 'bg-[#0A0E14] border-[#1E293B] hover:border-slate-700 hover:bg-[#151B24]'
                }`}
              >
                <div className="text-xs font-bold text-white group-hover:text-[#00D1FF] transition-colors font-mono">
                  {preset.name}
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 font-sans">
                  {preset.description}
                </p>
                <div className="mt-2 text-[10px] font-mono text-[#00D1FF] font-bold">
                  {preset.params.rainfallIntensity} mm/h • {preset.params.drainageBlockagePercent}% BLK
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Parameter Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* 1. Rainfall Intensity (10 - 150 mm/hr) */}
        <div className="p-4 rounded bg-[#0A0E14] border border-[#1E293B] border-l-4 border-l-[#00D1FF] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-[#00D1FF]" />
              Rainfall Intensity
            </span>
            <span className="text-base font-bold text-[#00D1FF] font-mono">
              {currentRainfall} <span className="text-xs text-slate-500 font-normal">mm/hr</span>
            </span>
          </div>

          <input
            id="slider-rainfall"
            type="range"
            min={10}
            max={150}
            step={2}
            value={currentRainfall}
            onChange={(e) => updateSimulationParams({ rainfallIntensity: Number(e.target.value), rainfall: Number(e.target.value) })}
            className="w-full accent-[#00D1FF] cursor-pointer h-1.5 bg-[#1E293B] rounded appearance-none"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>10 mm/hr (Drizzle)</span>
            <span>70 mm/hr (Monsoon)</span>
            <span>150 mm/hr (Cloudburst)</span>
          </div>
        </div>

        {/* 2. Rainfall Duration (30 - 180 min) */}
        <div className="p-4 rounded bg-[#0A0E14] border border-[#1E293B] border-l-4 border-l-[#00D1FF] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#00D1FF]" />
              Rainfall Duration
            </span>
            <span className="text-base font-bold text-[#00D1FF] font-mono">
              {currentDuration} <span className="text-xs text-slate-500 font-normal">min</span>
            </span>
          </div>

          <input
            id="slider-duration"
            type="range"
            min={30}
            max={180}
            step={15}
            value={currentDuration}
            onChange={(e) => updateSimulationParams({ durationMinutes: Number(e.target.value) })}
            className="w-full accent-[#00D1FF] cursor-pointer h-1.5 bg-[#1E293B] rounded appearance-none"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>30 min (Quick Storm)</span>
            <span>90 min</span>
            <span>180 min (Prolonged Inundation)</span>
          </div>
        </div>

        {/* 3. Drainage Blockage (0 - 100%) */}
        <div className="p-4 rounded bg-[#0A0E14] border border-[#1E293B] border-l-4 border-l-purple-500 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <GitFork className="w-4 h-4 text-purple-400" />
              Drainage Conduit Silt & Trash Blockage
            </span>
            <span className={`text-base font-bold font-mono ${
              currentBlockage > 60 ? 'text-red-400' : 'text-purple-400'
            }`}>
              {currentBlockage}%
            </span>
          </div>

          <input
            id="slider-blockage"
            type="range"
            min={0}
            max={100}
            step={5}
            value={currentBlockage}
            onChange={(e) => updateSimulationParams({ drainageBlockagePercent: Number(e.target.value), drainBlockage: Number(e.target.value) })}
            className="w-full accent-purple-400 cursor-pointer h-1.5 bg-[#1E293B] rounded appearance-none"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0% (Desilted Clean)</span>
            <span>50% (Moderate Silt)</span>
            <span>100% (Complete Choke)</span>
          </div>
        </div>

        {/* 4. Hooghly River Tidal Level & Soil Saturation */}
        <div className="p-4 rounded bg-[#0A0E14] border border-[#1E293B] border-l-4 border-l-[#00D1FF] grid grid-cols-2 gap-3">
          
          {/* Tidal Level */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-[#00D1FF]" />
              River Tide Level
            </span>
            <div className="flex flex-col gap-1.5">
              {(['LOW', 'NORMAL', 'HIGH'] as TidalLevel[]).map((t) => (
                <button
                  key={t}
                  id={`tide-btn-${t}`}
                  onClick={() => updateSimulationParams({ tidalLevel: t })}
                  className={`px-2.5 py-1.5 rounded text-xs font-mono font-semibold transition-colors text-center border ${
                    currentTidal === t
                      ? 'bg-[#00D1FF] text-slate-950 font-bold border-[#00D1FF]'
                      : 'bg-[#151B24] text-slate-400 border-[#1E293B] hover:text-white'
                  }`}
                >
                  {t} TIDE
                </button>
              ))}
            </div>
          </div>

          {/* Soil Saturation */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-emerald-400" />
              Soil Saturation
            </span>
            <div className="flex flex-col gap-1.5">
              {(['DRY', 'NORMAL', 'SATURATED'] as SoilSaturation[]).map((s) => (
                <button
                  key={s}
                  id={`soil-btn-${s}`}
                  onClick={() => updateSimulationParams({ soilSaturation: s })}
                  className={`px-2.5 py-1.5 rounded text-xs font-mono font-semibold transition-colors text-center border ${
                    currentSoil === s
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                      : 'bg-[#151B24] text-slate-400 border-[#1E293B] hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Output Impact Summary */}
      <div className="p-4 rounded bg-[#0A0E14] border border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-500 uppercase tracking-widest text-[10px]">Simulated Telemetry:</span>
          <span>Risk: <b className="text-red-400">{kpis.cityFloodRisk}</b></span>
          <span>Critical Zones: <b className="text-amber-400">{kpis.highRiskZonesCount}</b></span>
          <span>Pop at Risk: <b className="text-white">{kpis.populationAtRisk.toLocaleString()}</b></span>
        </div>

        <button
          id="btn-inspect-sim-map"
          onClick={() => setCurrentView('live-map')}
          className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#00D1FF] hover:bg-[#00B8E6] text-slate-950 font-bold text-xs transition-colors shadow-sm font-mono"
        >
          <span>VIEW RESULTS ON LIVE MAP</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
