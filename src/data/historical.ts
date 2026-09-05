export interface RainfallVsRiskPoint {
  rainfall: number;
  floodProbability: number;
  waterDepth: number; // in meters
}

export interface MonthlyFloodEvent {
  month: string;
  historicalEvents: number;
  averageRainfallMm: number;
  waterloggingIncidents: number;
}

export interface FloodProneAreaStat {
  area: string;
  inundationDays: number;
  averageWaterDepthCm: number;
  drainageLagHours: number;
  riskScore: number;
}

export interface DrainageStressTrend {
  time: string;
  monikhaliCanal: number;
  circularCanal: number;
  bagjolaCanal: number;
  palmerBridge: number;
  kestopurCanal: number;
}

export const RAINFALL_VS_RISK_CURVE: RainfallVsRiskPoint[] = [
  { rainfall: 10, floodProbability: 8, waterDepth: 0.02 },
  { rainfall: 20, floodProbability: 15, waterDepth: 0.05 },
  { rainfall: 30, floodProbability: 24, waterDepth: 0.09 },
  { rainfall: 40, floodProbability: 38, waterDepth: 0.14 },
  { rainfall: 50, floodProbability: 52, waterDepth: 0.21 },
  { rainfall: 65, floodProbability: 68, waterDepth: 0.31 },
  { rainfall: 80, floodProbability: 82, waterDepth: 0.42 },
  { rainfall: 100, floodProbability: 92, waterDepth: 0.55 },
  { rainfall: 120, floodProbability: 96, waterDepth: 0.72 },
  { rainfall: 140, floodProbability: 99, waterDepth: 0.88 },
];

export const MONTHLY_FLOOD_EVENTS: MonthlyFloodEvent[] = [
  { month: 'Jan', historicalEvents: 0, averageRainfallMm: 12, waterloggingIncidents: 0 },
  { month: 'Feb', historicalEvents: 0, averageRainfallMm: 24, waterloggingIncidents: 1 },
  { month: 'Mar', historicalEvents: 1, averageRainfallMm: 35, waterloggingIncidents: 2 },
  { month: 'Apr', historicalEvents: 2, averageRainfallMm: 58, waterloggingIncidents: 4 },
  { month: 'May', historicalEvents: 5, averageRainfallMm: 142, waterloggingIncidents: 11 },
  { month: 'Jun', historicalEvents: 14, averageRainfallMm: 305, waterloggingIncidents: 38 },
  { month: 'Jul', historicalEvents: 26, averageRainfallMm: 396, waterloggingIncidents: 64 },
  { month: 'Aug', historicalEvents: 29, averageRainfallMm: 385, waterloggingIncidents: 72 },
  { month: 'Sep', historicalEvents: 21, averageRainfallMm: 310, waterloggingIncidents: 53 },
  { month: 'Oct', historicalEvents: 8, averageRainfallMm: 160, waterloggingIncidents: 18 },
  { month: 'Nov', historicalEvents: 1, averageRainfallMm: 22, waterloggingIncidents: 2 },
  { month: 'Dec', historicalEvents: 0, averageRainfallMm: 8, waterloggingIncidents: 0 },
];

export const MOST_FLOOD_PRONE_AREAS: FloodProneAreaStat[] = [
  { area: 'Guwahati - Bharalu Basin (Assam)', inundationDays: 32, averageWaterDepthCm: 58, drainageLagHours: 9.5, riskScore: 98 },
  { area: 'Mumbai - Kurla & Mithi Basin (Maharashtra)', inundationDays: 29, averageWaterDepthCm: 62, drainageLagHours: 8.8, riskScore: 97 },
  { area: 'Kuttanad Deltaic Basin (Kerala)', inundationDays: 36, averageWaterDepthCm: 68, drainageLagHours: 14.2, riskScore: 99 },
  { area: 'Patna - Rajendra Nagar (Bihar)', inundationDays: 26, averageWaterDepthCm: 54, drainageLagHours: 8.4, riskScore: 96 },
  { area: 'Chennai - Velachery Marsh (Tamil Nadu)', inundationDays: 24, averageWaterDepthCm: 55, drainageLagHours: 7.9, riskScore: 95 },
  { area: 'Kolkata - Behala Basin (West Bengal)', inundationDays: 28, averageWaterDepthCm: 56, drainageLagHours: 8.2, riskScore: 96 },
  { area: 'Delhi - Yamuna Bazar ISBT (Delhi)', inundationDays: 18, averageWaterDepthCm: 48, drainageLagHours: 6.2, riskScore: 92 },
  { area: 'Cuttack - Mahanadi Ring (Odisha)', inundationDays: 21, averageWaterDepthCm: 46, drainageLagHours: 6.8, riskScore: 93 },
  { area: 'Surat - Tapi Floodplain (Gujarat)', inundationDays: 16, averageWaterDepthCm: 44, drainageLagHours: 5.5, riskScore: 89 },
  { area: 'Srinagar - Jhelum Lowlands (J&K)', inundationDays: 14, averageWaterDepthCm: 50, drainageLagHours: 7.1, riskScore: 91 },
  { area: 'Kolkata - Ultadanga Underpass (West Bengal)', inundationDays: 24, averageWaterDepthCm: 52, drainageLagHours: 6.4, riskScore: 94 },
  { area: 'Bengaluru - Bellandur ORR (Karnataka)', inundationDays: 15, averageWaterDepthCm: 42, drainageLagHours: 4.8, riskScore: 88 },
];

export const DRAINAGE_STRESS_TIME_SERIES: DrainageStressTrend[] = [
  { time: 'T-3h', monikhaliCanal: 42, circularCanal: 38, bagjolaCanal: 35, palmerBridge: 40, kestopurCanal: 32 },
  { time: 'T-2h', monikhaliCanal: 56, circularCanal: 51, bagjolaCanal: 48, palmerBridge: 54, kestopurCanal: 44 },
  { time: 'T-1h', monikhaliCanal: 78, circularCanal: 72, bagjolaCanal: 69, palmerBridge: 76, kestopurCanal: 60 },
  { time: 'NOW', monikhaliCanal: 98, circularCanal: 91, bagjolaCanal: 92, palmerBridge: 93, kestopurCanal: 86 },
  { time: '+1h (Pred)', monikhaliCanal: 100, circularCanal: 96, bagjolaCanal: 95, palmerBridge: 97, kestopurCanal: 90 },
  { time: '+2h (Pred)', monikhaliCanal: 100, circularCanal: 98, bagjolaCanal: 97, palmerBridge: 98, kestopurCanal: 93 },
  { time: '+3h (Pred)', monikhaliCanal: 92, circularCanal: 88, bagjolaCanal: 89, palmerBridge: 89, kestopurCanal: 82 },
];

export const RISK_DISTRIBUTION_HISTORICAL = [
  { name: 'Low Risk (0-25%)', value: 42, color: '#10b981' },
  { name: 'Moderate Risk (26-50%)', value: 26, color: '#f59e0b' },
  { name: 'High Risk (51-75%)', value: 20, color: '#f97316' },
  { name: 'Severe Risk (76-100%)', value: 12, color: '#ef4444' },
];

export const TRADITIONAL_VS_FLOODGUARD = [
  {
    parameter: 'Early Warning Lead Time',
    traditional: '0.5 hours (Post-event response)',
    floodguard: '2.5 - 3.0 hours (Pre-emptive Nowcast)',
    improvement: '+400% time advantage'
  },
  {
    parameter: 'Spatial Prediction Resolution',
    traditional: 'District / Sub-division scale (10–25 km)',
    floodguard: 'Street & Ward micro-catchment (50–100 m)',
    improvement: 'Street-level precision'
  },
  {
    parameter: 'Model Coupling',
    traditional: 'Rainfall only (Meteorological focus)',
    floodguard: 'Coupled Hydrodynamic: Rainfall + Drainage + DEM + Soil',
    improvement: 'True Inundation Modeling'
  },
  {
    parameter: 'Dynamic Safe Routing',
    traditional: 'Static road advisories via radio/social media',
    floodguard: 'Real-time flood-weighted routing bypassing submerged links',
    improvement: '-82% flood exposure'
  },
  {
    parameter: 'Response Mobilization Time',
    traditional: '240 minutes average',
    floodguard: '45 minutes automated dispatch',
    improvement: '-81% operational delay'
  },
  {
    parameter: 'Critical Infrastructure Triage',
    traditional: 'Manual damage assessments post-flood',
    floodguard: 'Predictive accessibility scoring & asset protection',
    improvement: 'Continuous live status'
  }
];

export const HISTORICAL_EVENTS = [
  {
    year: '2021',
    eventName: 'Cyclone Yaas',
    peakRainfall: '142 mm/hr',
    duration: '18 hours',
    maxWaterDepth: '0.85 m',
    tideInfluence: 'Spring High Tide (4.8m)',
    affectedZones: 'Behala, Howrah, Ultadanga, Port Area',
  },
  {
    year: '2020',
    eventName: 'Cyclone Amphan',
    peakRainfall: '185 mm/hr',
    duration: '24 hours',
    maxWaterDepth: '1.20 m',
    tideInfluence: 'Tidal Surge (5.2m)',
    affectedZones: 'All 144 KMC Wards, Airport Runway submerged',
  },
  {
    year: '2015',
    eventName: 'Kolkata Heavy Floods',
    peakRainfall: '115 mm/hr',
    duration: '36 hours',
    maxWaterDepth: '0.72 m',
    tideInfluence: 'Continuous Monsoon Surcharge',
    affectedZones: 'Central Avenue, College Street, Dum Dum',
  },
  {
    year: '2007',
    eventName: 'Extreme Monsoon Surcharge',
    peakRainfall: '130 mm/hr',
    duration: '48 hours',
    maxWaterDepth: '0.90 m',
    tideInfluence: 'Canal Outfall Gates Silt Locked',
    affectedZones: 'Circular Canal basin, Behala Tram Depot',
  }
];

export const DRAINAGE_BOTTLENECKS = [
  { name: 'Circular Canal Outfall', riskScore: 94 },
  { name: 'Ultadanga Railway Siphon', riskScore: 89 },
  { name: 'Monikhali Lock Gates', riskScore: 85 },
  { name: 'Thanthania Sump Basin', riskScore: 82 },
  { name: 'Bagjola Canal Junction', riskScore: 78 },
  { name: 'Palmer Bridge Pumping Sump', riskScore: 74 },
];

export const ACCURACY_BENCHMARKS = [
  { metric: 'Critical Success Index (CSI)', conventional: 64, floodguard: 89 },
  { metric: 'Probability of Detection (POD)', conventional: 68, floodguard: 93 },
  { metric: 'False Alarm Ratio (FAR)', conventional: 42, floodguard: 14 },
  { metric: 'Spatial Inundation Accuracy', conventional: 58, floodguard: 88 },
];

export const FLOOD_RECURRENCE_DATA = [
  { year: '2018', events: 6, maxDepth: 0.45 },
  { year: '2019', events: 8, maxDepth: 0.58 },
  { year: '2020', events: 14, maxDepth: 1.20 },
  { year: '2021', events: 11, maxDepth: 0.85 },
  { year: '2022', events: 7, maxDepth: 0.52 },
  { year: '2023', events: 9, maxDepth: 0.62 },
  { year: '2024', events: 8, maxDepth: 0.55 },
  { year: '2025', events: 10, maxDepth: 0.68 },
];

export const PRESET_SCENARIOS = [
  {
    id: 'normal-monsoon',
    name: 'Normal Monsoon',
    description: 'Typical seasonal rain, normal drainage capacity, low tide.',
    presetKey: 'NORMAL' as const,
    params: {
      rainfall: 22,
      rainfallIntensity: 22,
      durationMinutes: 45,
      drainageEfficiency: 92,
      drainBlockage: 10,
      drainageBlockagePercent: 10,
      tidalLevel: 'NORMAL' as const,
      soilSaturation: 'NORMAL' as const,
      presetName: 'NORMAL' as const
    }
  },
  {
    id: 'cloudburst',
    name: 'Cloudburst',
    description: 'Intense localized convective downpour exceeding 100 mm/hr.',
    presetKey: 'CLOUDBURST' as const,
    params: {
      rainfall: 115,
      rainfallIntensity: 115,
      durationMinutes: 60,
      drainageEfficiency: 40,
      drainBlockage: 55,
      drainageBlockagePercent: 55,
      tidalLevel: 'HIGH' as const,
      soilSaturation: 'SATURATED' as const,
      presetName: 'CLOUDBURST' as const
    }
  },
  {
    id: 'canal-overflow',
    name: 'Canal Overflow',
    description: 'Circular and Monikhali canals overflow due to silt & high tide.',
    presetKey: 'EXTREME_RAIN' as const,
    params: {
      rainfall: 78,
      rainfallIntensity: 78,
      durationMinutes: 120,
      drainageEfficiency: 30,
      drainBlockage: 85,
      drainageBlockagePercent: 85,
      tidalLevel: 'HIGH' as const,
      soilSaturation: 'SATURATED' as const,
      presetName: 'EXTREME_RAIN' as const
    }
  },
  {
    id: 'cyclone-michaung',
    name: 'Cyclone Michaung Scenario',
    description: 'Heavy continuous rain bands coupled with spring high tide.',
    presetKey: 'EXTREME_RAIN' as const,
    params: {
      rainfall: 95,
      rainfallIntensity: 95,
      durationMinutes: 150,
      drainageEfficiency: 45,
      drainBlockage: 65,
      drainageBlockagePercent: 65,
      tidalLevel: 'HIGH' as const,
      soilSaturation: 'SATURATED' as const,
      presetName: 'EXTREME_RAIN' as const
    }
  },
  {
    id: 'extreme-disaster',
    name: 'Extreme Disaster Mode',
    description: 'Worst-case catastrophic cloudburst (145 mm/hr) & 90% blockage.',
    presetKey: 'CLOUDBURST' as const,
    params: {
      rainfall: 145,
      rainfallIntensity: 145,
      durationMinutes: 180,
      drainageEfficiency: 20,
      drainBlockage: 90,
      drainageBlockagePercent: 90,
      tidalLevel: 'HIGH' as const,
      soilSaturation: 'SATURATED' as const,
      presetName: 'CLOUDBURST' as const
    }
  }
];
