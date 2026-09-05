import React, { useState, useEffect } from 'react';
import { useFlood } from '../context/FloodContext';
import { 
  Cpu, 
  Activity, 
  CheckCircle2, 
  Radio, 
  Database, 
  Server, 
  ShieldCheck, 
  Wifi, 
  RefreshCw,
  Clock,
  Layers
} from 'lucide-react';

export const SystemStatus: React.FC = () => {
  const { emergencyMode, showToast } = useFlood();
  const [lastSyncSeconds, setLastSyncSeconds] = useState(12);
  const [latency, setLatency] = useState(42);

  useEffect(() => {
    const timer = setInterval(() => {
      setLastSyncSeconds(prev => (prev > 25 ? 2 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualSync = () => {
    setLastSyncSeconds(0);
    setLatency(Math.floor(38 + Math.random() * 8));
    showToast('Telemetry feeds synced: Doppler radar, KMC pump stations, and OpenStreetMap GIS mesh.');
  };

  const services = [
    { name: 'Weather Data Feed (IMD Doppler)', status: 'CONNECTED', latency: '38 ms', icon: Wifi },
    { name: 'Drainage Telemetry (KMC Pumps & Outfalls)', status: 'CONNECTED', latency: '44 ms', icon: Radio },
    { name: 'AI Inference Engine (Physics-Coupled ML)', status: 'OPERATIONAL', latency: `${latency} ms`, icon: Cpu },
    { name: 'GIS Topography Mesh (OpenStreetMap / SRTM)', status: 'SYNCED', latency: '19 ms', icon: Layers },
    { name: 'OASIS CAP Early Warning Gateway', status: 'READY', latency: '52 ms', icon: ShieldCheck },
    { name: 'Real-Time Safe Routing Solver (A*)', status: 'ACTIVE', latency: '28 ms', icon: Activity },
  ];

  return (
    <div className="bg-[#151B24] border border-[#1E293B] rounded p-5 shadow-xl space-y-5 font-mono">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#00D1FF]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              FloodGuard AI Infrastructure & Health Diagnostics
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            Government Operations Node: MoES-NCMRWF-KOL-01
          </p>
        </div>

        <button
          id="btn-sync-telemetry"
          onClick={handleManualSync}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0A0E14] hover:bg-[#1E293B] text-slate-300 border border-[#1E293B] text-xs font-mono transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#00D1FF]" />
          <span>Sync Telemetry Now</span>
        </button>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded bg-[#0A0E14] border border-[#1E293B] border-l-4 border-l-[#00D1FF] space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Model Core</span>
          <div className="text-sm sm:text-base font-bold text-white font-mono">FloodGuard v2.6</div>
          <span className="text-[10px] text-[#00D1FF] font-mono block">Coupled Hydro ML</span>
        </div>

        <div className="p-3.5 rounded bg-[#0A0E14] border border-[#1E293B] border-l-4 border-l-emerald-500 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Inference Latency</span>
          <div className="text-sm sm:text-base font-bold text-emerald-400 font-mono">{latency} ms</div>
          <span className="text-[10px] text-slate-500 font-mono block">Sub-50ms engine</span>
        </div>

        <div className="p-3.5 rounded bg-[#0A0E14] border border-[#1E293B] border-l-4 border-l-[#00D1FF] space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Telemetry Push</span>
          <div className="text-sm sm:text-base font-bold text-[#00D1FF] font-mono">{lastSyncSeconds}s ago</div>
          <span className="text-[10px] text-slate-500 font-mono block">Live Doppler Radar</span>
        </div>

        <div className="p-3.5 rounded bg-[#0A0E14] border border-[#1E293B] border-l-4 border-l-red-500 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">Operational Mode</span>
          <div className={`text-sm sm:text-base font-bold font-mono ${emergencyMode ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
            {emergencyMode ? 'EMERGENCY EOC' : 'STANDBY MONITOR'}
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">Multi-Agency Ready</span>
        </div>
      </div>

      {/* Services Health Check List */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase text-[#00D1FF] font-bold tracking-widest block">
          Connected Distributed Microservices
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded bg-[#0A0E14] border border-[#1E293B] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-[#151B24] border border-[#1E293B] text-[#00D1FF]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">{svc.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">Latency: {svc.latency}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-[10px] font-mono font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{svc.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
