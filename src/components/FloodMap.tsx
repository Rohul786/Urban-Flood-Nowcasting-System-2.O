import React, { useEffect, useRef, useCallback, useState } from 'react';
import L from 'leaflet';
import { Layers, Map, Globe, Radio, CloudRain, Wind, Zap, ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { useFlood } from '../context/FloodContext';
import { ClimateMapHUD } from './ClimateMapHUD';
import { 
  GENERATE_WIND_GRID, 
  CYCLONIC_ISOBARS, 
  THUNDER_PROBABILITY_ZONES, 
  DOPPLER_RADAR_STATIONS 
} from '../data/climateData';

export const FloodMap: React.FC<{ 
  className?: string; 
  hideCardOverlay?: boolean;
  showHUD?: boolean;
}> = ({ 
  className = "w-full h-full min-h-[500px]",
  hideCardOverlay = false,
  showHUD = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layers refs
  const zonesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const drainageLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const roadsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const infraLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  
  // Climatic Phenomenon layer refs
  const userLocationLayerRef = useRef<L.LayerGroup | null>(null);
  const rainRadarLayerRef = useRef<L.LayerGroup | null>(null);
  const windLayerRef = useRef<L.LayerGroup | null>(null);
  const thunderLayerRef = useRef<L.LayerGroup | null>(null);
  const thunderZonesLayerRef = useRef<L.LayerGroup | null>(null);
  const radarSweepLayerRef = useRef<L.LayerGroup | null>(null);
  const tempLayerRef = useRef<L.LayerGroup | null>(null);
  const pressureLayerRef = useRef<L.LayerGroup | null>(null);

  // Basemap tile layer refs
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsTileLayerRef = useRef<L.TileLayer | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [isRadarWidgetExpanded, setIsRadarWidgetExpanded] = useState(true);

  const { 
    calculatedZones, 
    roads, 
    drainageNetworks, 
    infrastructure, 
    routes, 
    mapLayers, 
    toggleMapLayer,
    selectedZoneId, 
    setSelectedZoneId,
    setSelectedFacilityId,
    setSelectedRoadId,
    emergencyMode,
    currentView,
    userCoordinates,
    userLocationName,
    inspectedCoordinates,
    setInspectedLocation,
    activePhenomenon,
    lightningStrikes,
    simulationParams,
    climateTelemetry,
    basemapType,
    setBasemapType,
    showToast
  } = useFlood();

  const flyToCoords = useCallback((lat: number, lng: number, zoom: number = 13) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1.2 });
    }
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on inspected or user coordinates, fallback to India overview
    const initialCenter = inspectedCoordinates || userCoordinates || [22.8000, 80.0000];
    const initialZoom = (inspectedCoordinates || userCoordinates) ? 12 : 5;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: true,
    });

    // Custom zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initialize layer groups
    zonesLayerGroupRef.current = L.layerGroup().addTo(map);
    drainageLayerGroupRef.current = L.layerGroup().addTo(map);
    roadsLayerGroupRef.current = L.layerGroup().addTo(map);
    infraLayerGroupRef.current = L.layerGroup().addTo(map);
    routesLayerGroupRef.current = L.layerGroup().addTo(map);
    
    // Climate layer groups
    userLocationLayerRef.current = L.layerGroup().addTo(map);
    rainRadarLayerRef.current = L.layerGroup().addTo(map);
    windLayerRef.current = L.layerGroup().addTo(map);
    thunderLayerRef.current = L.layerGroup().addTo(map);
    thunderZonesLayerRef.current = L.layerGroup().addTo(map);
    radarSweepLayerRef.current = L.layerGroup().addTo(map);
    tempLayerRef.current = L.layerGroup().addTo(map);
    pressureLayerRef.current = L.layerGroup().addTo(map);

    // Click on map to inspect climate at that exact point
    map.on('click', (e: L.LeafletMouseEvent) => {
      setInspectedLocation(
        [e.latlng.lat, e.latlng.lng], 
        `Coordinates [${e.latlng.lat.toFixed(4)}°, ${e.latlng.lng.toFixed(4)}°]`
      );
    });

    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Switch Basemap Tile Layer (Dark GIS OSM vs High-Resolution Satellite View)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // Remove existing tile layers cleanly
    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
      baseTileLayerRef.current = null;
    }
    if (labelsTileLayerRef.current) {
      map.removeLayer(labelsTileLayerRef.current);
      labelsTileLayerRef.current = null;
    }

    if (basemapType === 'satellite') {
      // High-resolution Esri World Imagery (ArcGIS global satellite)
      const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        className: 'satellite-tiles',
      }).addTo(map);
      baseTileLayerRef.current = satLayer;

      // Urban boundaries and street labels reference overlay
      const labelsLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        opacity: 0.85,
      }).addTo(map);
      labelsTileLayerRef.current = labelsLayer;

      satLayer.bringToBack();
    } else {
      // OpenStreetMap standard tiles with dark theme styling
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        className: 'osm-dark-tiles',
      }).addTo(map);
      baseTileLayerRef.current = osmLayer;
      osmLayer.bringToBack();
    }
  }, [mapReady, basemapType]);

  // Fly to inspected coordinates when changed
  useEffect(() => {
    if (!mapInstanceRef.current || !inspectedCoordinates) return;
    mapInstanceRef.current.flyTo(inspectedCoordinates, 13, { duration: 1.0 });
  }, [inspectedCoordinates]);

  // 1. Render User Location Pulsing Ring Marker
  useEffect(() => {
    const layer = userLocationLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    if (!userCoordinates) return;

    // Outer radar wave circle
    const accuracyRing = L.circle(userCoordinates, {
      radius: 800,
      fillColor: '#00D1FF',
      fillOpacity: 0.15,
      color: '#00D1FF',
      weight: 1.5,
      dashArray: '3, 4'
    });
    layer.addLayer(accuracyRing);

    // Pulsing GPS marker
    const gpsIcon = L.divIcon({
      className: 'user-gps-pulse-marker',
      html: `
        <div style="position:relative; width:30px; height:30px; display:flex; align-items:center; justify-content:center;">
          <span style="position:absolute; width:100%; height:100%; border-radius:9999px; background-color:#00D1FF; opacity:0.65; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></span>
          <span style="position:absolute; width:16px; height:16px; border-radius:9999px; background-color:#00D1FF; border:3px solid #ffffff; box-shadow:0 0 14px #00D1FF;"></span>
          <span style="position:absolute; top:-16px; white-space:nowrap; background:#00D1FF; color:#000; font-family:monospace; font-size:9px; font-weight:800; padding:1px 5px; border-radius:3px;">
            YOU ARE HERE
          </span>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const marker = L.marker(userCoordinates, { icon: gpsIcon });
    marker.bindTooltip(`
      <div style="background:#0A0E14; color:#fff; padding:6px 10px; border-radius:4px; border:1px solid #00D1FF; font-family:monospace;">
        <div style="font-weight:700; color:#00D1FF; font-size:11px;">📍 YOUR CURRENT LOCATION</div>
        <div style="font-size:10px; color:#94a3b8; margin-top:2px;">[${userCoordinates[0].toFixed(4)}°, ${userCoordinates[1].toFixed(4)}°]</div>
      </div>
    `, { permanent: false, direction: 'top' });

    layer.addLayer(marker);
  }, [userCoordinates]);

  // 2. Render Rain Radar Doppler Reflectivity Bands & Precipitation Density (dBZ)
  useEffect(() => {
    const layer = rainRadarLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    const showRain = activePhenomenon === 'all' || activePhenomenon === 'rain';
    if (!showRain || (!mapLayers.rainfall && !mapLayers.weatherRadar)) return;

    // Multi-tier Doppler radar precipitation cells centered on regional storm cores across India
    const focalCenter = inspectedCoordinates || userCoordinates || [22.5726, 88.3839];
    const focalRainRate = climateTelemetry.rainfallRate || 74;

    const rainStormCenters = [
      // Dynamic local cell around user's focused/inspected coordinate
      {
        name: `${userLocationName || 'Inspected Region'} Convective Storm Cell`,
        center: focalCenter,
        peakRateMmH: focalRainRate,
        bands: [
          { radius: 4500, dbz: 64, color: '#c026d3', opacity: 0.42, label: 'Extreme Cloudburst Core (64 dBZ)' },
          { radius: 9500, dbz: 54, color: '#ef4444', opacity: 0.32, label: 'Torrential Inundation Core (54 dBZ)' },
          { radius: 17000, dbz: 44, color: '#f97316', opacity: 0.22, label: 'Heavy Convective Band (44 dBZ)' },
          { radius: 28000, dbz: 32, color: '#eab308', opacity: 0.15, label: 'Moderate Rainband (32 dBZ)' },
          { radius: 44000, dbz: 22, color: '#22c55e', opacity: 0.08, label: 'Light Precipitation Fringe (22 dBZ)' }
        ]
      },
      // Key Nationwide Monsoon Inundation Radar Cells
      // 1. Guwahati & Brahmaputra Corridor (High Convection)
      {
        name: 'Guwahati & Brahmaputra Cloudburst Band',
        center: [26.1550, 91.7500] as [number, number],
        peakRateMmH: 94,
        bands: [
          { radius: 12000, dbz: 65, color: '#c026d3', opacity: 0.40, label: '65 dBZ Cloudburst Torrent (>90 mm/h)' },
          { radius: 24000, dbz: 54, color: '#ef4444', opacity: 0.30, label: '54 dBZ Heavy Inundation' },
          { radius: 44000, dbz: 40, color: '#f97316', opacity: 0.20, label: '40 dBZ Valley Monsoon Band' },
          { radius: 70000, dbz: 28, color: '#22c55e', opacity: 0.10, label: '28 dBZ Outer Rainband' }
        ]
      },
      // 2. Mumbai & Western Ghats (Heavy Orographic Surge)
      {
        name: 'Mumbai Coastal Convective Squall',
        center: [19.0760, 72.8777] as [number, number],
        peakRateMmH: 86,
        bands: [
          { radius: 10000, dbz: 58, color: '#ef4444', opacity: 0.38, label: '58 dBZ Torrential Coastal Core' },
          { radius: 22000, dbz: 46, color: '#f97316', opacity: 0.26, label: '46 dBZ Urban Catchment Band' },
          { radius: 38000, dbz: 32, color: '#eab308', opacity: 0.16, label: '32 dBZ Arabian Surge Inflow' }
        ]
      },
      {
        name: 'Chiplun Vashishti Flash Flood Surge',
        center: [17.5323, 73.5186] as [number, number],
        peakRateMmH: 95,
        bands: [
          { radius: 9000, dbz: 64, color: '#c026d3', opacity: 0.40, label: '64 dBZ Mountain Deluge Core' },
          { radius: 18000, dbz: 52, color: '#ef4444', opacity: 0.28, label: '52 dBZ Ghats Inflow' }
        ]
      },
      // 3. Bihar Gangetic Basin
      {
        name: 'Patna & Kosi-Kamala Basin Inflow',
        center: [25.5941, 85.1376] as [number, number],
        peakRateMmH: 78,
        bands: [
          { radius: 11000, dbz: 56, color: '#ef4444', opacity: 0.34, label: '56 dBZ Gangetic Downpour' },
          { radius: 24000, dbz: 44, color: '#f97316', opacity: 0.22, label: '44 dBZ Basin Convergence' }
        ]
      },
      // 4. Delhi NCR & Yamuna Catchment
      {
        name: 'Delhi NCR Yamuna Catchment',
        center: [28.6139, 77.2090] as [number, number],
        peakRateMmH: 54,
        bands: [
          { radius: 14000, dbz: 48, color: '#f97316', opacity: 0.28, label: '48 dBZ Yamuna Monsoon Downpour' },
          { radius: 28000, dbz: 34, color: '#eab308', opacity: 0.16, label: '34 dBZ NCR Inflow' }
        ]
      },
      // 5. Kerala Coastal Corridor
      {
        name: 'Kochi & Periyar Basin Surge',
        center: [9.9312, 76.2673] as [number, number],
        peakRateMmH: 88,
        bands: [
          { radius: 12000, dbz: 60, color: '#c026d3', opacity: 0.38, label: '60 dBZ Periyar River Torrent' },
          { radius: 26000, dbz: 48, color: '#ef4444', opacity: 0.26, label: '48 dBZ Coastal Rainband' }
        ]
      },
      // 6. West Bengal Delta & Sundarbans
      {
        name: 'Kolkata Hooghly & Sundarbans Inundation',
        center: [22.5726, 88.3639] as [number, number],
        peakRateMmH: 84,
        bands: [
          { radius: 10000, dbz: 62, color: '#c026d3', opacity: 0.38, label: '62 dBZ Flash Inundation Core' },
          { radius: 22000, dbz: 50, color: '#ef4444', opacity: 0.28, label: '50 dBZ Delta Storm Band' },
          { radius: 38000, dbz: 36, color: '#eab308', opacity: 0.16, label: '36 dBZ Maritime Rainband' }
        ]
      }
    ];

    rainStormCenters.forEach(storm => {
      // Draw bands outermost to innermost so tooltips and visual layering are intuitive
      const reversedBands = [...storm.bands].reverse();
      reversedBands.forEach(band => {
        const circle = L.circle(storm.center, {
          radius: band.radius,
          fillColor: band.color,
          fillOpacity: band.opacity,
          color: band.color,
          weight: 1.2,
          dashArray: band.dbz >= 50 ? undefined : '4, 4'
        });

        circle.bindTooltip(`
          <div style="background:#0A0E14; color:#fff; padding:6px 10px; border-radius:6px; border:1px solid ${band.color}; font-family:monospace; font-size:10px; box-shadow:0 0 12px rgba(0,0,0,0.85);">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; border-bottom:1px solid #1E293B; padding-bottom:3px; margin-bottom:4px;">
              <span style="color:${band.color}; font-weight:800;">🌧️ DOPPLER REFLECTIVITY:</span>
              <span style="background:${band.color}; color:#000; font-weight:900; padding:1px 5px; border-radius:3px;">${band.dbz} dBZ</span>
            </div>
            <div style="font-weight:700; color:#f8fafc; font-size:11px;">${storm.name}</div>
            <div style="color:#94a3b8; margin-top:2px;">Band: <span style="color:#cbd5e1;">${band.label}</span></div>
            <div style="color:#94a3b8;">Est. Precipitation: <b style="color:#38bdf8;">~${Math.round(storm.peakRateMmH * (band.dbz / 65))} mm/h</b></div>
          </div>
        `, { permanent: false, direction: 'top' });

        layer.addLayer(circle);
      });
    });
  }, [activePhenomenon, mapLayers.rainfall, mapLayers.weatherRadar, inspectedCoordinates, userCoordinates, climateTelemetry.rainfallRate, userLocationName]);

  // 3. Render Wind Flow Vectors & Velocity Streamlines
  useEffect(() => {
    const layer = windLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    const showWind = activePhenomenon === 'all' || activePhenomenon === 'wind';
    if (!showWind || (!mapLayers.windVectors && !mapLayers.weatherRadar)) return;

    const windPoints = GENERATE_WIND_GRID(climateTelemetry.windSpeed, climateTelemetry.windDirectionDeg);

    windPoints.forEach(pt => {
      // Speed-dependent coloring and streamline length
      let color = '#4ade80'; // <25 km/h
      let speedClass = 'Gentle / Moderate Breeze';
      let beaufort = 'Beaufort 3-4';

      if (pt.speedKmh >= 65) {
        color = '#ef4444'; // >65 km/h gale
        speedClass = 'Gale Force / Severe Gusts';
        beaufort = 'Beaufort 8-9 (Gale)';
      } else if (pt.speedKmh >= 45) {
        color = '#f59e0b'; // 45-65 km/h strong
        speedClass = 'Strong Squall';
        beaufort = 'Beaufort 6-7 (Strong)';
      } else if (pt.speedKmh >= 25) {
        color = '#00D1FF'; // 25-45 km/h
        speedClass = 'Fresh Monsoon Inflow';
        beaufort = 'Beaufort 4-5';
      }

      // Streamline vector length scaled by velocity (meters)
      const lengthMeters = 700 + (pt.speedKmh * 18);
      const angleRad = (pt.directionDeg * Math.PI) / 180;
      const dLat = (lengthMeters / 111320) * Math.cos(angleRad);
      const dLng = (lengthMeters / (111320 * Math.cos((pt.lat * Math.PI) / 180))) * Math.sin(angleRad);

      const endLat = pt.lat + dLat;
      const endLng = pt.lng + dLng;

      // Streamline polyline
      const arrowLine = L.polyline([[pt.lat, pt.lng], [endLat, endLng]], {
        color: color,
        weight: pt.speedKmh >= 45 ? 3 : 2,
        opacity: 0.82,
      });

      // Directional Arrow Head Marker
      const arrowIcon = L.divIcon({
        className: 'wind-vector-marker',
        html: `
          <div style="transform: rotate(${pt.directionDeg}deg); color:${color}; font-size:${pt.speedKmh >= 45 ? '13px' : '11px'}; font-weight:900; display:flex; align-items:center; justify-content:center; text-shadow:0 0 8px #000;">
            ▲
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const headMarker = L.marker([endLat, endLng], { icon: arrowIcon });

      arrowLine.bindTooltip(`
        <div style="background:#0A0E14; color:#fff; padding:6px 9px; border-radius:5px; border:1px solid ${color}; font-family:monospace; font-size:10px; box-shadow:0 0 10px rgba(0,0,0,0.85);">
          <div style="color:${color}; font-weight:800; font-size:11px; display:flex; align-items:center; gap:4px;">
            💨 WIND VECTOR: ${pt.speedKmh} km/h
          </div>
          <div style="color:#e2e8f0; margin-top:2px;">Direction: <b>${pt.directionDeg}°</b> • Gusts: <b style="color:#f59e0b;">${pt.gustKmh} km/h</b></div>
          <div style="color:#94a3b8; font-size:9px; margin-top:1px;">Classification: ${speedClass} (${beaufort})</div>
        </div>
      `, { permanent: false, direction: 'center' });

      layer.addLayer(arrowLine);
      layer.addLayer(headMarker);
    });
  }, [activePhenomenon, mapLayers.windVectors, mapLayers.weatherRadar, climateTelemetry.windSpeed, climateTelemetry.windDirectionDeg]);

  // 4. Render Thunder Probability Zones & Convective Instability Cells
  useEffect(() => {
    const layer = thunderZonesLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    const showThunder = activePhenomenon === 'all' || activePhenomenon === 'thunder';
    if (!showThunder || (!mapLayers.thunderZones && !mapLayers.weatherRadar)) return;

    THUNDER_PROBABILITY_ZONES.forEach(zone => {
      const isExtreme = zone.probability >= 80;
      const primaryColor = isExtreme ? '#ef4444' : '#f59e0b';
      const coreColor = isExtreme ? '#7f1d1d' : '#78350f';

      // Outer convective hazard boundary
      const outerRing = L.circle(zone.center, {
        radius: zone.radiusKm * 1000,
        fillColor: coreColor,
        fillOpacity: isExtreme ? 0.18 : 0.12,
        color: primaryColor,
        weight: 1.8,
        dashArray: '5, 5'
      });

      // Inner intense updraft convective core
      const innerCore = L.circle(zone.center, {
        radius: zone.radiusKm * 400,
        fillColor: primaryColor,
        fillOpacity: 0.28,
        color: primaryColor,
        weight: 2
      });

      // Interactive Center Badge
      const badgeIcon = L.divIcon({
        className: 'thunder-zone-badge',
        html: `
          <div class="pointer-events-auto cursor-pointer" style="display:flex; flex-direction:column; align-items:center; filter:drop-shadow(0 0 8px rgba(0,0,0,0.8));">
            <div style="background:${isExtreme ? '#dc2626' : '#d97706'}; color:#fff; border:1px solid #ffffff; font-family:monospace; font-size:10px; font-weight:900; padding:2px 6px; border-radius:9999px; white-space:nowrap; display:flex; align-items:center; gap:4px; box-shadow:0 0 12px ${primaryColor};">
              <span style="font-size:12px;">⚡</span>
              <span>${zone.probability}% THUNDER</span>
            </div>
            <div style="background:#0A0E14; color:#cbd5e1; border:1px solid ${primaryColor}; font-family:monospace; font-size:8px; font-weight:700; padding:1px 4px; border-radius:3px; margin-top:2px; white-space:nowrap;">
              CAPE: ${zone.capeJkg} J/kg
            </div>
          </div>
        `,
        iconSize: [110, 36],
        iconAnchor: [55, 18]
      });

      const badgeMarker = L.marker(zone.center, { icon: badgeIcon });

      const tooltipContent = `
        <div style="background:#0A0E14; color:#fff; padding:8px 12px; border-radius:6px; border:1px solid ${primaryColor}; font-family:monospace; max-width:240px; box-shadow:0 0 16px rgba(0,0,0,0.9);">
          <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #1E293B; padding-bottom:4px; margin-bottom:6px;">
            <span style="color:${primaryColor}; font-weight:800; font-size:11px;">⚡ CONVECTIVE THUNDER ZONE</span>
            <span style="background:${primaryColor}; color:#000; font-weight:900; font-size:9px; padding:1px 5px; border-radius:3px;">${zone.riskCategory}</span>
          </div>
          <div style="font-weight:700; font-size:11px; color:#f8fafc;">${zone.name} (${zone.state})</div>
          <div style="margin-top:6px; display:grid; grid-template-columns: 1fr 1fr; gap:4px; font-size:9px; color:#94a3b8;">
            <div>Thunder Probability: <b style="color:${primaryColor}; font-size:11px;">${zone.probability}%</b></div>
            <div>CAPE Energy: <b style="color:#e2e8f0;">${zone.capeJkg} J/kg</b></div>
            <div>Cloud Top: <b style="color:#e2e8f0;">${zone.cloudTopKm} km</b></div>
            <div>Discharges: <b style="color:#f59e0b;">${zone.lightningStrikeRate}</b></div>
          </div>
          <div style="margin-top:6px; padding-top:4px; border-top:1px solid #1E293B; font-size:9px; color:#cbd5e1; line-height:1.3;">
            ${zone.convectiveWarning}
          </div>
        </div>
      `;

      outerRing.bindTooltip(tooltipContent, { permanent: false, direction: 'top' });
      badgeMarker.bindTooltip(tooltipContent, { permanent: false, direction: 'top' });

      layer.addLayer(outerRing);
      layer.addLayer(innerCore);
      layer.addLayer(badgeMarker);
    });
  }, [activePhenomenon, mapLayers.thunderZones, mapLayers.weatherRadar]);

  // 5. Render Thunder & Lightning Real-time Ground Strikes
  useEffect(() => {
    const layer = thunderLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    const showThunder = activePhenomenon === 'all' || activePhenomenon === 'thunder';
    if (!showThunder || (!mapLayers.lightningStrikes && !mapLayers.weatherRadar)) return;

    lightningStrikes.forEach(strike => {
      // Flashing lightning icon marker
      const strikeIcon = L.divIcon({
        className: 'lightning-strike-marker',
        html: `
          <div style="position:relative; width:32px; height:32px; display:flex; align-items:center; justify-content:center;">
            <span style="position:absolute; width:100%; height:100%; border-radius:9999px; background-color:#f59e0b; opacity:0.6; animation:ping 1s cubic-bezier(0,0,0.2,1) infinite;"></span>
            <div style="background-color:#fbbf24; border:2px solid #ffffff; width:22px; height:22px; border-radius:9999px; display:flex; align-items:center; justify-content:center; color:#000; font-size:12px; font-weight:900; box-shadow:0 0 16px #f59e0b;">
              ⚡
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([strike.lat, strike.lng], { icon: strikeIcon });
      
      // Shockwave ring
      const shockwave = L.circle([strike.lat, strike.lng], {
        radius: 1200,
        fillColor: '#fbbf24',
        fillOpacity: 0.12,
        color: '#f59e0b',
        weight: 1.5,
        dashArray: '2, 3'
      });

      marker.bindTooltip(`
        <div style="background:#0A0E14; color:#fff; padding:6px 10px; border-radius:4px; border:1px solid #fbbf24; font-family:monospace;">
          <div style="font-weight:800; color:#fbbf24; font-size:11px;">⚡ CONVECTIVE LIGHTNING STRIKE</div>
          <div style="font-size:10px; color:#cbd5e1; margin-top:2px;">Peak Discharge: <b style="color:#f59e0b;">${strike.intensityKa} kA</b></div>
          <div style="font-size:10px; color:#94a3b8;">Recorded: ${strike.timestamp} • ${strike.locationName}</div>
        </div>
      `, { permanent: false, direction: 'top' });

      layer.addLayer(shockwave);
      layer.addLayer(marker);
    });
  }, [activePhenomenon, mapLayers.lightningStrikes, mapLayers.weatherRadar, lightningStrikes]);

  // 6. Render Doppler Radar Stations, Sweep Rings & Range Markers
  useEffect(() => {
    const layer = radarSweepLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    if (!mapLayers.weatherRadar) return;

    DOPPLER_RADAR_STATIONS.forEach(station => {
      // Range rings at 50km, 120km, 220km
      const rangeRings = [
        { radius: 50000, label: '50 km' },
        { radius: 120000, label: '120 km' },
        { radius: 220000, label: '220 km' }
      ];

      rangeRings.forEach(ring => {
        const ringCircle = L.circle([station.lat, station.lng], {
          radius: ring.radius,
          fillColor: '#00D1FF',
          fillOpacity: 0.015,
          color: '#00D1FF',
          weight: 0.8,
          dashArray: '3, 6'
        });
        layer.addLayer(ringCircle);
      });

      // Radar Station Antenna Marker with animated radar sweep
      const radarDishIcon = L.divIcon({
        className: 'radar-dish-marker',
        html: `
          <div style="position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
            <div class="animate-radar-sweep" style="position:absolute; width:44px; height:44px; border-radius:9999px; border:1px solid rgba(0,209,255,0.4); background: conic-gradient(from 0deg, rgba(0,209,255,0.35) 0deg, rgba(0,209,255,0.05) 50deg, transparent 360deg);"></div>
            <div style="width:22px; height:22px; border-radius:9999px; background:#0A0E14; border:2px solid #00D1FF; display:flex; align-items:center; justify-content:center; box-shadow:0 0 12px #00D1FF; color:#00D1FF; font-size:11px;">
              📡
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const stationMarker = L.marker([station.lat, station.lng], { icon: radarDishIcon });
      stationMarker.bindTooltip(`
        <div style="background:#0A0E14; color:#fff; padding:6px 10px; border-radius:4px; border:1px solid #00D1FF; font-family:monospace; font-size:10px;">
          <div style="font-weight:800; color:#00D1FF;">📡 ${station.name} (${station.stationCode})</div>
          <div style="color:#cbd5e1; margin-top:2px;">Frequency: <b>${station.frequency}</b> • Range: <b>${station.rangeKm} km</b></div>
          <div style="color:#4ade80; font-size:9px; margin-top:1px;">Status: ACTIVE S-BAND DOPPLER (0.5° - 19.5° Elevation)</div>
        </div>
      `, { permanent: false, direction: 'top' });

      layer.addLayer(stationMarker);
    });
  }, [mapLayers.weatherRadar]);

  // 5. Render Atmospheric Pressure Isobars
  useEffect(() => {
    const layer = pressureLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    const showPressure = activePhenomenon === 'all' || activePhenomenon === 'pressure';
    if (!showPressure || !mapLayers.pressureIsobars) return;

    CYCLONIC_ISOBARS.forEach(isobar => {
      const circle = L.circle(isobar.center, {
        radius: isobar.radius,
        fillColor: isobar.pressureHpa <= 996 ? '#e11d48' : '#8b5cf6',
        fillOpacity: 0.05,
        color: isobar.pressureHpa <= 996 ? '#f43f5e' : '#a78bfa',
        weight: isobar.pressureHpa <= 996 ? 2.5 : 1.5,
        dashArray: '6, 6'
      });

      circle.bindTooltip(`
        <div style="background:#0A0E14; color:#fff; padding:4px 8px; border-radius:4px; border:1px solid #a78bfa; font-family:monospace; font-size:10px;">
          🌀 ISOBAR: <b>${isobar.label}</b>
        </div>
      `, { permanent: false, direction: 'center' });

      layer.addLayer(circle);
    });
  }, [activePhenomenon, mapLayers.pressureIsobars]);

  // 6. Render Temperature Heat Contours
  useEffect(() => {
    const layer = tempLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    const showTemp = activePhenomenon === 'temp';
    if (!showTemp || !mapLayers.temperatureHeatmap) return;

    const tempZones = [
      { center: [28.6139, 77.2090] as [number, number], radius: 25000, temp: '34.5°C (North Plains)', color: '#f97316' },
      { center: [19.0760, 72.8777] as [number, number], radius: 22000, temp: '30.8°C (Konkan Coast)', color: '#fb923c' },
      { center: [26.1550, 91.7500] as [number, number], radius: 24000, temp: '28.4°C (Brahmaputra Valley)', color: '#38bdf8' },
      { center: [22.5726, 88.3639] as [number, number], radius: 20000, temp: '31.2°C (Gangetic Delta)', color: '#f97316' },
      { center: [9.9312, 76.2673] as [number, number], radius: 22000, temp: '27.6°C (Malabar Coast)', color: '#0284c7' },
      { center: [13.0827, 80.2707] as [number, number], radius: 21000, temp: '32.1°C (Coromandel Coast)', color: '#ea580c' }
    ];

    tempZones.forEach(tz => {
      const circle = L.circle(tz.center, {
        radius: tz.radius,
        fillColor: tz.color,
        fillOpacity: 0.18,
        color: tz.color,
        weight: 1.5,
      });
      circle.bindTooltip(`
        <div style="background:#0A0E14; color:#fff; padding:4px 8px; border-radius:4px; border:1px solid ${tz.color}; font-family:monospace; font-size:10px;">
          🌡️ AMBIENT THERMAL: <b>${tz.temp}</b>
        </div>
      `, { permanent: false, direction: 'top' });
      layer.addLayer(circle);
    });
  }, [activePhenomenon, mapLayers.temperatureHeatmap]);

  // 7. Update Flood Risk Zones
  useEffect(() => {
    const layer = zonesLayerGroupRef.current;
    if (!layer) return;
    layer.clearLayers();

    const showFlood = activePhenomenon === 'all' || activePhenomenon === 'flood';
    if (!showFlood && !mapLayers.floodRisk && !mapLayers.waterlogging) return;

    calculatedZones.forEach(zone => {
      const isSelected = zone.zoneId === selectedZoneId;
      
      let fillColor = '#10b981'; // Green LOW
      let strokeColor = '#059669';
      if (zone.riskLevel === 'SEVERE') {
        fillColor = '#ef4444'; // Red SEVERE
        strokeColor = '#dc2626';
      } else if (zone.riskLevel === 'HIGH') {
        fillColor = '#f97316'; // Orange HIGH
        strokeColor = '#ea580c';
      } else if (zone.riskLevel === 'MODERATE') {
        fillColor = '#f59e0b'; // Yellow MODERATE
        strokeColor = '#d97706';
      }

      // Zone Circle
      const circle = L.circle([zone.lat, zone.lng], {
        radius: zone.radius,
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.45 : (zone.riskLevel === 'SEVERE' ? 0.38 : 0.25),
        color: isSelected ? '#38bdf8' : strokeColor,
        weight: isSelected ? 3 : (zone.riskLevel === 'SEVERE' ? 2 : 1.5),
        dashArray: isSelected ? '4, 4' : undefined,
      });

      circle.on('click', () => {
        setSelectedZoneId(zone.zoneId);
        setInspectedLocation([zone.lat, zone.lng], zone.name);
      });

      const stateLabel = zone.state ? `${zone.state}` : '';
      const basinLabel = zone.riverBasin ? ` • ${zone.riverBasin}` : (zone.region ? ` • ${zone.region}` : '');

      circle.bindTooltip(`
        <div style="background:#0f172a; color:#f8fafc; padding:6px 10px; border-radius:6px; border:1px solid #334155; font-family:'Plus Jakarta Sans',sans-serif;">
          <div style="font-weight:700; font-size:12px; display:flex; justify-content:space-between; gap:12px;">
            <span>${zone.name}</span>
            <span style="color:${fillColor}; font-weight:800;">${zone.riskLevel}</span>
          </div>
          ${stateLabel ? `<div style="font-size:10px; color:#38bdf8; font-weight:600; margin-top:1px;">📍 ${stateLabel}${basinLabel}</div>` : ''}
          <div style="font-size:11px; color:#94a3b8; margin-top:2px;">
            Depth: <b style="color:#fff;">${zone.waterDepth} m</b> • Prob: <b style="color:#38bdf8;">${zone.floodProbability}%</b>
          </div>
        </div>
      `, { permanent: false, direction: 'top', className: 'custom-leaflet-tooltip' });

      layer.addLayer(circle);

      // Severe zones get animated pulsating marker
      if (zone.riskLevel === 'SEVERE') {
        const pulseIcon = L.divIcon({
          className: 'custom-pulse-marker',
          html: `
            <div style="position:relative; width:24px; height:24px;">
              <span class="animate-ping" style="position:absolute; width:100%; height:100%; border-radius:9999px; background-color:#ef4444; opacity:0.6;"></span>
              <span style="position:absolute; inset:4px; border-radius:9999px; background-color:#dc2626; border:2px solid #ffffff; box-shadow:0 0 10px #ef4444;"></span>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        const pulseMarker = L.marker([zone.lat, zone.lng], { icon: pulseIcon });
        pulseMarker.on('click', () => {
          setSelectedZoneId(zone.zoneId);
          setInspectedLocation([zone.lat, zone.lng], zone.name);
        });
        layer.addLayer(pulseMarker);
      }
    });
  }, [calculatedZones, activePhenomenon, mapLayers.floodRisk, mapLayers.waterlogging, selectedZoneId, setSelectedZoneId, setInspectedLocation]);

  // 8. Update Drainage Network
  useEffect(() => {
    const layer = drainageLayerGroupRef.current;
    if (!layer) return;
    layer.clearLayers();

    if (!mapLayers.drainageNetwork) return;

    drainageNetworks.forEach(drain => {
      let color = '#0ea5e9';
      let weight = 3;
      let dashArray = undefined;

      if (drain.status === 'BLOCKED') {
        color = '#a855f7';
        weight = 4.5;
        dashArray = '6, 4';
      } else if (drain.status === 'CRITICAL') {
        color = '#ef4444';
        weight = 4;
      } else if (drain.status === 'STRESSED') {
        color = '#f59e0b';
        weight = 3.5;
      }

      const polyline = L.polyline(drain.coordinates, {
        color,
        weight,
        opacity: 0.85,
        dashArray,
      });

      polyline.bindTooltip(`
        <div style="background:#0f172a; color:#f8fafc; padding:6px 10px; border-radius:6px; border:1px solid #334155; font-family:'Plus Jakarta Sans',sans-serif;">
          <div style="font-weight:700; font-size:12px; color:#38bdf8;">${drain.id}: ${drain.name}</div>
          <div style="font-size:11px; color:#94a3b8; margin-top:2px;">
            Load: <b>${drain.currentLoad}/${drain.baseCapacity} m³/min</b> (${drain.utilization}%)
          </div>
          <div style="font-size:11px; font-weight:700; color:${color}; margin-top:2px;">Status: ${drain.status}</div>
        </div>
      `, { permanent: false, direction: 'center' });

      layer.addLayer(polyline);
    });
  }, [drainageNetworks, mapLayers.drainageNetwork]);

  // 9. Update Roads Network
  useEffect(() => {
    const layer = roadsLayerGroupRef.current;
    if (!layer) return;
    layer.clearLayers();

    if (!mapLayers.roadNetwork) return;

    roads.forEach(road => {
      let color = '#10b981';
      let weight = 3;
      let dashArray = undefined;

      if (road.status === 'BLOCKED') {
        color = '#ef4444';
        weight = 5;
        dashArray = '8, 4';
      } else if (road.status === 'HIGH_RISK') {
        color = '#f97316';
        weight = 4;
      } else if (road.status === 'CAUTION') {
        color = '#f59e0b';
        weight = 3.5;
      }

      const polyline = L.polyline(road.coordinates, {
        color,
        weight,
        opacity: 0.9,
        dashArray,
      });

      polyline.on('click', () => {
        setSelectedRoadId(road.id);
      });

      polyline.bindTooltip(`
        <div style="background:#0f172a; color:#f8fafc; padding:6px 10px; border-radius:6px; border:1px solid #334155; font-family:'Plus Jakarta Sans',sans-serif;">
          <div style="font-weight:700; font-size:12px; color:#fff;">${road.name}</div>
          <div style="font-size:11px; color:#cbd5e1; margin-top:2px;">
            Water Depth: <b style="color:#ef4444;">${road.waterDepth} m</b> • Flood Prob: <b>${road.floodProbability}%</b>
          </div>
          <div style="font-size:11px; font-weight:700; color:${color}; margin-top:2px;">Status: ${road.status.replace('_', ' ')} • Action: ${road.action}</div>
        </div>
      `, { permanent: false, direction: 'top' });

      layer.addLayer(polyline);
    });
  }, [roads, mapLayers.roadNetwork, setSelectedRoadId]);

  // 10. Update Infrastructure Facilities
  useEffect(() => {
    const layer = infraLayerGroupRef.current;
    if (!layer) return;
    layer.clearLayers();

    const shouldShow = (type: string) => {
      switch (type) {
        case 'hospital': return mapLayers.hospitals;
        case 'police': return mapLayers.policeStations;
        case 'fire_station': return mapLayers.fireStations;
        case 'shelter': return mapLayers.emergencyShelters;
        case 'school': return mapLayers.schools;
        case 'power_station': return mapLayers.powerStations;
        default: return true;
      }
    };

    infrastructure.forEach(fac => {
      if (!shouldShow(fac.type)) return;

      let iconSymbol = 'H';
      let bgColor = '#ef4444';
      if (fac.type === 'hospital') {
        iconSymbol = '+';
        bgColor = '#ef4444';
      } else if (fac.type === 'shelter') {
        iconSymbol = '⌂';
        bgColor = '#10b981';
      } else if (fac.type === 'police') {
        iconSymbol = '★';
        bgColor = '#3b82f6';
      } else if (fac.type === 'fire_station') {
        iconSymbol = '🔥';
        bgColor = '#f97316';
      } else if (fac.type === 'power_station') {
        iconSymbol = '⚡';
        bgColor = '#eab308';
      } else if (fac.type === 'school') {
        iconSymbol = '🎓';
        bgColor = '#a855f7';
      }

      let borderColor = '#ffffff';
      if (fac.accessibility === 'CUT_OFF') borderColor = '#ef4444';
      else if (fac.accessibility === 'HIGH_RISK') borderColor = '#f97316';
      else if (fac.accessibility === 'PARTIALLY_IMPAIRED') borderColor = '#f59e0b';

      const customIcon = L.divIcon({
        className: 'infra-marker',
        html: `
          <div style="background-color:${bgColor}; width:24px; height:24px; border-radius:6px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:12px; font-weight:900; border:2px solid ${borderColor}; box-shadow:0 2px 6px rgba(0,0,0,0.6); cursor:pointer;">
            ${iconSymbol}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([fac.lat, fac.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedFacilityId(fac.id);
      });

      marker.bindTooltip(`
        <div style="background:#0A0E14; color:#F8FAFC; padding:6px 10px; border-radius:4px; border:1px solid #1E293B; font-family:monospace;">
          <div style="font-weight:700; font-size:12px; color:#fff;">${fac.name}</div>
          <div style="font-size:10px; color:#64748B; text-transform:uppercase;">${fac.type.replace('_', ' ')} • Access: <b style="color:${borderColor}">${fac.accessibility}</b></div>
          <div style="font-size:11px; color:#CBD5E1; margin-top:2px;">${fac.capacity}</div>
        </div>
      `, { permanent: false, direction: 'top' });

      layer.addLayer(marker);
    });
  }, [infrastructure, mapLayers, setSelectedFacilityId]);

  // 11. Update Safe Routes Overlays
  useEffect(() => {
    const layer = routesLayerGroupRef.current;
    if (!layer) return;
    layer.clearLayers();

    if (currentView !== 'safe-routes' && currentView !== 'live-map' && !emergencyMode) return;

    // 1. Direct / Fastest (Flooded Hazard Route)
    const directPolyline = L.polyline(routes.fastest.path, {
      color: '#FF4B2B',
      weight: 4,
      dashArray: '8, 6',
      opacity: 0.8,
    });
    directPolyline.bindTooltip('⚠️ Fastest Direct Route (CROSSES SEVERE FLOOD BASIN - HIGH RISK)', { sticky: true });
    layer.addLayer(directPolyline);

    // 2. Safe Diverted Route (Recommended by FloodGuard AI)
    const safePolyline = L.polyline(routes.floodSafe.path, {
      color: '#00D1FF',
      weight: 5,
      opacity: 0.95,
    });
    safePolyline.bindTooltip('✅ RECOMMENDED: Flood-Safe Route (Elevated Bypass - 100% Waterlogging Avoided)', { sticky: true });
    layer.addLayer(safePolyline);

  }, [routes, currentView, emergencyMode]);

  return (
    <div className={`relative ${className} rounded overflow-hidden border border-[#1E293B] shadow-2xl bg-[#0A0E14]`}>
      {/* Map Canvas */}
      <div 
        ref={mapContainerRef} 
        className={`w-full h-full ${basemapType === 'dark' ? 'leaflet-dark-tiles' : ''}`} 
        style={{ minHeight: '100%' }} 
      />

      {/* Modern Climate HUD Overlay */}
      {showHUD && (
        <ClimateMapHUD onFlyToLocation={flyToCoords} />
      )}

      {/* Real-Time Weather Radar Floating Control HUD */}
      <div 
        id="weather-radar-map-hud"
        className="absolute top-16 left-3 sm:left-4 z-[999] bg-[#0A0E14]/95 backdrop-blur-md border border-cyan-900/60 rounded-lg shadow-2xl font-mono pointer-events-auto max-w-[290px] sm:max-w-xs transition-all overflow-hidden"
        role="region"
        aria-label="Doppler Weather Radar Controls"
      >
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#0D1520] border-b border-cyan-950">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
              <Radio className="w-3 h-3 text-cyan-400" />
              Doppler Weather Radar
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[8px] bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-1.5 py-0.2 rounded font-bold">
              LIVE 2.8GHz
            </span>
            <button
              type="button"
              id="btn-toggle-radar-hud-collapse"
              onClick={() => setIsRadarWidgetExpanded(!isRadarWidgetExpanded)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
              title={isRadarWidgetExpanded ? "Collapse Radar Panel" : "Expand Radar Panel"}
            >
              {isRadarWidgetExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {isRadarWidgetExpanded && (
          <div className="p-2 space-y-2">
            {/* Quick-toggle action chips */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                id="hud-toggle-precip"
                onClick={() => {
                  toggleMapLayer('rainfall');
                  showToast(`Precipitation Density: ${mapLayers.rainfall ? 'OFF' : 'ON'}`);
                }}
                className={`flex items-center justify-between px-2 py-1 rounded text-[9px] font-semibold border transition-all cursor-pointer ${
                  mapLayers.rainfall
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                    : 'bg-[#0F1722] text-slate-400 border-[#1E293B] hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-1">
                  <CloudRain className="w-3 h-3" />
                  Precip Density
                </span>
                <span className={`text-[8px] font-bold ${mapLayers.rainfall ? 'text-cyan-300' : 'text-slate-500'}`}>
                  {mapLayers.rainfall ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                type="button"
                id="hud-toggle-wind"
                onClick={() => {
                  toggleMapLayer('windVectors');
                  showToast(`Wind Speed Vectors: ${mapLayers.windVectors ? 'OFF' : 'ON'}`);
                }}
                className={`flex items-center justify-between px-2 py-1 rounded text-[9px] font-semibold border transition-all cursor-pointer ${
                  mapLayers.windVectors
                    ? 'bg-teal-950 text-teal-300 border-teal-500/60 shadow-[0_0_8px_rgba(45,212,191,0.2)]'
                    : 'bg-[#0F1722] text-slate-400 border-[#1E293B] hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Wind className="w-3 h-3" />
                  Wind Vectors
                </span>
                <span className={`text-[8px] font-bold ${mapLayers.windVectors ? 'text-teal-300' : 'text-slate-500'}`}>
                  {mapLayers.windVectors ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                type="button"
                id="hud-toggle-thunder"
                onClick={() => {
                  toggleMapLayer('thunderZones');
                  showToast(`Thunder Probability Zones: ${mapLayers.thunderZones ? 'OFF' : 'ON'}`);
                }}
                className={`flex items-center justify-between px-2 py-1 rounded text-[9px] font-semibold border transition-all cursor-pointer ${
                  mapLayers.thunderZones
                    ? 'bg-amber-950 text-amber-300 border-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                    : 'bg-[#0F1722] text-slate-400 border-[#1E293B] hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Thunder Zones
                </span>
                <span className={`text-[8px] font-bold ${mapLayers.thunderZones ? 'text-amber-300' : 'text-slate-500'}`}>
                  {mapLayers.thunderZones ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                type="button"
                id="hud-toggle-radar-sweep"
                onClick={() => {
                  toggleMapLayer('weatherRadar');
                  showToast(`Radar Sweep & Rings: ${mapLayers.weatherRadar ? 'OFF' : 'ON'}`);
                }}
                className={`flex items-center justify-between px-2 py-1 rounded text-[9px] font-semibold border transition-all cursor-pointer ${
                  mapLayers.weatherRadar
                    ? 'bg-sky-950 text-sky-300 border-sky-500/60 shadow-[0_0_8px_rgba(56,189,248,0.2)]'
                    : 'bg-[#0F1722] text-slate-400 border-[#1E293B] hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Radio className="w-3 h-3" />
                  Sweep & Rings
                </span>
                <span className={`text-[8px] font-bold ${mapLayers.weatherRadar ? 'text-sky-300' : 'text-slate-500'}`}>
                  {mapLayers.weatherRadar ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            {/* dBZ Reflectivity Scale Bar */}
            <div className="pt-1 border-t border-cyan-950">
              <div className="flex items-center justify-between text-[8px] text-slate-400 mb-1">
                <span>Reflectivity (dBZ)</span>
                <span className="text-cyan-400 font-bold">15 to 65+ dBZ</span>
              </div>
              <div className="grid grid-cols-5 gap-0.5 rounded overflow-hidden h-2.5">
                <div className="bg-[#22c55e] flex items-center justify-center text-[7px] font-bold text-black" title="<30 dBZ: Light Shower">20</div>
                <div className="bg-[#eab308] flex items-center justify-center text-[7px] font-bold text-black" title="30-40 dBZ: Moderate Rain">35</div>
                <div className="bg-[#f97316] flex items-center justify-center text-[7px] font-bold text-black" title="40-50 dBZ: Heavy Rain">45</div>
                <div className="bg-[#ef4444] flex items-center justify-center text-[7px] font-bold text-white" title="50-60 dBZ: Torrential">55</div>
                <div className="bg-[#c026d3] flex items-center justify-center text-[7px] font-bold text-white" title="60+ dBZ: Cloudburst / Hail">65+</div>
              </div>
              <div className="flex items-center justify-between text-[7px] text-slate-500 mt-0.5">
                <span>Light</span>
                <span>Moderate</span>
                <span>Torrential</span>
                <span>Cloudburst</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Mode Switcher - Dedicated Floating Map Control */}
      <div 
        id="map-mode-control"
        className="absolute bottom-20 right-3 sm:right-4 z-[999] bg-[#0A0E14]/95 backdrop-blur-md border border-[#1E293B] p-1.5 sm:p-2 rounded-lg shadow-2xl font-mono pointer-events-auto flex flex-col gap-1.5"
        role="region"
        aria-label="Map Mode Selection"
      >
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="text-[10px] uppercase font-bold text-[#00D1FF] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Map Mode</span>
          </span>
          <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#1E293B] text-slate-300 font-bold">
            {basemapType === 'satellite' ? 'Satellite' : 'Dark OSM'}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#0D1219] p-1 rounded border border-[#1E293B]">
          <button
            type="button"
            id="btn-map-mode-dark-osm"
            onClick={() => {
              setBasemapType('dark');
              showToast('Switched Map Mode: Dark OSM');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
              basemapType === 'dark'
                ? 'bg-[#00D1FF] text-black shadow-[0_0_12px_rgba(0,209,255,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-[#1E293B]'
            }`}
            title="Switch to Dark OSM (OpenStreetMap standard tiles with GIS dark styling)"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Dark OSM</span>
          </button>

          <button
            type="button"
            id="btn-map-mode-satellite-view"
            onClick={() => {
              setBasemapType('satellite');
              showToast('Switched Map Mode: Satellite View (Esri World Imagery)');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
              basemapType === 'satellite'
                ? 'bg-emerald-400 text-black shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-[#1E293B]'
            }`}
            title="Switch to Satellite View (Free high-resolution Esri World Imagery)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Satellite View</span>
          </button>
        </div>
      </div>

      {/* Map Legend Overlay */}
      {!hideCardOverlay && (
        <div className="absolute bottom-4 left-4 z-[999] bg-[#0A0E14]/90 backdrop-blur-md border border-[#1E293B] p-2.5 rounded shadow-xl text-xs font-mono max-w-xs pointer-events-auto hidden sm:block">
          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Radar & GIS Legend</span>
            <span className="text-[9px] text-[#00D1FF]">{activePhenomenon.toUpperCase()}</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[9px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-fuchsia-600 inline-block" />
              <span className="text-slate-300">Precip &gt;60 dBZ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-teal-400 inline-block" />
              <span className="text-slate-300">Wind Vectors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-amber-400 inline-block" />
              <span className="text-slate-300">Thunder Risk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-cyan-400 inline-block" />
              <span className="text-slate-300">Radar Range Rings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-red-500 inline-block" />
              <span className="text-slate-300">Severe Inundation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-yellow-400 inline-block" />
              <span className="text-slate-300">Lightning Strikes</span>
            </div>
          </div>

          {/* Quick Basemap Switcher inside Legend */}
          <div className="mt-2 pt-1.5 border-t border-[#1E293B] flex items-center justify-between">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Map Mode:</span>
            <div className="flex items-center bg-[#0D1219] p-0.5 rounded border border-[#1E293B]">
              <button
                type="button"
                onClick={() => setBasemapType('dark')}
                className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${
                  basemapType === 'dark'
                    ? 'bg-[#00D1FF] text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dark OSM
              </button>
              <button
                type="button"
                onClick={() => setBasemapType('satellite')}
                className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${
                  basemapType === 'satellite'
                    ? 'bg-emerald-400 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Satellite View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
