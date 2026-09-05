export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';

export type DrainageStatus = 'NORMAL' | 'STRESSED' | 'CRITICAL' | 'BLOCKED';

export type RoadStatus = 'SAFE' | 'CAUTION' | 'HIGH_RISK' | 'BLOCKED';

export type AlertSeverity = 'INFORMATION' | 'WATCH' | 'WARNING' | 'SEVERE' | 'EMERGENCY' | 'HIGH' | 'MODERATE' | 'ADVISORY';

export type TidalLevel = 'LOW' | 'NORMAL' | 'HIGH';

export type SoilSaturation = 'DRY' | 'NORMAL' | 'SATURATED';

export type NowcastStep = number;

export type InfrastructureType = 
  | 'hospital'
  | 'school'
  | 'police'
  | 'fire_station'
  | 'shelter'
  | 'power_station';

export interface LocationZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // meters for visualization
  elevation: number; // meters above sea level
  slope: number; // degrees
  imperviousSurface: number; // percentage 0-100
  historicalWaterlogging: number; // score 0-100
  drainageCapacity: number; // m3/min
  drainageStressBase: number; // percentage 0-100
  soilSaturationBase: number; // percentage 0-100
  distanceToCanal: number; // meters
  population: number;
  description: string;
  state?: string;
  region?: string;
  riverBasin?: string;
}

export interface CalculatedZoneRisk {
  zoneId: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  rainfall: number; // mm/hr
  forecastRainfall: number; // mm/hr
  elevation: number;
  drainageCapacity: number;
  drainageStress: number;
  waterDepth: number; // in meters (e.g. 0.48 m)
  floodProbability: number; // 0-100%
  riskLevel: RiskLevel;
  expectedFloodingTime: string; // e.g. "35–50 minutes"
  recommendedAction: string;
  confidence: number;
  state?: string;
  region?: string;
  riverBasin?: string;
  contributions: {
    rainfall: number;
    drainageStress: number;
    elevation: number;
    historical: number;
    impervious: number;
    soilSaturation: number;
    other: number;
  };
  explanation: string;
  affectedPopulation: number;
}

export interface DrainageSegment {
  id: string;
  name: string;
  coordinates: [number, number][]; // path of canal/drain
  baseCapacity: number; // m3/min
  currentLoad: number; // m3/min
  utilization: number; // percentage
  blockageProbability: number; // percentage
  status: DrainageStatus;
  outfall: string;
}

export interface RoadSegment {
  id: string;
  name: string;
  coordinates: [number, number][];
  lengthKm: number;
  baseElevation: number;
  waterDepth: number;
  floodProbability: number;
  status: RoadStatus;
  action: 'PROCEED_NORMAL' | 'CAUTION' | 'SPEED_RESTRICTION' | 'AVOID' | 'ROAD_CLOSED';
  drainageId: string;
  zoneId: string;
}

export interface InfrastructureFacility {
  id: string;
  name: string;
  type: InfrastructureType;
  lat: number;
  lng: number;
  address: string;
  capacity: string;
  floodRisk: RiskLevel;
  waterDepth: number;
  accessibility: 'ACCESSIBLE' | 'PARTIALLY_IMPAIRED' | 'HIGH_RISK' | 'CUT_OFF';
  emergencyAccess: string;
  distanceFromSevereZone: string;
  phone: string;
}

export interface EarlyWarningAlert {
  id: string;
  title: string;
  headline?: string;
  locationName: string;
  zoneId: string;
  severity: AlertSeverity;
  issuedAt: string;
  timestamp?: string;
  expectedTime: string;
  probability: number;
  waterDepth: number;
  reason: string;
  recommendedAction: string;
  affectedPopulation?: number;
  acknowledged: boolean;
  coordinates: [number, number];
}

export type FloodAlert = EarlyWarningAlert & {
  headline: string;
  affectedPopulation: number;
  timestamp: string;
};

export interface SafeRouteOption {
  type: 'FASTEST' | 'FLOOD_SAFE';
  name: string;
  durationMinutes: number;
  distanceKm: number;
  floodZonesCrossed: number;
  maxWaterDepth: number;
  averageRisk: RiskLevel;
  path: [number, number][];
  instructions: string[];
  recommendationNote: string;
}

export interface SimulationParams {
  rainfall: number; // 0 - 150 mm/hr
  rainfallIntensity?: number; // alias
  durationMinutes?: number; // minutes 30 - 180
  drainageEfficiency: number; // 0 - 100%
  drainBlockage: number; // 0 - 100%
  drainageBlockagePercent?: number; // alias
  tidalLevel?: TidalLevel;
  soilSaturation: number | SoilSaturation;
  presetName: 'NORMAL' | 'HEAVY_RAIN' | 'EXTREME_RAIN' | 'CLOUDBURST' | 'CUSTOM';
}

export type NowcastTimelineStep = number; // 0 (now), 0.5 (+30m), 1 (+1h), 1.5 (+90m), 2 (+2h), 3 (+3h)

export type BasemapType = 'dark' | 'satellite';

export type ClimatePhenomenon = 
  | 'all'
  | 'rain'
  | 'wind'
  | 'thunder'
  | 'temp'
  | 'pressure'
  | 'flood';

export interface LightningStrike {
  id: string;
  lat: number;
  lng: number;
  intensityKa: number;
  timestamp: string;
  locationName: string;
}

export interface ClimateTelemetry {
  locationName: string;
  coordinates: [number, number];
  temperature: number; // °C
  feelsLike: number; // °C
  rainfallRate: number; // mm/hr
  windSpeed: number; // km/h
  windGust: number; // km/h
  windDirectionDeg: number; // deg
  windDirectionCompass: string; // e.g. "SW"
  thunderProbability: number; // %
  recentLightningCount: number;
  pressure: number; // hPa
  humidity: number; // %
  cloudCover: number; // %
  conditionText: string;
  severeWarning: string | null;
}

export interface ThunderZone {
  id: string;
  name: string;
  state: string;
  center: [number, number];
  radiusKm: number;
  probability: number; // e.g. 92%
  riskCategory: 'EXTREME' | 'HIGH' | 'MODERATE' | 'ELEVATED';
  capeJkg: number; // Convective Available Potential Energy (e.g. 2850 J/kg)
  cloudTopKm: number; // Cloud top height e.g. 15.2 km
  lightningStrikeRate: string; // e.g. "32 strikes/10min"
  convectiveWarning: string;
}

export interface MapLayerVisibility {
  weatherRadar: boolean;
  rainfall: boolean;
  windVectors: boolean;
  thunderZones: boolean;
  lightningStrikes: boolean;
  temperatureHeatmap: boolean;
  pressureIsobars: boolean;
  cloudCover: boolean;
  floodRisk: boolean;
  drainageNetwork: boolean;
  roadNetwork: boolean;
  waterlogging: boolean;
  elevation: boolean;
  hospitals: boolean;
  policeStations: boolean;
  fireStations: boolean;
  emergencyShelters: boolean;
  schools: boolean;
  powerStations: boolean;
}
