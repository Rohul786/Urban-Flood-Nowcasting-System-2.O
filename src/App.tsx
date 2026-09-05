import React, { useEffect } from 'react';
import { FloodProvider, useFlood } from './context/FloodContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { KPICards } from './components/KPICards';
import { FloodMap } from './components/FloodMap';
import { MapLayersControl } from './components/MapLayersControl';
import { ExplainableAIPanel } from './components/ExplainableAIPanel';
import { DrainagePanel } from './components/DrainagePanel';
import { RoutePanel } from './components/RoutePanel';
import { NowcastTimeline } from './components/NowcastTimeline';
import { SimulationLab } from './components/SimulationLab';
import { AlertsCenter } from './components/AlertsCenter';
import { InfrastructurePanel } from './components/InfrastructurePanel';
import { HistoricalAnalytics } from './components/HistoricalAnalytics';
import { SystemStatus } from './components/SystemStatus';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { SIHDemoRunner } from './components/SIHDemoRunner';
import { Toast } from './components/Toast';
import { LandingPage } from './pages/LandingPage';
import { AlertOctagon } from 'lucide-react';

export function FloodGuardContent() {
  const { currentView, emergencyMode, setCurrentView } = useFlood();

  // If user is on landing page, display the dedicated high-impact overview
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-black">
        <LandingPage />
        <GlobalSearchModal />
        <SIHDemoRunner />
        <Toast />
      </div>
    );
  }

  // Clean & Simple Full-Screen Live Climate Map View (Default on Open)
  if (currentView === 'live-map') {
    return (
      <div className={`h-screen flex flex-col bg-[#0A0E14] text-[#E2E8F0] selection:bg-[#00D1FF] selection:text-black overflow-hidden ${
        emergencyMode ? 'ring-2 ring-rose-600/50 ring-inset' : ''
      }`}>
        <Header />
        <div className="flex-1 relative w-full h-full overflow-hidden">
          <FloodMap className="w-full h-full" showHUD={true} hideCardOverlay={false} />
        </div>
        <GlobalSearchModal />
        <SIHDemoRunner />
        <Toast />
      </div>
    );
  }

  // Dashboard / Operations Center Layout
  return (
    <div className={`min-h-screen flex flex-col bg-[#0A0E14] text-[#E2E8F0] selection:bg-[#00D1FF] selection:text-black ${
      emergencyMode ? 'ring-2 ring-rose-600/50 ring-inset' : ''
    }`}>
      {/* Emergency Mode Top Warning Banner */}
      {emergencyMode && (
        <div className="bg-[#FF4B2B] text-white text-xs font-mono font-bold py-1.5 px-4 flex items-center justify-between animate-pulse sticky top-0 z-50 shadow-lg">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <AlertOctagon className="w-4 h-4 flex-shrink-0" />
            <span>
              EMERGENCY EOC ACTIVATED: Heavy Inundation Forecasted. All traffic diversions active, ambulance priority corridors designated.
            </span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <Header />

      {/* Main Content Layout with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Sidebar />

        {/* Scrollable Center Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-tech-grid">
          <div className="max-w-[1720px] mx-auto space-y-6">
            
            {/* Standard 6 KPI Cards */}
            <KPICards />

            {/* View Specific Modules */}
            {currentView === 'command-center' && (
              <div className="space-y-6">
                {/* 2-Column Command Center Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Interactive GIS Map */}
                  <div className="xl:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                        Live Kolkata Flood Map (0.05° High-Resolution Inundation Grid)
                      </h2>
                      <span className="text-[11px] font-mono text-cyan-400">
                        Click any zone or road to diagnose
                      </span>
                    </div>

                    <div className="h-[520px] w-full">
                      <FloodMap />
                    </div>

                    {/* Quick Compact Layer Toggles */}
                    <MapLayersControl isCompact={true} />
                  </div>

                  {/* Right Column: Explainable AI & Drainage Intelligence */}
                  <div className="xl:col-span-5 space-y-6">
                    <ExplainableAIPanel />
                  </div>
                </div>

                {/* Secondary Row: Drainage & Safe Routes */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <DrainagePanel />
                  <RoutePanel />
                </div>
              </div>
            )}

            {currentView === 'live-map' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-start">
                  <div className="xl:col-span-3 h-[680px]">
                    <FloodMap />
                  </div>
                  <div className="space-y-4">
                    <MapLayersControl isCompact={false} />
                    <ExplainableAIPanel />
                  </div>
                </div>
              </div>
            )}

            {currentView === 'nowcast' && (
              <div className="space-y-6">
                <NowcastTimeline />
                <div className="h-[480px]">
                  <FloodMap />
                </div>
              </div>
            )}

            {currentView === 'risk-analysis' && (
              <div className="space-y-6">
                <ExplainableAIPanel />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="h-[460px]">
                    <FloodMap />
                  </div>
                  <DrainagePanel />
                </div>
              </div>
            )}

            {currentView === 'safe-routes' && (
              <div className="space-y-6">
                <RoutePanel />
                <div className="h-[500px]">
                  <FloodMap />
                </div>
              </div>
            )}

            {currentView === 'alerts' && (
              <div className="space-y-6">
                <AlertsCenter />
              </div>
            )}

            {currentView === 'infrastructure' && (
              <div className="space-y-6">
                <InfrastructurePanel />
                <div className="h-[460px]">
                  <FloodMap />
                </div>
              </div>
            )}

            {currentView === 'analytics' && (
              <div className="space-y-6">
                <HistoricalAnalytics />
              </div>
            )}

            {currentView === 'simulation-lab' && (
              <div className="space-y-6">
                <SimulationLab />
                <div className="h-[460px]">
                  <FloodMap />
                </div>
              </div>
            )}

            {currentView === 'system-status' && (
              <div className="space-y-6">
                <SystemStatus />
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Technical Dashboard Status Footer */}
      <footer className="h-9 bg-[#0A0E14] border-t border-[#1E293B] px-6 flex items-center justify-between text-[10px] text-slate-500 font-mono select-none z-30">
        <div className="flex items-center space-x-6">
          <span>NCMRWF GATEWAY: <span className="text-emerald-400 font-semibold">CONNECTED</span></span>
          <span className="hidden sm:inline">OSM ENGINE: <span className="text-emerald-400 font-semibold">ACTIVE</span></span>
          <span className="hidden md:inline">SATELLITE DATA: <span className="text-[#00D1FF] font-semibold">LIVE (0.4m)</span></span>
          <span className="hidden lg:inline text-slate-600">GRID: 0.05°</span>
        </div>
        <div className="flex items-center">
          <span className="mr-3 hidden sm:inline text-slate-500">© 2026 SMART INDIA HACKATHON</span>
          <span className="bg-[#151B24] border border-[#1E293B] px-2 py-0.5 rounded text-slate-400 text-[9px] font-mono">
            SIH26085-KOL
          </span>
        </div>
      </footer>

      {/* Global Modals & Overlays */}
      <GlobalSearchModal />
      <SIHDemoRunner />
      <Toast />
    </div>
  );
}

export function App() {
  return (
    <FloodProvider>
      <FloodGuardContent />
    </FloodProvider>
  );
}

export default App;
