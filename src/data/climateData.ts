import { LightningStrike, ClimateTelemetry, ThunderZone } from '../types';

// Doppler Weather Radar (DWR) Stations across India
export interface DopplerRadarStation {
  id: string;
  name: string;
  stationCode: string;
  lat: number;
  lng: number;
  frequency: string;
  rangeKm: number;
  status: 'ACTIVE_TRANSMITTING' | 'CALIBRATING' | 'STANDBY';
}

export const DOPPLER_RADAR_STATIONS: DopplerRadarStation[] = [
  { id: 'dwr-kolkata', name: 'Kolkata IMD Doppler Station', stationCode: 'VECC-DWR', lat: 22.5726, lng: 88.3639, frequency: '2.8 GHz (S-Band)', rangeKm: 250, status: 'ACTIVE_TRANSMITTING' },
  { id: 'dwr-guwahati', name: 'Guwahati Regional Doppler Radar', stationCode: 'VEGT-DWR', lat: 26.1445, lng: 91.7362, frequency: '2.7 GHz (S-Band)', rangeKm: 250, status: 'ACTIVE_TRANSMITTING' },
  { id: 'dwr-mumbai', name: 'Mumbai Colaba Coastal Doppler', stationCode: 'VABB-DWR', lat: 18.9067, lng: 72.8147, frequency: '2.85 GHz (S-Band)', rangeKm: 250, status: 'ACTIVE_TRANSMITTING' },
  { id: 'dwr-delhi', name: 'Delhi Mausam Bhavan DWR', stationCode: 'VIDP-DWR', lat: 28.5898, lng: 77.2215, frequency: '2.8 GHz (S-Band)', rangeKm: 250, status: 'ACTIVE_TRANSMITTING' },
  { id: 'dwr-kochi', name: 'Kochi Thrikkakara Doppler', stationCode: 'VOCI-DWR', lat: 10.0270, lng: 76.3280, frequency: '5.6 GHz (C-Band)', rangeKm: 200, status: 'ACTIVE_TRANSMITTING' },
  { id: 'dwr-chennai', name: 'Chennai Port Cyclone Doppler', stationCode: 'VOMM-DWR', lat: 13.0827, lng: 80.2900, frequency: '2.8 GHz (S-Band)', rangeKm: 250, status: 'ACTIVE_TRANSMITTING' },
  { id: 'dwr-patna', name: 'Patna Gangetic Radar', stationCode: 'VEPT-DWR', lat: 25.5941, lng: 85.1376, frequency: '5.6 GHz (C-Band)', rangeKm: 200, status: 'ACTIVE_TRANSMITTING' },
  { id: 'dwr-cuttack', name: 'Paradip / Cuttack Doppler', stationCode: 'VEPO-DWR', lat: 20.3160, lng: 86.6110, frequency: '2.8 GHz (S-Band)', rangeKm: 250, status: 'ACTIVE_TRANSMITTING' }
];

// Thunder Probability Convective Instability Zones
export const THUNDER_PROBABILITY_ZONES: ThunderZone[] = [
  {
    id: 'tz-brahmaputra',
    name: 'Brahmaputra Valley Convective Cell',
    state: 'Assam',
    center: [26.1550, 91.7500],
    radiusKm: 48,
    probability: 94,
    riskCategory: 'EXTREME',
    capeJkg: 3120,
    cloudTopKm: 16.2,
    lightningStrikeRate: '42 strikes/10min',
    convectiveWarning: 'EXTREME SQUALL: Supercell updraft with severe cloud-to-ground lightning discharge.'
  },
  {
    id: 'tz-gangetic-bengal',
    name: 'Gangetic Bengal & Kolkata Inundation Core',
    state: 'West Bengal',
    center: [22.5820, 88.3750],
    radiusKm: 38,
    probability: 88,
    riskCategory: 'EXTREME',
    capeJkg: 2850,
    cloudTopKm: 15.1,
    lightningStrikeRate: '34 strikes/10min',
    convectiveWarning: 'SEVERE DOWNPOUR: Multi-cluster thunderstorm producing intense flash waterlogging.'
  },
  {
    id: 'tz-konkan-mumbai',
    name: 'Mumbai & Northern Konkan Convective Squall',
    state: 'Maharashtra',
    center: [19.0760, 72.8777],
    radiusKm: 42,
    probability: 82,
    riskCategory: 'HIGH',
    capeJkg: 2450,
    cloudTopKm: 14.4,
    lightningStrikeRate: '28 strikes/10min',
    convectiveWarning: 'COASTAL CONVECTIVE LINE: Heavy localized rainbursts with gust fronts reaching 65 km/h.'
  },
  {
    id: 'tz-kerala-periyar',
    name: 'Periyar Catchment & Kerala Coast',
    state: 'Kerala',
    center: [9.9312, 76.2673],
    radiusKm: 36,
    probability: 79,
    riskCategory: 'HIGH',
    capeJkg: 2340,
    cloudTopKm: 14.0,
    lightningStrikeRate: '22 strikes/10min',
    convectiveWarning: 'OROGRAPHIC THUNDERSTORM: Western Ghats ridge enhancement with frequent lightning.'
  },
  {
    id: 'tz-bihar-kosi',
    name: 'Patna & Kosi Basin Convergence',
    state: 'Bihar',
    center: [25.5941, 85.1376],
    radiusKm: 44,
    probability: 76,
    riskCategory: 'HIGH',
    capeJkg: 2180,
    cloudTopKm: 13.8,
    lightningStrikeRate: '20 strikes/10min',
    convectiveWarning: 'CONVERGENCE TROUGH: Elevated thunderstorm risk with strong downdrafts.'
  },
  {
    id: 'tz-odisha-mahanadi',
    name: 'Mahanadi Delta & Coastal Odisha',
    state: 'Odisha',
    center: [20.4625, 85.8828],
    radiusKm: 38,
    probability: 74,
    riskCategory: 'HIGH',
    capeJkg: 2050,
    cloudTopKm: 13.2,
    lightningStrikeRate: '18 strikes/10min',
    convectiveWarning: 'CYCLONIC FEEDER BAND: Intermittent lightning strikes and heavy rain showers.'
  },
  {
    id: 'tz-delhi-yamuna',
    name: 'Delhi NCR & Yamuna Catchment',
    state: 'Delhi',
    center: [28.6139, 77.2090],
    radiusKm: 40,
    probability: 65,
    riskCategory: 'MODERATE',
    capeJkg: 1850,
    cloudTopKm: 12.6,
    lightningStrikeRate: '14 strikes/10min',
    convectiveWarning: 'MONSOON AXIS SQUALL: Thunder showers with scattered lightning strikes.'
  },
  {
    id: 'tz-tamil-coromandel',
    name: 'Chennai & Coromandel Coastline',
    state: 'Tamil Nadu',
    center: [13.0827, 80.2707],
    radiusKm: 34,
    probability: 58,
    riskCategory: 'MODERATE',
    capeJkg: 1680,
    cloudTopKm: 11.8,
    lightningStrikeRate: '10 strikes/10min',
    convectiveWarning: 'MARITIME INFLOW: Moderately active convective thunder clouds over coastal waters.'
  }
];

// Predefined Quick-Select Locations across India
export interface QuickLocation {
  id: string;
  name: string;
  subtitle: string;
  lat: number;
  lng: number;
  region: 'All India' | 'North' | 'East' | 'Northeast' | 'West' | 'South';
  state: string;
  isLocalKolkata: boolean;
}

export const POPULAR_LOCATIONS: QuickLocation[] = [
  // National Metros & Major River Basin Hotspots
  { id: 'loc-delhi', name: 'Delhi NCR', subtitle: 'Yamuna River Basin & Capital Region', lat: 28.6139, lng: 77.2090, region: 'North', state: 'Delhi', isLocalKolkata: false },
  { id: 'loc-mumbai', name: 'Mumbai Coast', subtitle: 'Mithi River Basin / Arabian Sea', lat: 19.0760, lng: 72.8777, region: 'West', state: 'Maharashtra', isLocalKolkata: false },
  { id: 'loc-guwahati', name: 'Guwahati', subtitle: 'Brahmaputra Basin (Critical Monsoon Zone)', lat: 26.1445, lng: 91.7362, region: 'Northeast', state: 'Assam', isLocalKolkata: false },
  { id: 'loc-patna', name: 'Patna', subtitle: 'Ganga & Punpun Confluence Basin', lat: 25.5941, lng: 85.1376, region: 'East', state: 'Bihar', isLocalKolkata: false },
  { id: 'loc-chennai', name: 'Chennai', subtitle: 'Adyar, Cooum & Pallikaranai Basin', lat: 13.0827, lng: 80.2707, region: 'South', state: 'Tamil Nadu', isLocalKolkata: false },
  { id: 'loc-kochi', name: 'Kochi & Aluva', subtitle: 'Periyar River Basin / Arabian Coast', lat: 9.9312, lng: 76.2673, region: 'South', state: 'Kerala', isLocalKolkata: false },
  { id: 'loc-kolkata', name: 'Kolkata Metropolitan', subtitle: 'Hooghly & Circular Canal Basin', lat: 22.5726, lng: 88.3639, region: 'East', state: 'West Bengal', isLocalKolkata: true },
  { id: 'loc-bengaluru', name: 'Bengaluru', subtitle: 'Bellandur & Varthur Lake Catchments', lat: 12.9716, lng: 77.5946, region: 'South', state: 'Karnataka', isLocalKolkata: false },
  { id: 'loc-hyderabad', name: 'Hyderabad', subtitle: 'Musi River & Central Basin', lat: 17.3850, lng: 78.4867, region: 'South', state: 'Telangana', isLocalKolkata: false },
  { id: 'loc-cuttack', name: 'Cuttack', subtitle: 'Mahanadi Delta & Coastal Odisha', lat: 20.4625, lng: 85.8828, region: 'East', state: 'Odisha', isLocalKolkata: false },
  { id: 'loc-surat', name: 'Surat', subtitle: 'Tapi River Floodplain / Gulf of Khambhat', lat: 21.1702, lng: 72.8311, region: 'West', state: 'Gujarat', isLocalKolkata: false },
  { id: 'loc-srinagar', name: 'Srinagar', subtitle: 'Jhelum River & Valley Catchment', lat: 34.0837, lng: 74.7973, region: 'North', state: 'Jammu & Kashmir', isLocalKolkata: false },
  { id: 'loc-kuttanad', name: 'Kuttanad & Alappuzha', subtitle: 'Vembanad Delta (Below Sea Level)', lat: 9.4981, lng: 76.4382, region: 'South', state: 'Kerala', isLocalKolkata: false },
  { id: 'loc-kaziranga', name: 'Kaziranga Floodway', subtitle: 'Brahmaputra Floodplain (Annual Deluge)', lat: 26.5775, lng: 93.1711, region: 'Northeast', state: 'Assam', isLocalKolkata: false },
  { id: 'loc-sundarbans', name: 'Sundarbans Delta', subtitle: 'Tidal Mangrove & Saline Storm Surge', lat: 22.3160, lng: 88.6650, region: 'East', state: 'West Bengal', isLocalKolkata: true },
  { id: 'loc-darbhanga', name: 'Darbhanga & Kosi', subtitle: 'Kosi-Kamala Silt Basin ("Sorrow of Bihar")', lat: 26.1542, lng: 85.8918, region: 'East', state: 'Bihar', isLocalKolkata: false },
  { id: 'loc-chiplun', name: 'Chiplun (Konkan)', subtitle: 'Vashishti River Flash Flood Corridor', lat: 17.5323, lng: 73.5186, region: 'West', state: 'Maharashtra', isLocalKolkata: false },
  { id: 'loc-rishikesh', name: 'Rishikesh-Haridwar', subtitle: 'Upper Ganga Foothills Catchment', lat: 30.0869, lng: 78.2676, region: 'North', state: 'Uttarakhand', isLocalKolkata: false }
];

// Active Simulated Convective Lightning Strikes Across India
export const INITIAL_LIGHTNING_STRIKES: LightningStrike[] = [
  { id: 'strike-1', lat: 22.5820, lng: 88.3750, intensityKa: -84, timestamp: '12s ago', locationName: 'Kolkata - Circular Canal Sector' },
  { id: 'strike-2', lat: 26.1600, lng: 91.7500, intensityKa: -142, timestamp: '24s ago', locationName: 'Guwahati - Brahmaputra Riverfront' },
  { id: 'strike-3', lat: 19.0800, lng: 72.8900, intensityKa: -125, timestamp: '45s ago', locationName: 'Mumbai - Mithi River / Kurla' },
  { id: 'strike-4', lat: 25.6100, lng: 85.1500, intensityKa: -96, timestamp: '1m 15s ago', locationName: 'Patna - Ganga Floodplain' },
  { id: 'strike-5', lat: 13.0400, lng: 80.2400, intensityKa: -110, timestamp: '1m 50s ago', locationName: 'Chennai - Adyar River Corridor' },
  { id: 'strike-6', lat: 10.1200, lng: 76.3600, intensityKa: -88, timestamp: '2m 10s ago', locationName: 'Kochi - Periyar Basin' },
  { id: 'strike-7', lat: 28.6700, lng: 77.2400, intensityKa: -76, timestamp: '2m 45s ago', locationName: 'Delhi - Yamuna Floodplain' },
  { id: 'strike-8', lat: 20.4800, lng: 85.9000, intensityKa: -105, timestamp: '3m 20s ago', locationName: 'Cuttack - Mahanadi Delta' }
];

// Atmospheric Isobars Across the Subcontinent (Indian Monsoon Depression Troughs)
export interface IsobarRing {
  center: [number, number];
  radius: number; // in meters
  pressureHpa: number;
  label: string;
}

export const CYCLONIC_ISOBARS: IsobarRing[] = [
  // Bay of Bengal Deep Depression (Affecting East & Northeast)
  { center: [21.5000, 89.2000], radius: 65000, pressureHpa: 992, label: '992 hPa [Bay of Bengal Deep Depression]' },
  { center: [22.2000, 88.8000], radius: 140000, pressureHpa: 996, label: '996 hPa' },
  { center: [23.5000, 87.5000], radius: 260000, pressureHpa: 1000, label: '1000 hPa [Gangetic Trough]' },
  
  // Arabian Sea Offshore Monsoon Trough (Affecting West Coast & Kerala)
  { center: [18.2000, 71.8000], radius: 95000, pressureHpa: 994, label: '994 hPa [Arabian Sea Monsoon Vortex]' },
  { center: [16.5000, 72.5000], radius: 190000, pressureHpa: 998, label: '998 hPa [Konkan Offshore Low]' },
  
  // Himalayan Foothills / Assam Convective Trough
  { center: [26.8000, 92.5000], radius: 110000, pressureHpa: 996, label: '996 hPa [Brahmaputra Moisture Inflow]' }
];

// Wind Vector Grid for Streamlines & Velocity Arrows Spanning India
export interface WindVectorPoint {
  lat: number;
  lng: number;
  speedKmh: number;
  gustKmh: number;
  directionDeg: number; // 0 = N, 90 = E, 180 = S, 270 = W
}

export const GENERATE_WIND_GRID = (baseSpeed: number = 38, baseDir: number = 230): WindVectorPoint[] => {
  const points: WindVectorPoint[] = [];

  // Subcontinental grid sampling points across India
  // Lat: 8 to 32, Lng: 70 to 95
  const sampleRegions = [
    // West Coast & Arabian Sea (SW Monsoon onshore gales)
    { latStart: 9, latEnd: 22, lngStart: 71, lngEnd: 77, stepLat: 1.8, stepLng: 1.8, dir: 240, spd: 48 },
    // Gangetic Plains & Bay of Bengal (Curving ESE into NE)
    { latStart: 20, latEnd: 27, lngStart: 84, lngEnd: 92, stepLat: 1.5, stepLng: 1.5, dir: 215, spd: 42 },
    // Northeast / Assam (Channelled along Brahmaputra valley)
    { latStart: 24, latEnd: 28, lngStart: 90, lngEnd: 96, stepLat: 1.2, stepLng: 1.2, dir: 250, spd: 36 },
    // North India / Northern Plains (Monsoon Axis toward Delhi)
    { latStart: 27, latEnd: 31, lngStart: 75, lngEnd: 81, stepLat: 1.5, stepLng: 1.5, dir: 120, spd: 32 },
    // Peninsular South / Coromandel
    { latStart: 11, latEnd: 16, lngStart: 77, lngEnd: 82, stepLat: 1.8, stepLng: 1.8, dir: 260, spd: 38 }
  ];

  for (const reg of sampleRegions) {
    for (let lat = reg.latStart; lat <= reg.latEnd; lat += reg.stepLat) {
      for (let lng = reg.lngStart; lng <= reg.lngEnd; lng += reg.stepLng) {
        const localVariance = Math.sin(lat * 3 + lng * 2) * 6;
        const localSpeed = Math.round(reg.spd + localVariance);
        const localDir = Math.round((reg.dir + Math.sin(lat * 5) * 15 + 360) % 360);
        
        points.push({
          lat: Math.round(lat * 100) / 100,
          lng: Math.round(lng * 100) / 100,
          speedKmh: Math.max(16, localSpeed),
          gustKmh: Math.round(localSpeed * 1.5),
          directionDeg: localDir
        });
      }
    }
  }

  return points;
};

// Function to compute real-time climate telemetry at any coordinate in India
export function getClimateTelemetryForLocation(
  lat: number,
  lng: number,
  locationName: string = 'Target Location',
  simulatedRainfall: number = 72
): ClimateTelemetry {
  // Identify region based on coordinates
  const isSouth = lat < 16;
  const isWest = lng < 77 && lat >= 16 && lat < 24;
  const isNorth = lat >= 27;
  const isNortheast = lng >= 89 && lat >= 24;
  
  // Regional rainfall characteristics
  let regionalRainMult = 1.0;
  if (isNortheast) regionalRainMult = 1.45; // Cherrapunji / Brahmaputra high precipitation
  else if (isWest) regionalRainMult = 1.30; // Western Ghats orographic lift
  else if (isSouth) regionalRainMult = 1.15;
  else if (isNorth) regionalRainMult = 0.95;

  const rainVariance = Math.sin(lat * 15 + lng * 15) * 16;
  const rainfallRate = Math.max(0, Math.round((simulatedRainfall * regionalRainMult) + rainVariance));

  // Temperature approximation based on latitude and elevation
  const baseTemp = 32 - ((lat - 8) * 0.45);
  const temp = Math.round((baseTemp + (Math.cos(lng * 10) * 1.5)) * 10) / 10;
  const humidity = Math.min(99, Math.max(65, Math.round(84 + (rainfallRate / 18))));
  
  const feelsLike = Math.round((temp + (humidity / 15) + (temp > 27 ? 3.2 : 0)) * 10) / 10;
  
  const windSpeed = Math.max(14, Math.round(36 + Math.sin(lat * 20) * 12));
  const windGust = Math.round(windSpeed * 1.55);
  const windDirectionDeg = isWest ? 245 : isNortheast ? 255 : isNorth ? 115 : 225;

  let compass = 'SW';
  if (windDirectionDeg >= 157.5 && windDirectionDeg < 202.5) compass = 'S';
  else if (windDirectionDeg >= 202.5 && windDirectionDeg < 247.5) compass = 'SW';
  else if (windDirectionDeg >= 247.5 && windDirectionDeg < 292.5) compass = 'W';
  else if (windDirectionDeg >= 90 && windDirectionDeg < 157.5) compass = 'SE';

  const thunderProbability = Math.min(99, Math.max(15, Math.round(40 + (rainfallRate * 0.72))));
  const recentLightningCount = rainfallRate > 60 ? Math.round(14 + (rainfallRate / 7)) : Math.round(rainfallRate / 10);
  
  const pressure = Math.round((1006 - (rainfallRate * 0.09)) * 10) / 10;
  const cloudCover = Math.min(100, Math.max(45, Math.round(65 + (rainfallRate * 0.45))));

  let conditionText = 'Active Monsoon Shower & Squall';
  let severeWarning: string | null = null;

  if (rainfallRate >= 80 || thunderProbability >= 85) {
    conditionText = 'Severe Convective Cloudburst & Flash Flood Threat';
    severeWarning = 'RED ALERT: Severe Cloudburst & Lightning Threat. Low-lying areas and riverbanks face immediate inundation.';
  } else if (rainfallRate >= 45 || thunderProbability >= 65) {
    conditionText = 'Heavy Monsoon Downpour with Convective Thunder';
    severeWarning = 'ORANGE ALERT: High Waterlogging Risk across underpasses and arterial corridors.';
  } else if (rainfallRate >= 20) {
    conditionText = 'Scattered Monsoon Squalls & Gusty Inflow';
    severeWarning = 'YELLOW WATCH: Moderate waterlogging in low-elevation micro-catchments.';
  }

  return {
    locationName,
    coordinates: [lat, lng],
    temperature: temp,
    feelsLike,
    rainfallRate,
    windSpeed,
    windGust,
    windDirectionDeg,
    windDirectionCompass: compass,
    thunderProbability,
    recentLightningCount,
    pressure,
    humidity,
    cloudCover,
    conditionText,
    severeWarning
  };
}
