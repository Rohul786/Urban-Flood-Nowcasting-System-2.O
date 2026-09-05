import React from 'react';
import { useFlood, AppView } from '../context/FloodContext';
import { 
  LayoutDashboard, 
  Map, 
  Clock, 
  BarChart3, 
  Navigation2, 
  BellRing, 
  Building2, 
  LineChart, 
  FlaskConical, 
  Cpu, 
  Radio, 
  CloudRain, 
  Layers, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, kpis, emergencyMode } = useFlood();

  const operationsItems: NavItem[] = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'live-map', label: 'Live Climate Map', icon: Map, badge: 'LIVE GPS' },
    { id: 'nowcast', label: 'AI Nowcast', icon: Clock, badge: '0-3h' },
    { id: 'risk-analysis', label: 'Risk Analysis', icon: BarChart3 },
    { id: 'safe-routes', label: 'Safe Routing', icon: Navigation2, badge: 'A*' },
    { 
      id: 'alerts', 
      label: 'Early Warnings', 
      icon: BellRing, 
      badge: kpis.activeAlertsCount > 0 ? `${kpis.activeAlertsCount} ACTIVE` : undefined,
      badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/40 font-mono font-bold'
    },
  ];

  const infrastructureItems: NavItem[] = [
    { id: 'infrastructure', label: 'Drainage Network', icon: Building2 },
    { id: 'analytics', label: 'Historical Archive', icon: LineChart },
    { id: 'simulation-lab', label: 'Simulation Lab', icon: FlaskConical, badge: 'WHAT-IF' },
    { id: 'system-status', label: 'System Diagnostics', icon: Cpu },
  ];

  const renderNavGroup = (items: NavItem[]) => (
    <div className="space-y-0.5">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            id={`sidebar-nav-${item.id}`}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center justify-between px-5 py-2.5 text-xs transition-colors text-left ${
              isActive
                ? 'bg-[#1E293B] border-r-4 border-[#00D1FF] text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#1E293B]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`w-4 h-4 transition-colors ${
                isActive ? 'text-[#00D1FF]' : 'text-slate-500'
              }`} />
              <span className="tracking-tight">{item.label}</span>
            </div>

            {item.badge && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                item.badgeColor || (isActive ? 'bg-[#0A0E14] text-[#00D1FF] border border-[#00D1FF]/40' : 'bg-[#0A0E14] text-slate-500 border border-[#1E293B]')
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className={`w-64 flex-shrink-0 flex flex-col justify-between bg-[#151B24] border-r border-[#1E293B] transition-colors select-none ${
      emergencyMode ? 'border-r-rose-600/70' : ''
    }`}>
      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-2">
        {/* Operations Section */}
        <div className="px-5 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
          Operations
        </div>
        {renderNavGroup(operationsItems)}

        {/* Infrastructure Section */}
        <div className="px-5 py-2 mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono border-t border-[#1E293B]">
          Infrastructure & Lab
        </div>
        {renderNavGroup(infrastructureItems)}
      </div>

      {/* Bottom Technical Telemetry Panel */}
      <div className="p-4 bg-[#0D1219] border-t border-[#1E293B] space-y-2">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
            <span className="text-slate-300 font-mono tracking-wider font-semibold">SYSTEM ONLINE</span>
          </div>
          <span className="text-[9px] text-[#00D1FF] font-mono">NCMRWF</span>
        </div>
        <div className="text-[9px] text-slate-500 font-mono">
          v4.2.0-SIH26085-KOLKATA
        </div>
      </div>
    </aside>
  );
};
