import { SafeRouteOption, RoadSegment } from '../types';

export interface RouteRequest {
  startId: string;
  startName: string;
  startCoords: [number, number];
  endId: string;
  endName: string;
  endCoords: [number, number];
}

export const ROUTE_PRESETS: { id: string; name: string; start: RouteRequest['startName']; end: RouteRequest['endName']; startCoords: [number, number]; endCoords: [number, number] }[] = [
  {
    id: 'howrah-to-saltlake',
    name: 'Howrah Station ➔ Salt Lake Sector V',
    start: 'Howrah Railway Station',
    end: 'Salt Lake Sector V (IT Hub)',
    startCoords: [22.5850, 88.3426],
    endCoords: [22.5735, 88.4331],
  },
  {
    id: 'airport-to-parkst',
    name: 'NSCB International Airport ➔ Park Street',
    start: 'Netaji Subhash Chandra Bose Airport',
    end: 'Park Street Commercial District',
    startCoords: [22.6520, 88.4460],
    endCoords: [22.5511, 88.3524],
  },
  {
    id: 'behala-to-esplanade',
    name: 'Behala Chowrasta ➔ Esplanade Transit Center',
    start: 'Behala Chowrasta',
    end: 'Esplanade Metro Junction',
    startCoords: [22.4988, 88.3182],
    endCoords: [22.5645, 88.3518],
  },
  {
    id: 'sealdah-to-newtown',
    name: 'Sealdah Station ➔ New Town Eco Park',
    start: 'Sealdah Railway Station',
    end: 'New Town Action Area II',
    startCoords: [22.5670, 88.3712],
    endCoords: [22.5867, 88.4682],
  },
];

export function calculateRoutes(
  presetId: string,
  roads: RoadSegment[],
  isSevereCitywide: boolean
): { fastest: SafeRouteOption; floodSafe: SafeRouteOption; deltaMinutes: number; exposureReductionPercent: number } {
  const preset = ROUTE_PRESETS.find(p => p.id === presetId) || ROUTE_PRESETS[0];

  // Route 1: Direct / Fastest (takes traditional central roads that cut through low-lying flooded basins)
  // e.g. through Ultadanga underpass or College St
  let fastestPath: [number, number][] = [];
  let safePath: [number, number][] = [];

  if (preset.id === 'howrah-to-saltlake') {
    // Direct passes through central Kolkata (MG Road, College St, Ultadanga)
    fastestPath = [
      preset.startCoords,
      [22.5830, 88.3550], // Howrah Bridge to Burrabazar
      [22.5786, 88.3653], // College St crossing (Severely Flooded!)
      [22.5958, 88.3884], // Ultadanga Hudco Underpass (Submerged!)
      [22.5850, 88.4120], // Salt Lake Gate
      preset.endCoords
    ];
    // Safe route diverts via Vidyasagar Setu (Second Hooghly Bridge) -> AJC Bose Rd Flyover -> Maa Elevated Flyover -> EM Bypass
    safePath = [
      preset.startCoords,
      [22.5600, 88.3300], // Vidyasagar Setu approach
      [22.5450, 88.3490], // AJC Bose Elevated corridor
      [22.5430, 88.3750], // Maa Flyover elevated viaduct (Zero flood risk!)
      [22.5505, 88.4010], // Chingrighata interchange
      [22.5690, 88.4050], // Broadway arterial
      preset.endCoords
    ];
  } else if (preset.id === 'airport-to-parkst') {
    // Fastest cuts straight down VIP road through submerged Ultadanga underpass
    fastestPath = [
      preset.startCoords,
      [22.6225, 88.3980], // Dum Dum Nagerbazar
      [22.5958, 88.3884], // Ultadanga VIP underpass (Flooded)
      [22.5670, 88.3712], // Sealdah
      preset.endCoords
    ];
    // Safe uses Major Arterial Road through New Town -> Salt Lake Bypass -> Maa Flyover
    safePath = [
      preset.startCoords,
      [22.6100, 88.4600], // New Town Expressway
      [22.5867, 88.4682], // MAR New Town (Safe elevation 8.2m)
      [22.5735, 88.4331], // Sector V ring
      [22.5505, 88.4010], // EM Bypass
      [22.5430, 88.3750], // Maa Flyover ramp
      preset.endCoords
    ];
  } else if (preset.id === 'behala-to-esplanade') {
    // Fastest uses Diamond Harbour Road at grade (Submerged!)
    fastestPath = [
      preset.startCoords,
      [22.5120, 88.3240], // Taratala crossing (High risk)
      [22.5350, 88.3350], // Alipore
      preset.endCoords
    ];
    // Safe diverts via James Long Sarani -> Elevated Taratala Flyover -> Durgapur Bridge -> Red Road
    safePath = [
      preset.startCoords,
      [22.5020, 88.3280], // Elevated bypass
      [22.5200, 88.3400], // High-grade Alipore avenue
      [22.5420, 88.3460], // Red Road Maidan (Well-drained)
      preset.endCoords
    ];
  } else {
    // Sealdah to New Town
    fastestPath = [
      preset.startCoords,
      [22.5800, 88.3980], // Beliaghata canal low bridge
      [22.5958, 88.3884], // Ultadanga
      preset.endCoords
    ];
    safePath = [
      preset.startCoords,
      [22.5505, 88.4010], // EM Bypass south ramp
      [22.5650, 88.4200], // Salt Lake Stadium road
      [22.5800, 88.4500], // Ring road
      preset.endCoords
    ];
  }

  const baseFastestMin = 18;
  const baseSafeMin = 24;
  const delta = isSevereCitywide ? 9 : 6;

  const fastest: SafeRouteOption = {
    type: 'FASTEST',
    name: 'Direct Route (Traditional GPS)',
    durationMinutes: baseFastestMin,
    distanceKm: 7.2,
    floodZonesCrossed: isSevereCitywide ? 3 : 2,
    maxWaterDepth: isSevereCitywide ? 0.52 : 0.41,
    averageRisk: isSevereCitywide ? 'SEVERE' : 'HIGH',
    path: fastestPath,
    instructions: [
      'Depart via ground-level central arterial',
      '⚠️ WARNING: Enters submerged corridor near low-lying canal basin',
      '⚠️ HAZARD: Water depth exceeds 40 cm at underpass; high vehicle stalling risk',
      'Substantial delay expected due to gridlock and stranded vehicles'
    ],
    recommendationNote: 'NOT RECOMMENDED: Severe risk of engine hydro-lock and stranding in flood basin.'
  };

  const floodSafe: SafeRouteOption = {
    type: 'FLOOD_SAFE',
    name: 'Flood-Resilient Diverted Route',
    durationMinutes: baseSafeMin + (isSevereCitywide ? 2 : 0),
    distanceKm: 8.8,
    floodZonesCrossed: 0,
    maxWaterDepth: 0.04,
    averageRisk: 'LOW',
    path: safePath,
    instructions: [
      'Depart via elevated access ramp',
      '✅ Divert to high-embankment bypass (Elevation > 8.5m ASL)',
      '✅ Cruise continuously over Maa Elevated Flyover (Zero surface runoff)',
      '✅ Merge safely to destination with clear drainage outfalls'
    ],
    recommendationNote: 'RECOMMENDED BY FLOODGUARD AI: 100% bypass of severe waterlogging zones with negligible travel time penalty.'
  };

  return {
    fastest,
    floodSafe,
    deltaMinutes: delta,
    exposureReductionPercent: 82
  };
}
