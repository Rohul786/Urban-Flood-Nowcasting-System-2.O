import React, { useState, useEffect } from 'react';
import { useFlood } from '../context/FloodContext';
import { 
  ShieldAlert, 
  Search, 
  Bell, 
  Play, 
  Radio, 
  AlertOctagon, 
  Activity, 
  Home, 
  Sparkles,
  Sliders
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    emergencyMode, 
    toggleEmergencyMode, 
    startSIHDemo, 
    sihDemoStep, 
    setIsSearchOpen, 
    alerts, 
    setCurrentView, 
    currentView,
    simulationParams,
    applyPreset,
    inspectedLocationName,
    inspectedCoordinates,
    userCoordinates
  } = useFlood();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
      emergencyMode 
        ? 'bg-[#151B24] border-rose-600 shadow-[0_0_30px_rgba(255,75,43,0.25)]' 
        : 'bg-[#151B24] border-[#1E293B]'
    }`}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity & Subtitle */}
        <div className="flex items-center gap-3">
          <button 
            id="header-brand-btn"
            onClick={() => setCurrentView('live-map')}
            className="flex items-center gap-3 group text-left"
            title="Go to Live Climate Map"
          >
            <div className={`w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-sm transition-transform group-hover:scale-105 ${
              emergencyMode 
                ? 'bg-[#FF4B2B] text-white animate-pulse' 
                : 'bg-[#1E293B] border border-[#00D1FF]/50 text-[#00D1FF]'
            }`}>
              FG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#00D1FF] text-lg tracking-tighter leading-none">
                  FLOODGUARD <span className="text-white">AI</span>
                </span>
                <span className="hidden xl:inline-flex px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded bg-[#0A0E14] text-cyan-400 border border-[#1E293B]">
                  LIVE CLIMATE
                </span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 hidden sm:block">
                Coupled Climate & Inundation System
              </p>
            </div>
          </button>
        </div>

        {/* Center: Selected Location & Telemetry */}
        <div className="hidden lg:flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center gap-2 bg-[#0A0E14] border border-[#1E293B] px-3 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] text-slate-400 uppercase">ACTIVE LOCATION:</span>
            <span className="text-xs font-semibold text-white max-w-[200px] truncate">{inspectedLocationName}</span>
            <span className="text-[10px] text-cyan-400">
              [{inspectedCoordinates[0].toFixed(3)}°, {inspectedCoordinates[1].toFixed(3)}°]
            </span>
          </div>

          {/* Quick View Switcher Pills */}
          <div className="flex items-center bg-[#0A0E14] border border-[#1E293B] rounded p-0.5">
            <button
              onClick={() => setCurrentView('live-map')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                currentView === 'live-map'
                  ? 'bg-[#00D1FF] text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🗺️ Live Map
            </button>
            <button
              onClick={() => setCurrentView('command-center')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                currentView === 'command-center'
                  ? 'bg-[#00D1FF] text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 Command Center
            </button>
          </div>

          {/* Coordinates Grid Readout */}
          <div className="hidden xl:flex bg-[#0A0E14] border border-[#1E293B] rounded px-3 py-1 items-center space-x-3 text-[10px] font-mono">
            <span className="text-slate-500 uppercase">Lat: <span className="text-white">{inspectedCoordinates[0].toFixed(4)}° N</span></span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-500 uppercase">Lon: <span className="text-white">{inspectedCoordinates[1].toFixed(4)}° E</span></span>
            <span className="text-slate-700">|</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              ONLINE
            </span>
          </div>
        </div>

        {/* Right Action Tools: Search, SIH Demo, Notifications, Emergency Mode */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Landing View Shortcut */}
          <button
            id="nav-landing-toggle"
            onClick={() => setCurrentView(currentView === 'landing' ? 'command-center' : 'landing')}
            className="p-2 text-slate-400 hover:text-white bg-[#0A0E14] hover:bg-[#1E293B] border border-[#1E293B] rounded transition-colors text-xs font-medium flex items-center gap-1.5"
            title={currentView === 'landing' ? 'Open Dashboard' : 'Open Landing Overview'}
          >
            <Home className="w-4 h-4" />
            <span className="hidden xl:inline text-xs">{currentView === 'landing' ? 'Command Center' : 'Overview'}</span>
          </button>

          {/* Global Search Button */}
          <button
            id="header-search-btn"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#0A0E14] hover:bg-[#1E293B] border border-[#1E293B] hover:border-slate-700 text-slate-300 rounded text-xs transition-colors shadow-inner font-mono"
          >
            <Search className="w-3.5 h-3.5 text-[#00D1FF]" />
            <span className="hidden sm:inline text-slate-400 text-xs font-sans">Search location, road...</span>
            <kbd className="hidden lg:inline text-[9px] bg-[#1E293B] px-1.5 py-0.5 rounded text-slate-400 font-mono">⌘K</kbd>
          </button>

          {/* Notifications / Alerts Dropdown Trigger */}
          <div className="relative">
            <button
              id="header-notifications-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-300 hover:text-white bg-[#0A0E14] hover:bg-[#1E293B] border border-[#1E293B] rounded transition-colors"
              title="Active Flood Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF4B2B] text-[10px] font-bold text-white shadow-sm font-mono">
                  {unreadAlerts.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#151B24] border border-[#1E293B] rounded shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#1E293B] mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-mono">
                    <Radio className="w-3.5 h-3.5 text-[#FF4B2B] animate-pulse" />
                    Early Warnings ({unreadAlerts.length})
                  </span>
                  <button 
                    onClick={() => { setCurrentView('alerts'); setShowNotifications(false); }}
                    className="text-[10px] text-[#00D1FF] hover:underline font-mono uppercase tracking-wider"
                  >
                    View Alert Center →
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {alerts.slice(0, 4).map(alert => (
                    <div 
                      key={alert.id}
                      onClick={() => { setCurrentView('alerts'); setShowNotifications(false); }}
                      className="p-2.5 rounded bg-[#0A0E14] border border-[#1E293B] hover:border-slate-700 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                          alert.severity === 'SEVERE' || alert.severity === 'EMERGENCY'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">{alert.expectedTime}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-white mt-1">{alert.locationName}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{alert.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RUN SIH DEMO Button */}
          <button
            id="header-sih-demo-btn"
            onClick={startSIHDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00D1FF] hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded transition-all shadow-md shadow-cyan-950/30 hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider"
            title="Start Automated 10-Step Demo for SIH Judges"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="tracking-wide">RUN DEMO</span>
          </button>

          {/* Emergency Mode Toggle Button */}
          <button
            id="header-emergency-mode-btn"
            onClick={toggleEmergencyMode}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded transition-all uppercase tracking-wider ${
              emergencyMode
                ? 'bg-[#FF4B2B] hover:bg-red-600 text-white shadow-lg shadow-red-950 animate-pulse'
                : 'bg-[#151B24] hover:bg-[#1E293B] text-slate-300 border border-[#1E293B] hover:text-[#FF4B2B]'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5 text-[#FF4B2B]" />
            <span className="hidden sm:inline">{emergencyMode ? 'EXIT EMERGENCY' : 'EMERGENCY MODE'}</span>
          </button>

        </div>
      </div>
    </header>
  );
};
