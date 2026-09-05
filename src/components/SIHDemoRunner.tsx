import React from 'react';
import { useFlood } from '../context/FloodContext';
import { 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Radio,
  Award
} from 'lucide-react';

export const SIHDemoRunner: React.FC = () => {
  const { 
    sihDemoStep, 
    nextSIHDemoStep, 
    prevSIHDemoStep, 
    stopSIHDemo, 
    simulationParams, 
    kpis, 
    nowcastStep 
  } = useFlood();

  if (sihDemoStep === 0) return null;

  const stepDescriptions = [
    { title: 'Normal City Baseline', desc: 'Pre-monsoon baseline. Rainfall at 22 mm/hr, drainage capacity normal, all micro-catchment flood probabilities under 15% (All Green).' },
    { title: 'Monsoon Squall Begins', desc: 'Rainfall intensifies to 65 mm/hr. Doppler radar feeds stream high-resolution precipitation into the hydrodynamic engine.' },
    { title: 'Drainage Hydraulic Stress', desc: 'Canals (Circular Canal D-101 & Monikhali D-106) exceed 85% capacity. Debris blockage builds at outfall lock gates.' },
    { title: 'AI Nowcast Detects Risk', desc: 'Coupled engine models 0–3 hour progression, forecasting impending overflow in low-elevation micro-catchments.' },
    { title: 'Map Color Transition', desc: 'Severe storm cloudburst triggers rapid transition: Green (Low) ➔ Yellow (Mod) ➔ Orange (High) ➔ Red (Severe Inundation).' },
    { title: 'Road Inundation Flagged', desc: 'VIP Road underpass and College Street submerge past 40 cm. System flags roads as BLOCKED / CLOSED.' },
    { title: 'CAP Warning Dispatched', desc: 'Automated Common Alerting Protocol (CAP) severe flood warning broadcast to municipal authorities & citizens.' },
    { title: 'Safe Route Computed', desc: 'Dynamic A* routing reroutes traffic onto elevated flyovers (Maa Flyover), cutting flood exposure by 82% (+6 min travel time).' },
    { title: 'Critical Infrastructure Triage', desc: 'SSKM Hospital, Vidyasagar Hospital, and power substations triaged. Evacuation shelters auto-designated.' },
    { title: 'Emergency Mode Activated', desc: 'Full EOC Emergency Mode locked in: High-priority dispatch, search & rescue boats stationed, multi-agency coordination active!' }
  ];

  const currentInfo = stepDescriptions[sihDemoStep - 1] || stepDescriptions[0];

  return (
    <div className="fixed bottom-5 inset-x-4 max-w-4xl mx-auto z-50 animate-in fade-in slide-in-from-bottom-5 font-mono">
      <div className="bg-[#0A0E14] border-2 border-[#00D1FF] rounded p-4 sm:p-5 shadow-[0_0_40px_rgba(0,209,255,0.25)] space-y-3">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D1FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00D1FF]" />
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-[#00D1FF] tracking-wider">
                Smart India Hackathon 2026 • Live Guided Evaluation Flow
              </span>
              <span className="hidden sm:inline px-2 py-0.5 rounded bg-[#151B24] text-[#00D1FF] text-[10px] font-mono border border-[#1E293B]">
                STEP {sihDemoStep} OF 10
              </span>
            </div>
          </div>

          <button
            id="btn-close-sih-demo"
            onClick={stopSIHDemo}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#151B24] transition-colors"
            title="Exit Demo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Title and Description */}
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-mono">
            <span>Step {sihDemoStep}: {currentInfo.title}</span>
            {sihDemoStep === 10 && <Award className="w-4 h-4 text-amber-400 animate-bounce" />}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            {currentInfo.desc}
          </p>
        </div>

        {/* 10-Step Progress Bar Indicator */}
        <div className="grid grid-cols-10 gap-1.5 pt-1">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded transition-all duration-300 ${
                idx + 1 < sihDemoStep
                  ? 'bg-[#00D1FF]'
                  : idx + 1 === sihDemoStep
                  ? 'bg-[#00D1FF] ring-2 ring-[#00D1FF]/50 shadow-[0_0_8px_#00D1FF]'
                  : 'bg-[#1E293B]'
              }`}
            />
          ))}
        </div>

        {/* Controls and Telemetry */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1E293B]">
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>Rainfall: <b className="text-[#00D1FF]">{kpis.currentRainfall} mm/hr</b></span>
            <span>City Risk: <b className={`${kpis.cityFloodRisk === 'SEVERE' ? 'text-red-400' : 'text-amber-400'}`}>{kpis.cityFloodRisk}</b></span>
            <span className="hidden sm:inline">Timeline: <b className="text-slate-200">+{nowcastStep}H</b></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-demo-prev"
              onClick={prevSIHDemoStep}
              disabled={sihDemoStep <= 1}
              className="px-3 py-1.5 rounded bg-[#151B24] hover:bg-[#1E293B] text-slate-300 disabled:opacity-30 text-xs font-bold transition-colors flex items-center gap-1 border border-[#1E293B] font-mono"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>BACK</span>
            </button>

            <button
              id="btn-demo-next"
              onClick={nextSIHDemoStep}
              className="px-4 py-1.5 rounded bg-[#00D1FF] hover:bg-[#00B8E6] text-slate-950 text-xs font-bold transition-all flex items-center gap-1 font-mono shadow-sm"
            >
              <span>{sihDemoStep === 10 ? 'FINISH EVALUATION' : 'NEXT STEP'}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
