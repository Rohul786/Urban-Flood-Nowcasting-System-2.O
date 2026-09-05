import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  RiskLevel, 
  CalculatedZoneRisk, 
  SimulationParams, 
  NowcastTimelineStep, 
  MapLayerVisibility, 
  EarlyWarningAlert, 
  RoadSegment, 
  DrainageSegment, 
  InfrastructureFacility,
  ClimatePhenomenon,
  LightningStrike,
  ClimateTelemetry,
  BasemapType
} from '../types';
import { KOLKATA_LOCATIONS } from '../data/locations';
import { KOLKATA_ROADS } from '../data/roads';
import { KOLKATA_DRAINAGE_NETWORKS } from '../data/drainage';
import { KOLKATA_INFRASTRUCTURE } from '../data/infrastructure';
import { INITIAL_LIGHTNING_STRIKES, getClimateTelemetryForLocation } from '../data/climateData';
import { calculateZoneRisk } from '../services/floodRiskEngine';
import { calculateRoutes, ROUTE_PRESETS } from '../services/routingEngine';
import confetti from 'canvas-confetti';

export type AppView = 
  | 'landing'
  | 'command-center'
  | 'live-map'
  | 'nowcast'
  | 'risk-analysis'
  | 'safe-routes'
  | 'alerts'
  | 'infrastructure'
  | 'analytics'
  | 'simulation-lab'
  | 'system-status';

interface FloodContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  simulationParams: SimulationParams;
  setSimulationParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  applyPreset: (presetName: SimulationParams['presetName']) => void;
  runSimulationTrigger: (customParams?: Partial<SimulationParams>) => void;
  isAnalyzing: boolean;
  nowcastStep: NowcastTimelineStep;
  setNowcastStep: (step: NowcastTimelineStep) => void;
  isPlayingNowcast: boolean;
  setIsPlayingNowcast: React.Dispatch<React.SetStateAction<boolean>>;
  emergencyMode: boolean;
  setEmergencyMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleEmergencyMode: () => void;
  sihDemoStep: number; // 0 to 10; 0 is inactive
  startSIHDemo: () => void;
  nextSIHDemoStep: () => void;
  prevSIHDemoStep: () => void;
  stopSIHDemo: () => void;
  selectedZoneId: string | null;
  setSelectedZoneId: (id: string | null) => void;
  selectedFacilityId: string | null;
  setSelectedFacilityId: (id: string | null) => void;
  selectedRoadId: string | null;
  setSelectedRoadId: (id: string | null) => void;
  mapLayers: MapLayerVisibility;
  toggleMapLayer: (layerKey: keyof MapLayerVisibility) => void;
  basemapType: BasemapType;
  setBasemapType: (type: BasemapType) => void;
  alerts: EarlyWarningAlert[];
  acknowledgeAlert: (id: string) => void;
  sendCitizenAlert: (id: string) => void;
  shareAlert: (alert: EarlyWarningAlert) => void;
  selectedRoutePreset: string;
  setSelectedRoutePreset: (presetId: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Geolocation & Climatic Phenomenon additions
  userCoordinates: [number, number] | null;
  userLocationName: string | null;
  isLocating: boolean;
  requestUserLocation: () => void;
  inspectedCoordinates: [number, number];
  inspectedLocationName: string;
  setInspectedLocation: (coords: [number, number], name: string) => void;
  activePhenomenon: ClimatePhenomenon;
  setActivePhenomenon: (p: ClimatePhenomenon) => void;
  lightningStrikes: LightningStrike[];
  climateTelemetry: ClimateTelemetry;
  // Computed datasets
  calculatedZones: CalculatedZoneRisk[];
  currentSelectedZone: CalculatedZoneRisk | null;
  roads: RoadSegment[];
  drainageNetworks: DrainageSegment[];
  infrastructure: InfrastructureFacility[];
  kpis: {
    currentRainfall: number;
    cityFloodRisk: RiskLevel;
    highRiskZonesCount: number;
    affectedRoadsCount: number;
    activeAlertsCount: number;
    populationAtRisk: number;
  };
  routes: ReturnType<typeof calculateRoutes>;
}

const FloodContext = createContext<FloodContextType | undefined>(undefined);

export const FloodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('live-map');
  const [simulationParams, setSimulationParams] = useState<SimulationParams>({
    rainfall: 72, // mm/hr default as requested in KPI: CURRENT RAINFALL 72 mm/hr
    drainageEfficiency: 68,
    drainBlockage: 42,
    soilSaturation: 75,
    presetName: 'HEAVY_RAIN',
  });
  const [nowcastStep, setNowcastStep] = useState<NowcastTimelineStep>(0);
  const [isPlayingNowcast, setIsPlayingNowcast] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sihDemoStep, setSihDemoStep] = useState(0); // 0 = inactive, 1-10 = active steps
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>('zone-brahmaputra-guwahati');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);
  const [selectedRoutePreset, setSelectedRoutePreset] = useState<string>('howrah-to-saltlake');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User Geolocation & Inspected Location States
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);
  const [userLocationName, setUserLocationName] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [inspectedCoordinates, setInspectedCoordinates] = useState<[number, number]>([22.8000, 80.0000]);
  const [inspectedLocationName, setInspectedLocationName] = useState<string>('India Nationwide Surveillance');

  // Climate Phenomena Active View ('all', 'rain', 'wind', 'thunder', 'temp', 'pressure', 'flood')
  const [activePhenomenon, setActivePhenomenon] = useState<ClimatePhenomenon>('all');
  const [lightningStrikes, setLightningStrikes] = useState<LightningStrike[]>(INITIAL_LIGHTNING_STRIKES);

  // Map layer controls
  const [basemapType, setBasemapType] = useState<BasemapType>('dark');
  const [mapLayers, setMapLayers] = useState<MapLayerVisibility>({
    weatherRadar: true,
    rainfall: true,
    windVectors: true,
    thunderZones: true,
    lightningStrikes: true,
    temperatureHeatmap: true,
    pressureIsobars: true,
    cloudCover: false,
    floodRisk: true,
    drainageNetwork: true,
    roadNetwork: true,
    waterlogging: true,
    elevation: false,
    hospitals: true,
    policeStations: true,
    fireStations: true,
    emergencyShelters: true,
    schools: false,
    powerStations: true,
  });

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 3500);
  }, []);

  const toggleMapLayer = (layerKey: keyof MapLayerVisibility) => {
    setMapLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  const toggleEmergencyMode = () => {
    setEmergencyMode(prev => {
      const next = !prev;
      showToast(next ? '🚨 EMERGENCY MODE ACTIVATED: Prioritizing critical facilities & evacuation' : 'Emergency Mode Standby');
      return next;
    });
  };

  // Geolocation Request Action
  const requestUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    showToast('🛰️ Requesting live GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserCoordinates(coords);
        setUserLocationName('Your Live Position');
        setInspectedCoordinates(coords);
        setInspectedLocationName('Your Live Position');
        setIsLocating(false);
        showToast(`📍 Centered on your location: [${coords[0].toFixed(4)}°, ${coords[1].toFixed(4)}°]`);
      },
      (err) => {
        console.warn('Geolocation failed or permission denied:', err.message);
        setIsLocating(false);
        showToast('📍 Live GPS inactive. Centered on Kolkata Metropolitan Center.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, [showToast]);

  // Request user location on initial mount
  useEffect(() => {
    requestUserLocation();
  }, [requestUserLocation]);

  // Periodic convective lightning strike generation
  useEffect(() => {
    const interval = setInterval(() => {
      const randomOffsetLat = (Math.random() - 0.5) * 0.12;
      const randomOffsetLng = (Math.random() - 0.5) * 0.12;
      const newStrike: LightningStrike = {
        id: `strike-${Date.now()}`,
        lat: inspectedCoordinates[0] + randomOffsetLat,
        lng: inspectedCoordinates[1] + randomOffsetLng,
        intensityKa: -Math.round(45 + Math.random() * 105),
        timestamp: 'Just now',
        locationName: inspectedLocationName
      };
      setLightningStrikes(prev => [newStrike, ...prev.slice(0, 8)]);
    }, 8500);
    return () => clearInterval(interval);
  }, [inspectedCoordinates, inspectedLocationName]);

  const setInspectedLocation = useCallback((coords: [number, number], name: string) => {
    setInspectedCoordinates(coords);
    setInspectedLocationName(name);
    showToast(`Inspecting climate conditions for: ${name}`);
  }, [showToast]);

  const climateTelemetry = useMemo(() => {
    return getClimateTelemetryForLocation(
      inspectedCoordinates[0],
      inspectedCoordinates[1],
      inspectedLocationName,
      simulationParams.rainfall
    );
  }, [inspectedCoordinates, inspectedLocationName, simulationParams.rainfall]);

  // Preset applicator
  const applyPreset = (presetName: SimulationParams['presetName']) => {
    let params: SimulationParams;
    switch (presetName) {
      case 'NORMAL':
        params = { rainfall: 22, drainageEfficiency: 92, drainBlockage: 10, soilSaturation: 35, presetName: 'NORMAL' };
        break;
      case 'HEAVY_RAIN':
        params = { rainfall: 72, drainageEfficiency: 68, drainBlockage: 42, soilSaturation: 75, presetName: 'HEAVY_RAIN' };
        break;
      case 'EXTREME_RAIN':
        params = { rainfall: 105, drainageEfficiency: 48, drainBlockage: 65, soilSaturation: 88, presetName: 'EXTREME_RAIN' };
        break;
      case 'CLOUDBURST':
        params = { rainfall: 145, drainageEfficiency: 28, drainBlockage: 85, soilSaturation: 98, presetName: 'CLOUDBURST' };
        break;
      default:
        params = { ...simulationParams, presetName: 'CUSTOM' };
    }
    setSimulationParams(params);
    showToast(`Simulation preset applied: ${presetName.replace('_', ' ')} (${params.rainfall} mm/hr)`);
  };

  // Run simulation with AI analyzing animation
  const runSimulationTrigger = (customParams?: Partial<SimulationParams>) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      if (customParams) {
        setSimulationParams(prev => ({ ...prev, ...customParams, presetName: 'CUSTOM' }));
      }
      setIsAnalyzing(false);
      showToast('AI Model updated flood nowcast predictions across all micro-catchments.');
    }, 850);
  };

  // Auto-play nowcast timeline loop
  useEffect(() => {
    if (!isPlayingNowcast) return;
    const interval = setInterval(() => {
      setNowcastStep(prev => ((prev + 1) % 4) as NowcastTimelineStep);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlayingNowcast]);

  // Compute zone risks based on simulation and timeline step
  const calculatedZones: CalculatedZoneRisk[] = useMemo(() => {
    return KOLKATA_LOCATIONS.map(zone => calculateZoneRisk(zone, simulationParams, nowcastStep));
  }, [simulationParams, nowcastStep]);

  const currentSelectedZone = useMemo(() => {
    return calculatedZones.find(z => z.zoneId === selectedZoneId) || calculatedZones[0] || null;
  }, [calculatedZones, selectedZoneId]);

  // Dynamic roads based on zone risk
  const roads: RoadSegment[] = useMemo(() => {
    return KOLKATA_ROADS.map(road => {
      const parentZone = calculatedZones.find(z => z.zoneId === road.zoneId);
      if (!parentZone) return road;
      
      const depth = Math.round((road.waterDepth * (parentZone.waterDepth / 0.35)) * 100) / 100;
      let status: RoadSegment['status'] = 'SAFE';
      let action: RoadSegment['action'] = 'PROCEED_NORMAL';

      if (depth > 0.40) {
        status = 'BLOCKED';
        action = 'ROAD_CLOSED';
      } else if (depth > 0.28) {
        status = 'HIGH_RISK';
        action = 'AVOID';
      } else if (depth > 0.12) {
        status = 'CAUTION';
        action = 'SPEED_RESTRICTION';
      }

      return {
        ...road,
        waterDepth: depth,
        floodProbability: Math.min(99, Math.round(parentZone.floodProbability * (road.baseElevation < 6 ? 1.05 : 0.8))),
        status,
        action
      };
    });
  }, [calculatedZones]);

  // Dynamic drainage network
  const drainageNetworks: DrainageSegment[] = useMemo(() => {
    return KOLKATA_DRAINAGE_NETWORKS.map(drain => {
      const load = Math.min(
        drain.baseCapacity * 1.3,
        Math.round(drain.currentLoad * (simulationParams.rainfall / 65) * (1 + simulationParams.drainBlockage / 120))
      );
      const util = Math.min(100, Math.round((load / drain.baseCapacity) * 100));
      let status: DrainageSegment['status'] = 'NORMAL';
      if (util > 95 || simulationParams.drainBlockage > 70) {
        status = 'BLOCKED';
      } else if (util > 88) {
        status = 'CRITICAL';
      } else if (util > 72) {
        status = 'STRESSED';
      }
      return {
        ...drain,
        currentLoad: load,
        utilization: util,
        status,
        blockageProbability: Math.min(98, Math.round(drain.blockageProbability * (1 + simulationParams.drainBlockage / 150)))
      };
    });
  }, [simulationParams]);

  // Infrastructure with dynamic risk
  const infrastructure: InfrastructureFacility[] = useMemo(() => {
    return KOLKATA_INFRASTRUCTURE.map(fac => {
      // Find closest zone
      let closestZone = calculatedZones[0];
      let minDist = 999999;
      calculatedZones.forEach(z => {
        const d = Math.hypot(z.lat - fac.lat, z.lng - fac.lng);
        if (d < minDist) {
          minDist = d;
          closestZone = z;
        }
      });

      let floodRisk = closestZone.riskLevel;
      let depth = closestZone.waterDepth * 0.7;
      let accessibility: InfrastructureFacility['accessibility'] = 'ACCESSIBLE';

      if (floodRisk === 'SEVERE') {
        if (fac.type === 'hospital' || fac.type === 'police' || fac.type === 'power_station') {
          accessibility = 'HIGH_RISK';
        } else {
          accessibility = 'CUT_OFF';
        }
      } else if (floodRisk === 'HIGH') {
        accessibility = 'PARTIALLY_IMPAIRED';
      }

      return {
        ...fac,
        floodRisk,
        waterDepth: Math.round(depth * 100) / 100,
        accessibility
      };
    });
  }, [calculatedZones]);

  // Dynamic alerts
  const [acknowledgedAlertIds, setAcknowledgedAlertIds] = useState<Record<string, boolean>>({});

  const alerts: EarlyWarningAlert[] = useMemo(() => {
    const list: EarlyWarningAlert[] = [];
    calculatedZones.forEach(zone => {
      if (zone.riskLevel === 'SEVERE' || zone.riskLevel === 'HIGH' || zone.riskLevel === 'MODERATE') {
        const sev = zone.riskLevel === 'SEVERE' 
          ? (emergencyMode ? 'EMERGENCY' : 'SEVERE') 
          : zone.riskLevel === 'HIGH' 
            ? 'WARNING' 
            : 'WATCH';

        list.push({
          id: `alert-${zone.zoneId}`,
          title: `${zone.riskLevel} FLOOD WARNING`,
          locationName: zone.name,
          zoneId: zone.zoneId,
          severity: sev,
          issuedAt: 'Just now (Coupled Hydrodynamic Feed)',
          expectedTime: zone.expectedFloodingTime,
          probability: zone.floodProbability,
          waterDepth: zone.waterDepth,
          reason: `Heavy rainfall (${zone.rainfall} mm/hr) + overloaded drainage (${zone.drainageStress}% stress) + low ground elevation (${zone.elevation}m ASL).`,
          recommendedAction: zone.recommendedAction,
          acknowledged: !!acknowledgedAlertIds[`alert-${zone.zoneId}`],
          coordinates: [zone.lat, zone.lng]
        });
      }
    });
    return list;
  }, [calculatedZones, emergencyMode, acknowledgedAlertIds]);

  const acknowledgeAlert = (id: string) => {
    setAcknowledgedAlertIds(prev => ({ ...prev, [id]: true }));
    showToast('Alert status updated: ACKNOWLEDGED by Emergency Controller.');
  };

  const sendCitizenAlert = (id: string) => {
    const alert = alerts.find(a => a.id === id);
    const loc = alert ? alert.locationName : 'Affected Sector';
    showToast(`🚨 CITIZEN ALERT DISPATCHED: Cell broadcast SMS sent to all residents in ${loc}.`);
  };

  const shareAlert = (alert: EarlyWarningAlert) => {
    const text = `🚨 [FLOODGUARD AI WARNING - MoES NCMRWF SIH26085]\nLocation: ${alert.locationName}\nSeverity: ${alert.severity}\nProbability: ${alert.probability}%\nWater Depth: ${alert.waterDepth}m\nExpected: ${alert.expectedTime}\nAction: ${alert.recommendedAction}`;
    navigator.clipboard?.writeText(text);
    showToast(`Emergency alert copied to clipboard for CAP/NDMA broadcast: ${alert.locationName}`);
  };

  // KPIs
  const kpis = useMemo(() => {
    const highRiskZones = calculatedZones.filter(z => z.riskLevel === 'HIGH' || z.riskLevel === 'SEVERE');
    const affectedRoads = roads.filter(r => r.status === 'HIGH_RISK' || r.status === 'BLOCKED');
    const totalPop = highRiskZones.reduce((sum, z) => sum + z.affectedPopulation, 0);

    let cityRisk: RiskLevel = 'LOW';
    if (highRiskZones.some(z => z.riskLevel === 'SEVERE') || highRiskZones.length >= 4) {
      cityRisk = 'SEVERE';
    } else if (highRiskZones.length >= 2) {
      cityRisk = 'HIGH';
    } else if (calculatedZones.some(z => z.riskLevel === 'MODERATE')) {
      cityRisk = 'MODERATE';
    }

    // Effective rainfall matching requested KPI:
    const effectiveRain = calculatedZones[0] ? calculatedZones[0].rainfall : simulationParams.rainfall;

    return {
      currentRainfall: effectiveRain,
      cityFloodRisk: cityRisk,
      highRiskZonesCount: highRiskZones.length,
      affectedRoadsCount: affectedRoads.length,
      activeAlertsCount: alerts.filter(a => !a.acknowledged).length,
      populationAtRisk: totalPop > 0 ? totalPop : 12450 // fallback realistic base
    };
  }, [calculatedZones, roads, alerts, simulationParams]);

  // Safe Routes
  const routes = useMemo(() => {
    return calculateRoutes(selectedRoutePreset, roads, kpis.cityFloodRisk === 'SEVERE');
  }, [selectedRoutePreset, roads, kpis.cityFloodRisk]);

  // SIH 2026 Scripted 10-Step Automated Demo sequence
  const startSIHDemo = () => {
    setCurrentView('command-center');
    setSihDemoStep(1);
    applyPreset('NORMAL');
    setNowcastStep(0);
    setEmergencyMode(false);
    showToast('Starting SIH 2026 Demo: STEP 1 - Normal City Baseline');
  };

  const stopSIHDemo = () => {
    setSihDemoStep(0);
    showToast('SIH Demo Completed.');
  };

  const executeDemoStep = (step: number) => {
    setSihDemoStep(step);
    switch (step) {
      case 1:
        // Normal city conditions
        applyPreset('NORMAL');
        setNowcastStep(0);
        setEmergencyMode(false);
        break;
      case 2:
        // Rainfall increases
        setSimulationParams(prev => ({ ...prev, rainfall: 65, presetName: 'CUSTOM' }));
        showToast('STEP 2: Monsoonal squall begins — Rainfall rises to 65 mm/hr');
        break;
      case 3:
        // Drainage stress increases
        setSimulationParams(prev => ({ ...prev, drainageEfficiency: 50, drainBlockage: 55, presetName: 'CUSTOM' }));
        showToast('STEP 3: Drainage canals hit hydraulic bottlenecks');
        break;
      case 4:
        // AI detects rising flood probability
        setNowcastStep(1);
        setSelectedZoneId('zone-ultadanga');
        showToast('STEP 4: AI Nowcast engine predicts +1H waterlogging crest');
        break;
      case 5:
        // Map changes GREEN -> YELLOW -> ORANGE -> RED
        setSimulationParams({
          rainfall: 110,
          drainageEfficiency: 35,
          drainBlockage: 75,
          soilSaturation: 90,
          presetName: 'EXTREME_RAIN'
        });
        setNowcastStep(2);
        showToast('STEP 5: Extreme storm surge — Zones transition from Green to Severe Red');
        break;
      case 6:
        // Roads become unsafe
        setCurrentView('live-map');
        setMapLayers(prev => ({ ...prev, roadNetwork: true }));
        showToast('STEP 6: VIP Road & College Street inundated; flagged BLOCKED');
        break;
      case 7:
        // Early warning generated
        setCurrentView('alerts');
        showToast('STEP 7: Automated CAP-format Severe Flood Warnings triggered');
        break;
      case 8:
        // Safe route recommended
        setCurrentView('safe-routes');
        setSelectedRoutePreset('howrah-to-saltlake');
        showToast('STEP 8: Dynamic AI Routing bypasses flooded underpasses (+6m, -82% exposure)');
        break;
      case 9:
        // Critical infrastructure highlighted
        setCurrentView('infrastructure');
        showToast('STEP 9: Triage checks on SSKM Hospital & Emergency Shelters');
        break;
      case 10:
        // Emergency Mode activates
        setCurrentView('command-center');
        setEmergencyMode(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        showToast('STEP 10: 🚨 FULL EMERGENCY OPERATIONS CENTER ACTIVATED!');
        break;
      default:
        break;
    }
  };

  const nextSIHDemoStep = () => {
    if (sihDemoStep < 10) {
      executeDemoStep(sihDemoStep + 1);
    } else {
      stopSIHDemo();
    }
  };

  const prevSIHDemoStep = () => {
    if (sihDemoStep > 1) {
      executeDemoStep(sihDemoStep - 1);
    }
  };

  return (
    <FloodContext.Provider
      value={{
        currentView,
        setCurrentView,
        simulationParams,
        setSimulationParams,
        applyPreset,
        runSimulationTrigger,
        isAnalyzing,
        nowcastStep,
        setNowcastStep,
        isPlayingNowcast,
        setIsPlayingNowcast,
        emergencyMode,
        setEmergencyMode,
        toggleEmergencyMode,
        sihDemoStep,
        startSIHDemo,
        nextSIHDemoStep,
        prevSIHDemoStep,
        stopSIHDemo,
        selectedZoneId,
        setSelectedZoneId,
        selectedFacilityId,
        setSelectedFacilityId,
        selectedRoadId,
        setSelectedRoadId,
        mapLayers,
        toggleMapLayer,
        basemapType,
        setBasemapType,
        alerts,
        acknowledgeAlert,
        sendCitizenAlert,
        shareAlert,
        selectedRoutePreset,
        setSelectedRoutePreset,
        isSearchOpen,
        setIsSearchOpen,
        toastMessage,
        showToast,
        userCoordinates,
        userLocationName,
        isLocating,
        requestUserLocation,
        inspectedCoordinates,
        inspectedLocationName,
        setInspectedLocation,
        activePhenomenon,
        setActivePhenomenon,
        lightningStrikes,
        climateTelemetry,
        calculatedZones,
        currentSelectedZone,
        roads,
        drainageNetworks,
        infrastructure,
        kpis,
        routes,
      }}
    >
      {children}
    </FloodContext.Provider>
  );
};

export const useFlood = () => {
  const context = useContext(FloodContext);
  if (!context) {
    throw new Error('useFlood must be used within a FloodProvider');
  }
  return context;
};
