import React, { useState, useEffect, useRef } from 'react';
import { useFlood } from '../context/FloodContext';
import { 
  Search, 
  X, 
  MapPin, 
  Navigation, 
  Building2, 
  ArrowRight, 
  Droplets,
  AlertTriangle
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    calculatedZones, 
    roads, 
    infrastructure, 
    setSelectedZoneId, 
    setSelectedRoadId, 
    setSelectedFacilityId,
    setCurrentView,
    setInspectedLocation
  } = useFlood();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Handle hotkey Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const matchingZones = cleanQuery
    ? calculatedZones.filter(z => z.name.toLowerCase().includes(cleanQuery))
    : calculatedZones.slice(0, 4);

  const matchingRoads = cleanQuery
    ? roads.filter(r => r.name.toLowerCase().includes(cleanQuery))
    : roads.slice(0, 4);

  const matchingInfra = cleanQuery
    ? infrastructure.filter(f => f.name.toLowerCase().includes(cleanQuery) || f.type.toLowerCase().includes(cleanQuery))
    : infrastructure.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in font-mono">
      <div className="w-full max-w-2xl bg-[#0A0E14] border border-[#1E293B] rounded shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1E293B] bg-[#151B24]">
          <Search className="w-4 h-4 text-[#00D1FF] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search location, road or facility (e.g. Ultadanga, VIP Road, SSKM)..."
            className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs px-2 py-0.5 rounded bg-[#0A0E14] border border-[#1E293B] text-slate-400 hover:text-slate-200 font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-4">
          
          {/* 1. Micro-catchments / Zones */}
          {matchingZones.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase text-[#00D1FF] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Flood Monitored Zones ({matchingZones.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingZones.map(zone => (
                  <div
                    key={zone.zoneId}
                    id={`search-item-${zone.zoneId}`}
                    onClick={() => {
                      setSelectedZoneId(zone.zoneId);
                      setInspectedLocation([zone.lat, zone.lng], zone.name);
                      setCurrentView('live-map');
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded bg-[#151B24] hover:bg-[#1E293B] border border-[#1E293B] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-sm ${
                        zone.riskLevel === 'SEVERE' ? 'bg-red-500' :
                        zone.riskLevel === 'HIGH' ? 'bg-orange-500' :
                        zone.riskLevel === 'MODERATE' ? 'bg-yellow-500' : 'bg-emerald-500'
                      }`} />
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#00D1FF] font-mono transition-colors">
                          {zone.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Rain: {zone.rainfall} mm/hr • Elev: {zone.elevation}m • Depth: {zone.waterDepth}m
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                        zone.riskLevel === 'SEVERE' ? 'bg-red-950/60 border-red-800 text-red-400' :
                        zone.riskLevel === 'HIGH' ? 'bg-orange-950/60 border-orange-800 text-orange-400' :
                        'bg-[#0A0E14] border-[#1E293B] text-slate-300'
                      }`}>
                        {zone.riskLevel} ({zone.floodProbability}%)
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#00D1FF] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Arterial Roads */}
          {matchingRoads.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" />
                <span>Road Arterials ({matchingRoads.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingRoads.map(road => (
                  <div
                    key={road.id}
                    id={`search-item-${road.id}`}
                    onClick={() => {
                      setSelectedRoadId(road.id);
                      setSelectedZoneId(road.zoneId);
                      setCurrentView('live-map');
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded bg-[#151B24] hover:bg-[#1E293B] border border-[#1E293B] cursor-pointer transition-colors group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-400 font-mono transition-colors">
                        {road.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Water: {road.waterDepth}m • Flood Prob: {road.floodProbability}% • Action: {road.action}
                      </p>
                    </div>

                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      road.status === 'BLOCKED' ? 'bg-red-950/60 border-red-800 text-red-400' :
                      road.status === 'HIGH_RISK' ? 'bg-orange-950/60 border-orange-800 text-orange-400' :
                      'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                    }`}>
                      {road.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Critical Infrastructure */}
          {matchingInfra.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase text-[#00D1FF] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Critical Facilities ({matchingInfra.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingInfra.map(fac => (
                  <div
                    key={fac.id}
                    id={`search-item-${fac.id}`}
                    onClick={() => {
                      setSelectedFacilityId(fac.id);
                      setInspectedLocation([fac.lat, fac.lng], fac.name);
                      setCurrentView('live-map');
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded bg-[#151B24] hover:bg-[#1E293B] border border-[#1E293B] cursor-pointer transition-colors group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#00D1FF] font-mono transition-colors">
                        {fac.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {fac.type.toUpperCase()} • {fac.address}
                      </p>
                    </div>

                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0A0E14] text-slate-300 border border-[#1E293B]">
                      {fac.accessibility}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-[#151B24] border-t border-[#1E293B] text-[10px] font-mono text-slate-500 flex items-center justify-between">
          <span>FloodGuard AI Geospatial Search Index</span>
          <span>Press ESC to close</span>
        </div>

      </div>
    </div>
  );
};
