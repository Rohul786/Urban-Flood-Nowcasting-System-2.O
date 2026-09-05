import { RoadSegment } from '../types';

export const INDIA_ROADS: RoadSegment[] = [
  // --- WEST BENGAL ROADS ---
  {
    id: 'road-01',
    name: 'VIP Road (Ultadanga Underpass to Lake Town)',
    coordinates: [
      [22.5958, 88.3884],
      [22.5990, 88.3980],
      [22.6030, 88.4060],
      [22.6080, 88.4120]
    ],
    lengthKm: 3.2,
    baseElevation: 5.6,
    waterDepth: 0.41,
    floodProbability: 89,
    status: 'HIGH_RISK',
    action: 'AVOID',
    drainageId: 'D-101',
    zoneId: 'zone-ultadanga'
  },
  {
    id: 'road-02',
    name: 'Diamond Harbour Road (Behala Chowrasta to Taratala)',
    coordinates: [
      [22.4850, 88.3120],
      [22.4988, 88.3182],
      [22.5120, 88.3240]
    ],
    lengthKm: 4.1,
    baseElevation: 5.2,
    waterDepth: 0.49,
    floodProbability: 94,
    status: 'BLOCKED',
    action: 'ROAD_CLOSED',
    drainageId: 'D-106',
    zoneId: 'zone-behala'
  },
  {
    id: 'road-03',
    name: 'College Street (MG Road Crossing to Bowbazar)',
    coordinates: [
      [22.5786, 88.3653],
      [22.5740, 88.3655],
      [22.5690, 88.3658]
    ],
    lengthKm: 1.4,
    baseElevation: 5.1,
    waterDepth: 0.46,
    floodProbability: 93,
    status: 'BLOCKED',
    action: 'ROAD_CLOSED',
    drainageId: 'D-104',
    zoneId: 'zone-college-st'
  },
  {
    id: 'road-04',
    name: 'Canning-Gosaba Coastal Embankment Link',
    coordinates: [
      [22.3300, 88.6400],
      [22.3160, 88.6650],
      [22.3050, 88.6900]
    ],
    lengthKm: 5.8,
    baseElevation: 2.2,
    waterDepth: 0.58,
    floodProbability: 98,
    status: 'BLOCKED',
    action: 'ROAD_CLOSED',
    drainageId: 'D-106',
    zoneId: 'zone-sundarbans'
  },

  // --- ASSAM & NORTHEAST HIGHWAYS ---
  {
    id: 'road-as-01',
    name: 'GS Road (Paltan Bazar to Dispur, Guwahati)',
    coordinates: [
      [26.1750, 91.7500],
      [26.1550, 91.7650],
      [26.1445, 91.7362],
      [26.1350, 91.7800]
    ],
    lengthKm: 6.2,
    baseElevation: 53.0,
    waterDepth: 0.45,
    floodProbability: 92,
    status: 'BLOCKED',
    action: 'ROAD_CLOSED',
    drainageId: 'D-202',
    zoneId: 'zone-guwahati'
  },
  {
    id: 'road-as-02',
    name: 'NH-27 East-West Lifeline (Kaziranga Elevated Corridor)',
    coordinates: [
      [26.5600, 93.1200],
      [26.5775, 93.1711],
      [26.5950, 93.2400]
    ],
    lengthKm: 12.5,
    baseElevation: 66.0,
    waterDepth: 0.38,
    floodProbability: 88,
    status: 'HIGH_RISK',
    action: 'AVOID',
    drainageId: 'D-201',
    zoneId: 'zone-kaziranga'
  },
  {
    id: 'road-as-03',
    name: 'AT Road & Dibrugarh Town Protection Dyke Link',
    coordinates: [
      [27.4600, 94.8900],
      [27.4728, 94.9120],
      [27.4850, 94.9350]
    ],
    lengthKm: 4.8,
    baseElevation: 107.0,
    waterDepth: 0.35,
    floodProbability: 85,
    status: 'HIGH_RISK',
    action: 'AVOID',
    drainageId: 'D-201',
    zoneId: 'zone-dibrugarh'
  },

  // --- BIHAR HIGHWAYS & ARTERIALS ---
  {
    id: 'road-br-01',
    name: 'Bailey Road & Rajendra Nagar Underpass (Patna)',
    coordinates: [
      [25.6050, 85.1100],
      [25.5941, 85.1376],
      [25.5850, 85.1650]
    ],
    lengthKm: 5.4,
    baseElevation: 52.0,
    waterDepth: 0.52,
    floodProbability: 95,
    status: 'BLOCKED',
    action: 'ROAD_CLOSED',
    drainageId: 'D-301',
    zoneId: 'zone-patna'
  },
  {
    id: 'road-br-02',
    name: 'NH-27 / Darbhanga-Supaul Flood Embankment Road',
    coordinates: [
      [26.1800, 85.8600],
      [26.1542, 85.8918],
      [26.1200, 85.9300]
    ],
    lengthKm: 8.6,
    baseElevation: 48.0,
    waterDepth: 0.55,
    floodProbability: 96,
    status: 'BLOCKED',
    action: 'ROAD_CLOSED',
    drainageId: 'D-302',
    zoneId: 'zone-kosi-darbhanga'
  },

  // --- MAHARASHTRA / MUMBAI CORRIDORS ---
  {
    id: 'road-mh-01',
    name: 'LBS Marg & Kurla Station Sub-surface (Mumbai)',
    coordinates: [
      [19.0850, 72.8950],
      [19.0726, 72.8845],
      [19.0600, 72.8750]
    ],
    lengthKm: 3.8,
    baseElevation: 4.6,
    waterDepth: 0.58,
    floodProbability: 98,
    status: 'BLOCKED',
    action: 'ROAD_CLOSED',
    drainageId: 'D-401',
    zoneId: 'zone-mumbai-kurla'
  },
  {
    id: 'road-mh-02',
    name: 'Dr. Ambedkar Road & Hindmata Flyover Underpass (Mumbai)',
    coordinates: [
      [19.0250, 72.8450],
      [19.0178, 72.8478],
      [19.0100, 72.8520]
    ],
    lengthKm: 2.1,
    baseElevation: 4.1,
    waterDepth: 0.51,
    floodProbability: 96,
    status: 'BLOCKED',
    action: 'ROAD_CLOSED',
    drainageId: 'D-401',
    zoneId: 'zone-mumbai-hindmata'
  },
  {
    id: 'road-mh-03',
    name: 'Mumbai-Goa Highway NH-66 (Chiplun Bridge Sector)',
    coordinates: [
      [17.5450, 73.5350],
      [17.5323, 73.5186],
      [17.5180, 73.5020]
    ],
    lengthKm: 4.2,
    baseElevation: 11.5,
    waterDepth: 0.62,
    floodProbability: 97,
    status: 'BLOCKED',
    action: 'ROAD_CLOSED',
    drainageId: 'D-402',
    zoneId: 'zone-chiplun'
  },

  // --- DELHI-NCR ARTERIALS ---
  {
    id: 'road-dl-01',
    name: 'Ring Road (Kashmiri Gate ISBT to Yamuna Bazar)',
    coordinates: [
      [28.6750, 77.2280],
      [28.6653, 77.2327],
      [28.6550, 77.2400]
    ],
    lengthKm: 2.9,
    baseElevation: 205.5,
    waterDepth: 0.48,
    floodProbability: 94,
    status: 'BLOCKED',
    action: 'ROAD_CLOSED',
    drainageId: 'D-501',
    zoneId: 'zone-delhi-yamuna'
  },
  {
    id: 'road-dl-02',
    name: 'Vikas Marg & ITO Chungi Crossing',
    coordinates: [
      [28.6350, 77.2380],
      [28.6289, 77.2435],
      [28.6220, 77.2550]
    ],
    lengthKm: 3.1,
    baseElevation: 207.2,
    waterDepth: 0.36,
    floodProbability: 86,
    status: 'HIGH_RISK',
    action: 'AVOID',
    drainageId: 'D-501',
    zoneId: 'zone-delhi-ito'
  },

  // --- KERALA HIGHWAYS ---
  {
    id: 'road-kl-01',
    name: 'NH-544 (Aluva Flyover & Periyar Bridge Corridor, Kochi)',
    coordinates: [
      [10.1200, 96.3650].map((v, i) => i === 1 ? 76.3650 : v) as [number, number],
      [10.1076, 76.3516],
      [10.0920, 76.3380]
    ],
    lengthKm: 4.5,
    baseElevation: 8.2,
    waterDepth: 0.44,
    floodProbability: 93,
    status: 'BLOCKED',
    action: 'ROAD_CLOSED',
    drainageId: 'D-601',
    zoneId: 'zone-kochi-aluva'
  },
  {
    id: 'road-kl-02',
    name: 'AC Road (Alappuzha-Changanassery Delta Causeway)',
    coordinates: [
      [9.5150, 76.4100],
      [9.4981, 76.4382],
      [9.4800, 76.4700]
    ],
    lengthKm: 7.2,
    baseElevation: -0.8,
    waterDepth: 0.65,
    floodProbability: 99,
    status: 'BLOCKED',
    action: 'ROAD_CLOSED',
    drainageId: 'D-602',
    zoneId: 'zone-kuttanad'
  },

  // --- TAMIL NADU CORRIDORS ---
  {
    id: 'road-tn-01',
    name: 'Velachery Main Road & Pallikaranai Bypass (Chennai)',
    coordinates: [
      [12.9880, 80.2150],
      [12.9759, 80.2212],
      [12.9600, 80.2280]
    ],
    lengthKm: 3.6,
    baseElevation: 4.9,
    waterDepth: 0.54,
    floodProbability: 96,
    status: 'BLOCKED',
    action: 'ROAD_CLOSED',
    drainageId: 'D-702',
    zoneId: 'zone-chennai-velachery'
  },
  {
    id: 'road-tn-02',
    name: 'Anna Salai (Saidapet Adyar Bridge Sector, Chennai)',
    coordinates: [
      [13.0300, 80.2180],
      [13.0213, 80.2231],
      [13.0120, 80.2290]
    ],
    lengthKm: 2.4,
    baseElevation: 5.8,
    waterDepth: 0.42,
    floodProbability: 91,
    status: 'HIGH_RISK',
    action: 'AVOID',
    drainageId: 'D-701',
    zoneId: 'zone-chennai-adyar'
  },

  // --- ODISHA CORRIDORS ---
  {
    id: 'road-od-01',
    name: 'Cuttack Mahanadi Ring Road & Badambadi Terminal',
    coordinates: [
      [20.4750, 85.8650],
      [20.4625, 85.8828],
      [20.4500, 85.9050]
    ],
    lengthKm: 5.1,
    baseElevation: 27.5,
    waterDepth: 0.46,
    floodProbability: 93,
    status: 'BLOCKED',
    action: 'ROAD_CLOSED',
    drainageId: 'D-801',
    zoneId: 'zone-cuttack'
  },

  // --- GUJARAT CORRIDORS ---
  {
    id: 'road-gj-01',
    name: 'Rander-Adajan Causeway Link (Tapi Riverfront, Surat)',
    coordinates: [
      [21.1850, 72.8180],
      [21.1702, 72.8311],
      [21.1550, 72.8420]
    ],
    lengthKm: 4.0,
    baseElevation: 12.4,
    waterDepth: 0.48,
    floodProbability: 92,
    status: 'BLOCKED',
    action: 'ROAD_CLOSED',
    drainageId: 'D-901',
    zoneId: 'zone-surat-tapi'
  },

  // --- KARNATAKA CORRIDORS ---
  {
    id: 'road-ka-01',
    name: 'Outer Ring Road ORR (Bellandur EcoSpace to Marathahalli)',
    coordinates: [
      [12.9250, 77.6650],
      [12.9352, 77.6784],
      [12.9500, 77.6950]
    ],
    lengthKm: 4.2,
    baseElevation: 884.0,
    waterDepth: 0.44,
    floodProbability: 90,
    status: 'BLOCKED',
    action: 'ROAD_CLOSED',
    drainageId: 'D-902',
    zoneId: 'zone-bengaluru-bellandur'
  },

  // --- TELANGANA CORRIDORS ---
  {
    id: 'road-ts-01',
    name: 'Musi Riverfront Express & Chaderghat Causeway (Hyderabad)',
    coordinates: [
      [17.3750, 78.4600],
      [17.3616, 78.4747],
      [17.3500, 78.4900]
    ],
    lengthKm: 3.5,
    baseElevation: 504.0,
    waterDepth: 0.42,
    floodProbability: 88,
    status: 'HIGH_RISK',
    action: 'AVOID',
    drainageId: 'D-901',
    zoneId: 'zone-hyderabad-musi'
  },

  // --- JAMMU & KASHMIR CORRIDORS ---
  {
    id: 'road-jk-01',
    name: 'Srinagar Bypass (Pantha Chowk to Rajbagh Jhelum Floodway)',
    coordinates: [
      [34.0650, 74.8250],
      [34.0837, 74.7973],
      [34.0980, 74.7800]
    ],
    lengthKm: 5.6,
    baseElevation: 1584.0,
    waterDepth: 0.50,
    floodProbability: 94,
    status: 'BLOCKED',
    action: 'ROAD_CLOSED',
    drainageId: 'D-501',
    zoneId: 'zone-srinagar-jhelum'
  }
];

// Alias for backward compatibility
export const KOLKATA_ROADS: RoadSegment[] = INDIA_ROADS;
