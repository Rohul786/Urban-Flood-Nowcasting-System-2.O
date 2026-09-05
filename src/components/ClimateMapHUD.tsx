import React, { useState, useEffect, useRef } from 'react';
import { useFlood } from '../context/FloodContext';
import { ClimatePhenomenon } from '../types';
import { POPULAR_LOCATIONS, QuickLocation } from '../data/climateData';
import { 
  CloudRain, 
  Wind, 
  Zap, 
  Thermometer, 
  Compass, 
  Navigation, 
  Search, 
  MapPin, 
  AlertTriangle, 
  Play, 
  Pause, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Droplets, 
  Gauge, 
  Layers,
  Locate,
  Loader2,
  Maximize2,
  Map,
  Globe
} from 'lucide-react';

export const ClimateMapHUD: React.FC<{
  onFlyToLocation?: (lat: number, lng: number, zoom?: number) => void;
}> = ({ onFlyToLocation }) => {
  const { 
    climateTelemetry, 
    activePhenomenon, 
    setActivePhenomenon, 
    mapLayers, 
    toggleMapLayer,
    userCoordinates, 
    userLocationName, 
    isLocating, 
    requestUserLocation,
    inspectedCoordinates,
    inspectedLocationName,
    setInspectedLocation,
    simulationParams,
    setSimulationParams,
    nowcastStep,
    setNowcastStep,
    isPlayingNowcast,
    setIsPlayingNowcast,
    emergencyMode,
    toggleEmergencyMode,
    calculatedZones,
    setSelectedZoneId,
    setCurrentView,
    basemapType,
    setBasemapType
  } = useFlood();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isSearchingExternal, setIsSearchingExternal] = useState(false);
  const [externalResults, setExternalResults] = useState<QuickLocation[]>([]);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter local popular locations
  const filteredPopular = POPULAR_LOCATIONS.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Search external locations via OpenStreetMap Nominatim when user presses enter or types
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if matching local popular first
    if (filteredPopular.length > 0) {
      const top = filteredPopular[0];
      handleSelectLocation(top.lat, top.lng, top.name);
      return;
    }

    // Query Nominatim OpenStreetMap
    setIsSearchingExternal(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=4`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const results: QuickLocation[] = data.map((item: any) => ({
            id: `osm-${item.place_id}`,
            name: item.display_name.split(',')[0],
            subtitle: item.display_name.split(',').slice(1, 3).join(','),
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            region: 'National / Other',
            state: item.display_name.split(',').slice(1, 2).join('').trim(),
            isLocalKolkata: item.display_name.toLowerCase().includes('kolkata') || item.display_name.toLowerCase().includes('bengal')
          }));
          setExternalResults(results);
          setIsSearchDropdownOpen(true);
          // If first item exists, optionally select
          const first = results[0];
          handleSelectLocation(first.lat, first.lng, first.name);
        }
      }
    } catch (err) {
      console.warn('Geocoding search failed:', err);
    } finally {
      setIsSearchingExternal(false);
    }
  };

  const handleSelectLocation = (lat: number, lng: number, name: string) => {
    setInspectedLocation([lat, lng], name);
    setIsSearchDropdownOpen(false);
    setSearchQuery('');
    if (onFlyToLocation) {
      onFlyToLocation(lat, lng, 13);
    }
  };

  const handleMyLocationClick = () => {
    requestUserLocation();
    if (userCoordinates && onFlyToLocation) {
      onFlyToLocation(userCoordinates[0], userCoordinates[1], 14);
    }
  };

  const phenomenaList: { id: ClimatePhenomenon; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'All Phenomena', icon: Layers },
    { id: 'rain', label: 'Rain Radar', icon: CloudRain },
    { id: 'wind', label: 'Wind Flow', icon: Wind },
    { id: 'thunder', label: 'Thunder & Lightning', icon: Zap },
    { id: 'temp', label: 'Temperature', icon: Thermometer },
    { id: 'pressure', label: 'Isobar Pressure', icon: Compass },
    { id: 'flood', label: 'Flood Inundation', icon: Droplets }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-[1000] flex flex-col justify-between p-3 sm:p-5 font-mono">
      
      {/* Top Floating Control Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-auto">
        
        {/* Search Input & Location Dropdown */}
        <div ref={searchContainerRef} className="relative w-full sm:w-80 md:w-96 shadow-2xl">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="absolute left-3 text-cyan-400">
              {isSearchingExternal ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchDropdownOpen(true);
              }}
              onFocus={() => setIsSearchDropdownOpen(true)}
              placeholder="Search any place, city, or address..."
              className="w-full pl-9 pr-20 py-2.5 bg-[#0A0E14]/95 backdrop-blur-md border border-[#1E293B] hover:border-cyan-500/50 focus:border-[#00D1FF] rounded text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => { setSearchQuery(''); setIsSearchDropdownOpen(false); }}
                className="absolute right-12 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleMyLocationClick}
              title="Locate my position via GPS"
              className={`absolute right-1.5 px-2 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 border transition-all ${
                isLocating 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 animate-pulse' 
                  : 'bg-[#151B24] text-slate-300 border-[#1E293B] hover:border-cyan-400 hover:text-white'
              }`}
            >
              <Locate className="w-3 h-3 text-[#00D1FF]" />
              <span className="hidden md:inline">GPS</span>
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {isSearchDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0A0E14]/98 backdrop-blur-xl border border-[#1E293B] rounded shadow-2xl overflow-hidden max-h-80 overflow-y-auto divide-y divide-[#1E293B] z-50">
              
              {/* GPS Option */}
              <button
                type="button"
                onClick={() => {
                  handleMyLocationClick();
                  setIsSearchDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-[#151B24] flex items-center gap-2.5 text-cyan-400 text-xs font-mono group transition-colors"
              >
                <Locate className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-bold">Use My Live Location</div>
                  <div className="text-[10px] text-slate-400">
                    {userCoordinates ? `GPS: ${userCoordinates[0].toFixed(4)}°, ${userCoordinates[1].toFixed(4)}°` : 'Acquires device GPS sensor'}
                  </div>
                </div>
              </button>

              {/* Local / Popular Presets across India */}
              <div className="p-1.5 bg-[#151B24]/70 text-[10px] text-slate-300 uppercase tracking-wider px-3 font-bold flex items-center justify-between border-b border-[#1E293B]/60">
                <span className="text-cyan-400">National Flood Basins & Metros</span>
                <span className="text-[9px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">All India</span>
              </div>
              {filteredPopular.slice(0, 10).map(loc => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelectLocation(loc.lat, loc.lng, loc.name)}
                  className="w-full px-3 py-2 text-left hover:bg-[#151B24] flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400" />
                    <div className="min-w-0">
                      <div className="text-white font-medium truncate">{loc.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{loc.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0A0E14] border border-[#1E293B] text-slate-300 flex-shrink-0 whitespace-nowrap">
                    {loc.state || loc.region}
                  </span>
                </button>
              ))}

              {/* External Geocode Results */}
              {externalResults.length > 0 && (
                <>
                  <div className="p-1.5 bg-[#151B24]/40 text-[10px] text-slate-400 uppercase tracking-wider px-3 font-bold">
                    Global / National Matches
                  </div>
                  {externalResults.map(loc => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => handleSelectLocation(loc.lat, loc.lng, loc.name)}
                      className="w-full px-3 py-2 text-left hover:bg-[#151B24] flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Navigation className="w-3.5 h-3.5 text-amber-400" />
                        <div>
                          <div className="text-white font-medium">{loc.name}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-xs">{loc.subtitle}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Controls: Basemap Mode (Dark GIS vs Satellite) & Phenomena Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Basemap Switcher & All India Overview */}
          <div className="flex items-center bg-[#0A0E14]/90 backdrop-blur-md p-1 rounded border border-[#1E293B] shadow-xl text-xs font-mono">
            <button
              type="button"
              id="hud-all-india-btn"
              onClick={() => {
                setInspectedLocation([22.8, 80.0], 'India Nationwide Surveillance');
                if (onFlyToLocation) onFlyToLocation(22.8, 80.0, 5);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-[#1E293B] transition-all whitespace-nowrap border-r border-[#1E293B] mr-1"
              title="Fit map to whole country of India"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>All India</span>
            </button>
            <div className="flex items-center gap-1 pl-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase mr-1 hidden sm:inline">Mode:</span>
              <button
                type="button"
                id="hud-basemap-dark-btn"
                onClick={() => setBasemapType('dark')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all whitespace-nowrap ${
                  basemapType === 'dark'
                    ? 'bg-[#1E293B] text-cyan-400 font-bold border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Dark OSM (OpenStreetMap)"
              >
                <Map className="w-3.5 h-3.5" />
                <span>Dark OSM</span>
              </button>
              <button
                type="button"
                id="hud-basemap-satellite-btn"
                onClick={() => setBasemapType('satellite')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all whitespace-nowrap ${
                  basemapType === 'satellite'
                    ? 'bg-emerald-500 text-black font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Satellite View (Free Esri World Imagery)"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Satellite View</span>
                <span className="text-[9px] px-1 py-0.5 rounded bg-black/40 text-emerald-200 font-semibold leading-none">HD</span>
              </button>
            </div>
          </div>

          {/* Climate Phenomena Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none bg-[#0A0E14]/90 backdrop-blur-md p-1.5 rounded border border-[#1E293B] shadow-xl">
            {phenomenaList.map(item => {
              const Icon = item.icon;
              const isActive = activePhenomenon === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePhenomenon(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-[#00D1FF] text-black font-bold shadow-[0_0_12px_rgba(0,209,255,0.4)]' 
                      : 'text-slate-300 hover:text-white hover:bg-[#151B24]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-[#00D1FF]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Floating Climate Telemetry Card & Timeline */}
      <div className="w-full flex flex-col md:flex-row items-end justify-between gap-4 pointer-events-auto">
        
        {/* Location Telemetry HUD */}
        <div className="w-full md:w-[460px] bg-[#0A0E14]/95 backdrop-blur-xl border border-[#1E293B] rounded shadow-2xl overflow-hidden pointer-events-auto">
          
          {/* Card Header with Location & Warning */}
          <div className="p-3 border-b border-[#1E293B] bg-[#151B24]/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="truncate max-w-[200px] sm:max-w-[280px]">{climateTelemetry.locationName}</span>
                <span className="text-[10px] text-cyan-400 font-normal">
                  ({climateTelemetry.coordinates[0].toFixed(3)}°, {climateTelemetry.coordinates[1].toFixed(3)}°)
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#0A0E14]"
            >
              {isDetailsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>

          {/* Condition Banner */}
          <div className="px-3.5 py-2 bg-slate-950/80 border-b border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
              <span className="text-xs font-bold text-slate-200">{climateTelemetry.conditionText}</span>
            </div>
            <span className="text-[11px] font-bold text-cyan-400">
              {climateTelemetry.temperature}°C <span className="text-slate-500 font-normal text-[10px]">(Feels {climateTelemetry.feelsLike}°C)</span>
            </span>
          </div>

          {/* Warning Banner if High Convection / Flood */}
          {climateTelemetry.severeWarning && (
            <div className="px-3.5 py-1.5 bg-[#FF4B2B]/20 border-b border-[#FF4B2B]/40 text-red-300 text-[10px] font-mono flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-[#FF4B2B]" />
              <span className="truncate">{climateTelemetry.severeWarning}</span>
            </div>
          )}

          {/* Expanded Diagnostic Grid */}
          {isDetailsExpanded && (
            <div className="p-3.5 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-xs">
                
                {/* 1. Rain Radar */}
                <div className="p-2 rounded bg-[#151B24] border border-[#1E293B] space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase flex items-center gap-1">
                    <CloudRain className="w-3 h-3 text-[#00D1FF]" /> Rain Rate
                  </span>
                  <div className="text-sm font-bold text-white font-mono">{climateTelemetry.rainfallRate} <span className="text-[10px] text-slate-400">mm/h</span></div>
                  <span className="text-[9px] text-[#00D1FF] block font-mono">Doppler Push</span>
                </div>

                {/* 2. Wind Flow */}
                <div className="p-2 rounded bg-[#151B24] border border-[#1E293B] space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase flex items-center gap-1">
                    <Wind className="w-3 h-3 text-teal-400" /> Wind Flow
                  </span>
                  <div className="text-sm font-bold text-white font-mono">{climateTelemetry.windSpeed} <span className="text-[10px] text-slate-400">km/h</span></div>
                  <span className="text-[9px] text-slate-400 block font-mono">{climateTelemetry.windDirectionCompass} • Gust {climateTelemetry.windGust}</span>
                </div>

                {/* 3. Thunder & Lightning */}
                <div className="p-2 rounded bg-[#151B24] border border-[#1E293B] space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> Lightning
                  </span>
                  <div className="text-sm font-bold text-amber-400 font-mono">{climateTelemetry.recentLightningCount} <span className="text-[10px] text-slate-400">strikes</span></div>
                  <span className="text-[9px] text-amber-300/80 block font-mono">{climateTelemetry.thunderProbability}% Strike Prob</span>
                </div>

                {/* 4. Barometric Pressure */}
                <div className="p-2 rounded bg-[#151B24] border border-[#1E293B] space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-violet-400" /> Pressure
                  </span>
                  <div className="text-sm font-bold text-white font-mono">{climateTelemetry.pressure} <span className="text-[10px] text-slate-400">hPa</span></div>
                  <span className="text-[9px] text-rose-400 block font-mono">Low Trough</span>
                </div>

                {/* 5. Humidity */}
                <div className="p-2 rounded bg-[#151B24] border border-[#1E293B] space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-cyan-400" /> Humidity
                  </span>
                  <div className="text-sm font-bold text-white font-mono">{climateTelemetry.humidity}%</div>
                  <span className="text-[9px] text-cyan-400 block font-mono">Saturated</span>
                </div>

                {/* 6. Cloud Cover */}
                <div className="p-2 rounded bg-[#151B24] border border-[#1E293B] space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase flex items-center gap-1">
                    <Compass className="w-3 h-3 text-slate-400" /> Cloud Cover
                  </span>
                  <div className="text-sm font-bold text-white font-mono">{climateTelemetry.cloudCover}%</div>
                  <span className="text-[9px] text-slate-400 block font-mono">Overcast IR</span>
                </div>
              </div>

              {/* Action Buttons: Emergency & Route */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setCurrentView('command-center')}
                  className="flex-1 py-1.5 px-2.5 rounded bg-[#151B24] hover:bg-[#1E293B] border border-[#1E293B] text-slate-300 text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Command Center EOC</span>
                </button>
                <button
                  onClick={toggleEmergencyMode}
                  className={`py-1.5 px-3 rounded text-[11px] font-mono font-bold border transition-colors flex items-center gap-1.5 ${
                    emergencyMode
                      ? 'bg-[#FF4B2B] text-white border-red-500 animate-pulse'
                      : 'bg-[#0A0E14] text-slate-300 border-[#1E293B] hover:border-red-500 hover:text-red-400'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{emergencyMode ? 'EOC ACTIVE' : 'EOC STANDBY'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live 24H Climate & Inundation Timeline Scrubber */}
        <div className="w-full md:w-[420px] bg-[#0A0E14]/95 backdrop-blur-xl border border-[#1E293B] p-3 rounded shadow-2xl space-y-2 pointer-events-auto">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">Climate Forecast Timeline</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                {nowcastStep === 0 ? 'LIVE NOW' : `+${nowcastStep}H PROJECTION`}
              </span>
            </div>
            <button
              onClick={() => setIsPlayingNowcast(prev => !prev)}
              className="p-1 rounded bg-[#151B24] hover:bg-[#1E293B] border border-[#1E293B] text-cyan-400 flex items-center gap-1 text-[10px] font-mono"
            >
              {isPlayingNowcast ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPlayingNowcast ? 'PAUSE' : 'PLAY LOOP'}</span>
            </button>
          </div>

          <div className="grid grid-cols-6 gap-1 pt-1">
            {[0, 0.5, 1, 1.5, 2, 3].map((step) => {
              const isSelected = nowcastStep === step;
              return (
                <button
                  key={step}
                  onClick={() => setNowcastStep(step)}
                  className={`py-1.5 px-1 rounded text-center text-[10px] font-mono font-bold transition-all border ${
                    isSelected
                      ? 'bg-[#00D1FF] text-black border-[#00D1FF] shadow-[0_0_10px_rgba(0,209,255,0.4)]'
                      : 'bg-[#151B24] text-slate-400 border-[#1E293B] hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div>{step === 0 ? 'NOW' : `+${step}h`}</div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
