import React from 'react';
import { useFlood } from '../context/FloodContext';
import { TRADITIONAL_VS_FLOODGUARD } from '../data/historical';
import { 
  Play, 
  LayoutDashboard, 
  ArrowRight, 
  Droplets, 
  Cpu, 
  Radio, 
  Navigation, 
  ShieldAlert, 
  Database, 
  Layers, 
  Sparkles,
  CloudRain,
  Mountain,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, startSIHDemo } = useFlood();

  const dataSources = [
    { name: 'IMD (India Meteorological Dept)', description: 'Doppler Radar & High-Resolution Numerical Weather Prediction (WRF)', status: 'SIMULATED', color: 'text-cyan-400 border-cyan-800 bg-cyan-950/60' },
    { name: 'OpenStreetMap (OSM)', description: 'Open Geospatial Road, Arterial & Land Cover Geometry', status: 'LIVE', color: 'text-emerald-400 border-emerald-800 bg-emerald-950/60' },
    { name: 'SRTM / Elevation DEM', description: 'Digital Elevation Model 12.5m Ground Topography & OpenStreetMap Contours', status: 'LIVE', color: 'text-emerald-400 border-emerald-800 bg-emerald-950/60' },
    { name: 'KMC Drainage Master Plan', description: 'Canal cross-sections, pump station flow telemetry & outfall sluices', status: 'SIMULATED', color: 'text-cyan-400 border-cyan-800 bg-cyan-950/60' },
    { name: 'Historical Flood Archive', description: '10-Year Waterlogging Inundation Inventory (NCMRWF Archive)', status: 'SIMULATED', color: 'text-cyan-400 border-cyan-800 bg-cyan-950/60' },
    { name: 'IoT Ultrasonic Water Sensors', description: 'Bridge & Underpass Telemetry Hardware Network', status: 'OFFLINE', color: 'text-slate-400 border-slate-700 bg-slate-900/60' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      
      {/* Top Government & SIH Banner */}
      <div className="border-b border-slate-800/80 bg-slate-950/90 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-white font-bold tracking-wider">SMART INDIA HACKATHON 2026</span>
            <span className="text-slate-400">•</span>
            <span className="text-cyan-300">PROBLEM STATEMENT: SIH26085</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span>Ministry of Earth Sciences (MoES)</span>
            <span>•</span>
            <span className="text-slate-300">NCMRWF</span>
            <span>•</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px]">
              Theme: Disaster Management
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Ambient Backlight */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="text-center space-y-6 relative z-10 max-w-4xl mx-auto">
          
          {/* Official Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-mono tracking-widest uppercase shadow-lg shadow-cyan-950/50">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>"PREDICT EARLY. ALERT FAST. ACT BEFORE IT FLOODS."</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase">
            FLOODGUARD <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">AI</span>
          </h1>

          <p className="text-lg sm:text-2xl font-medium text-slate-300 tracking-tight">
            Urban Flood Nowcasting System (Drainage and Rainfall Coupling)
          </p>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            "AI-powered street-level flood intelligence for safer cities." Beyond simply forecasting rainfall, 
            FloodGuard AI pinpoints <span className="text-white font-semibold">WHERE</span> inundation will hit, <span className="text-white font-semibold">WHEN</span> it will peak, 
            <span className="text-white font-semibold"> WHICH</span> roads submerge, and <span className="text-cyan-400 font-semibold">WHAT safe route</span> citizens must take.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              id="btn-hero-enter-cc"
              onClick={() => setCurrentView('command-center')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm transition-all shadow-xl shadow-cyan-500/25 hover:scale-[1.03] active:scale-[0.98]"
            >
              <LayoutDashboard className="w-4 h-4 fill-current" />
              <span>ENTER COMMAND CENTER</span>
            </button>

            <button
              id="btn-hero-run-demo"
              onClick={startSIHDemo}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all border border-cyan-500/40 hover:border-cyan-400 shadow-lg hover:scale-[1.03]"
            >
              <Play className="w-4 h-4 text-cyan-400 fill-current" />
              <span>RUN SIH DEMO (10-STEP WALKTHROUGH)</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 max-w-3xl mx-auto font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Nowcast Horizon</span>
              <span className="text-lg font-bold text-cyan-400">0–3 Hours</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Spatial Resolution</span>
              <span className="text-lg font-bold text-white">Street-Level (50m)</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Coupled Factors</span>
              <span className="text-lg font-bold text-emerald-400">7 Parameters</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Test Demonstrator</span>
              <span className="text-lg font-bold text-amber-400">Kolkata Basin</span>
            </div>
          </div>

        </div>
      </section>

      {/* Core Workflow Section */}
      <section className="py-12 px-4 sm:px-8 border-y border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-widest">
              Core Architecture & Flow
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              PREDICT → WARN → ROUTE → RESPOND
            </p>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Dynamic coupling of meteorological radar, terrain elevation, drainage conduit hydraulics, and historical flood telemetry.
            </p>
          </div>

          {/* Workflow Steps Display */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Step 1: Data Fusion */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-950 flex items-center justify-center border border-cyan-800 text-cyan-400">
                <CloudRain className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-mono text-cyan-400 font-bold">STAGE 01</div>
              <h3 className="text-base font-bold text-white">Coupled Data Fusion</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ingests Rainfall (30%) + Drainage Stress (25%) + DEM Elevation (15%) + Historical Waterlogging (10%) + Impervious Soil.
              </p>
            </div>

            {/* Step 2: AI Risk Engine */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-950 flex items-center justify-center border border-purple-800 text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-mono text-purple-400 font-bold">STAGE 02</div>
              <h3 className="text-base font-bold text-white">AI Flood Risk Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computes 0–100% deterministic probability, classifies into Low/Moderate/High/Severe, and generates Explainable AI factor weights.
              </p>
            </div>

            {/* Step 3: Nowcast & Warning */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-lg bg-rose-950 flex items-center justify-center border border-rose-800 text-rose-400">
                <Radio className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-mono text-rose-400 font-bold">STAGE 03</div>
              <h3 className="text-base font-bold text-white">0–3h Street Nowcast</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Projects minute-by-minute water depths and dispatches automated CAP-standard municipal early warnings.
              </p>
            </div>

            {/* Step 4: Safe Routing & Response */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-950 flex items-center justify-center border border-emerald-800 text-emerald-400">
                <Navigation className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-mono text-emerald-400 font-bold">STAGE 04</div>
              <h3 className="text-base font-bold text-white">Safe Routing & EOC</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates flood-resilient bypass routes (-82% exposure) and activates Emergency Operations Center protocols.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Before vs After Comparison Matrix */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-widest">
            Comparative Paradigm Shift
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Traditional Flood Management vs FloodGuard AI
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            *Prototype Simulation — Illustrative Values for SIH 2026 Evaluation
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 font-mono text-slate-400 uppercase text-[11px]">
              <tr>
                <th className="p-4">Benchmark Metric</th>
                <th className="p-4 text-rose-400">Traditional Flood Systems</th>
                <th className="p-4 text-cyan-400 font-bold">FloodGuard AI (Coupled Engine)</th>
                <th className="p-4 text-emerald-400">Operational Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {TRADITIONAL_VS_FLOODGUARD.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4 font-semibold text-white font-mono">{row.parameter}</td>
                  <td className="p-4 text-slate-400">{row.traditional}</td>
                  <td className="p-4 text-cyan-300 font-medium">{row.floodguard}</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">{row.improvement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Data Sources Intelligence */}
      <section className="py-12 px-4 sm:px-8 border-t border-slate-800/80 bg-slate-950/80">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-widest">
              Data Intelligence Architecture
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Ingested Telemetry Feeds
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {dataSources.map((ds, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{ds.name}</h4>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${ds.color}`}>
                    {ds.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">{ds.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mandatory Footer */}
      <footer className="border-t border-slate-800 py-6 px-4 sm:px-8 bg-slate-950 text-center space-y-2 text-xs text-slate-400 font-mono">
        <p className="text-slate-300 font-semibold">
          Prototype developed for Smart India Hackathon 2026.
        </p>
        <p className="text-[11px] text-slate-400 max-w-3xl mx-auto">
          "Flood predictions and emergency recommendations shown in simulation mode are demonstrative and must not be used for real-world emergency decisions."
        </p>
        <p className="text-[10px] text-slate-400 pt-2">
          Ministry of Earth Sciences (MoES) • National Centre for Medium Range Weather Forecasting (NCMRWF) • Disaster Management
        </p>
      </footer>

    </div>
  );
};
