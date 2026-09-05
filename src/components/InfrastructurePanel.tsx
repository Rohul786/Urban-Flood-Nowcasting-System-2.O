import React, { useState } from 'react';
import { useFlood } from '../context/FloodContext';
import { 
  Building2, 
  Navigation, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Zap, 
  GraduationCap, 
  Shield, 
  Home,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { InfrastructureFacility, RoadSegment } from '../types';

export const InfrastructurePanel: React.FC = () => {
  const { 
    infrastructure, 
    roads, 
    selectedFacilityId, 
    setSelectedFacilityId, 
    setSelectedRoadId, 
    setSelectedZoneId,
    setCurrentView 
  } = useFlood();

  const [activeTab, setActiveTab] = useState<'FACILITIES' | 'ROADS'>('FACILITIES');
  const [filterAccess, setFilterAccess] = useState<string>('ALL');

  const filteredFacilities = infrastructure.filter(f => {
    if (filterAccess === 'ALL') return true;
    return f.accessibility === filterAccess;
  });

  const filteredRoads = roads.filter(r => {
    if (filterAccess === 'ALL') return true;
    return r.status === filterAccess;
  });

  const getAccessBadge = (access: string) => {
    switch (access) {
      case 'CUT_OFF':
      case 'BLOCKED':
        return 'bg-rose-500/20 text-rose-300 border-rose-600/60 ring-1 ring-rose-500/40';
      case 'HIGH_RISK':
        return 'bg-orange-500/20 text-orange-300 border-orange-600/60 ring-1 ring-orange-500/40';
      case 'PARTIALLY_IMPAIRED':
      case 'CAUTION':
        return 'bg-amber-500/20 text-amber-300 border-amber-600/60';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-600/60';
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'hospital': return Building2;
      case 'police': return Shield;
      case 'fire_station': return Flame;
      case 'shelter': return Home;
      case 'school': return GraduationCap;
      case 'power_station': return Zap;
      default: return Building2;
    }
  };

  return (
    <div className="bg-[#151B24] border border-[#1E293B] rounded p-5 shadow-xl space-y-4 font-mono">
      
      {/* Top Header & Tab Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#00D1FF]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Lifeline Infrastructure & Arterial Road Status
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            Real-time ambulance ingress corridors and municipal evacuation shelter tracking
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#0A0E14] p-1 rounded border border-[#1E293B] text-xs font-mono">
          <button
            id="tab-infra-facilities"
            onClick={() => { setActiveTab('FACILITIES'); setFilterAccess('ALL'); }}
            className={`px-3 py-1.5 rounded font-bold transition-colors ${
              activeTab === 'FACILITIES'
                ? 'bg-[#00D1FF] text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Facilities ({infrastructure.length})
          </button>
          <button
            id="tab-infra-roads"
            onClick={() => { setActiveTab('ROADS'); setFilterAccess('ALL'); }}
            className={`px-3 py-1.5 rounded font-bold transition-colors ${
              activeTab === 'ROADS'
                ? 'bg-[#00D1FF] text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Roads ({roads.length})
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5 text-xs font-mono">
          {activeTab === 'FACILITIES' ? (
            ['ALL', 'CUT_OFF', 'HIGH_RISK', 'PARTIALLY_IMPAIRED', 'ACCESSIBLE'].map(s => (
              <button
                key={s}
                onClick={() => setFilterAccess(s)}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                  filterAccess === s
                    ? 'bg-[#00D1FF] text-slate-950 font-bold border border-[#00D1FF]'
                    : 'bg-[#0A0E14] text-slate-400 hover:text-white border border-[#1E293B]'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))
          ) : (
            ['ALL', 'BLOCKED', 'HIGH_RISK', 'CAUTION', 'OPEN'].map(s => (
              <button
                key={s}
                onClick={() => setFilterAccess(s)}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                  filterAccess === s
                    ? 'bg-[#00D1FF] text-slate-950 font-bold border border-[#00D1FF]'
                    : 'bg-[#0A0E14] text-slate-400 hover:text-white border border-[#1E293B]'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))
          )}
        </div>

        <button
          onClick={() => setCurrentView('live-map')}
          className="text-xs text-[#00D1FF] hover:underline flex items-center gap-1 font-mono"
        >
          <span>View on Map →</span>
        </button>
      </div>

      {/* Facilities List */}
      {activeTab === 'FACILITIES' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredFacilities.map((fac) => {
            const Icon = getIconForType(fac.type);
            const isSelected = fac.id === selectedFacilityId;

            return (
              <div
                key={fac.id}
                id={`fac-card-${fac.id}`}
                onClick={() => {
                  setSelectedFacilityId(fac.id);
                  setSelectedZoneId(fac.zoneId);
                }}
                className={`p-3.5 rounded border transition-all cursor-pointer relative space-y-2.5 bg-[#0A0E14] border-[#1E293B] ${
                  isSelected
                    ? 'border-l-4 border-l-[#00D1FF] ring-1 ring-[#00D1FF]/40'
                    : fac.accessibility === 'CUT_OFF' || fac.accessibility === 'HIGH_RISK'
                    ? 'border-l-4 border-l-red-500 hover:border-slate-700'
                    : 'border-l-4 border-l-emerald-500 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 pl-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-[#151B24] border border-[#1E293B] text-[#00D1FF]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">{fac.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {fac.type.toUpperCase()} • {fac.capacity}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${getAccessBadge(fac.accessibility)}`}>
                    {fac.accessibility.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-mono p-2.5 rounded bg-[#151B24] border border-[#1E293B] ml-2">
                  <span className="text-[10px] font-mono text-[#00D1FF] uppercase block">EOC Directive:</span>
                  <span className="text-[11px]">{fac.recommendation}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 pl-2">
                  <span>Zone: <b className="text-slate-300">{fac.zoneId}</b></span>
                  <span className="text-[#00D1FF] hover:underline">Click to target</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Roads List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredRoads.map((road) => (
            <div
              key={road.id}
              id={`road-card-${road.id}`}
              onClick={() => {
                setSelectedRoadId(road.id);
                setSelectedZoneId(road.zoneId);
              }}
              className={`p-3.5 rounded border transition-all cursor-pointer space-y-2 bg-[#0A0E14] border-[#1E293B] ${
                road.status === 'BLOCKED'
                  ? 'border-l-4 border-l-red-500'
                  : road.status === 'HIGH_RISK'
                  ? 'border-l-4 border-l-orange-500'
                  : 'border-l-4 border-l-emerald-500'
              }`}
            >
              <div className="flex items-start justify-between gap-2 pl-2">
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">{road.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Length: {road.lengthKm} km • Inundation: <b className="text-red-400">{road.waterDepth} m</b>
                  </p>
                </div>

                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${getAccessBadge(road.status)}`}>
                  {road.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono p-2 rounded bg-[#151B24] border border-[#1E293B] ml-2">
                <div>
                  <span className="text-slate-500 block uppercase">Flood Risk</span>
                  <span className={`font-bold ${road.floodProbability > 70 ? 'text-red-400' : 'text-slate-300'}`}>
                    {road.floodProbability}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">Traffic Action</span>
                  <span className="font-bold text-white truncate block">{road.action}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-mono pl-2">
                {road.description}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
