import { DrainageSegment } from '../types';

export const INDIA_DRAINAGE_NETWORKS: DrainageSegment[] = [
  // --- WEST BENGAL DRAINAGE ---
  {
    id: 'D-101',
    name: 'Circular Canal (Ultadanga - Chitpur)',
    coordinates: [
      [22.6020, 88.3750],
      [22.5985, 88.3840],
      [22.5958, 88.3884],
      [22.5910, 88.3930],
      [22.5850, 88.3980]
    ],
    baseCapacity: 140,
    currentLoad: 128,
    utilization: 91,
    blockageProbability: 78,
    status: 'CRITICAL',
    outfall: 'Hooghly River Lock Gate via Chitpur'
  },
  {
    id: 'D-102',
    name: 'Kestopur Canal (VIP Road corridor)',
    coordinates: [
      [22.6100, 88.4200],
      [22.6020, 88.4150],
      [22.5900, 88.4100],
      [22.5800, 88.4250],
      [22.5700, 88.4450]
    ],
    baseCapacity: 180,
    currentLoad: 155,
    utilization: 86,
    blockageProbability: 62,
    status: 'STRESSED',
    outfall: 'Kulti River & East Kolkata Wetlands'
  },
  {
    id: 'D-103',
    name: 'Bagjola Canal (Dum Dum - Rajarhat)',
    coordinates: [
      [22.6400, 88.3900],
      [22.6320, 88.4050],
      [22.6225, 88.3980],
      [22.6150, 88.4350],
      [22.6080, 88.4700]
    ],
    baseCapacity: 160,
    currentLoad: 148,
    utilization: 92,
    blockageProbability: 84,
    status: 'CRITICAL',
    outfall: 'Kulti Gong tidal basin'
  },
  {
    id: 'D-106',
    name: 'Monikhali Canal (Behala - Santoshpur)',
    coordinates: [
      [22.5050, 88.3080],
      [22.4988, 88.3182],
      [22.4920, 88.3280],
      [22.4820, 88.3390]
    ],
    baseCapacity: 150,
    currentLoad: 142,
    utilization: 95,
    blockageProbability: 86,
    status: 'CRITICAL',
    outfall: 'Hooghly River Sluice at Akra'
  },

  // --- ASSAM & NORTHEAST (BRAHMAPUTRA & BHARALU) ---
  {
    id: 'D-201',
    name: 'Brahmaputra River - Guwahati Reach',
    coordinates: [
      [26.1950, 91.6800],
      [26.1850, 91.7200],
      [26.1750, 91.7600],
      [26.1600, 91.8000]
    ],
    baseCapacity: 2800,
    currentLoad: 2720,
    utilization: 97,
    blockageProbability: 40,
    status: 'CRITICAL',
    outfall: 'Bay of Bengal via Jamuna River Delta'
  },
  {
    id: 'D-202',
    name: 'Bharalu Urban Storm Channel (Guwahati)',
    coordinates: [
      [26.1250, 91.7600],
      [26.1445, 91.7362],
      [26.1620, 91.7200],
      [26.1750, 91.7100]
    ],
    baseCapacity: 110,
    currentLoad: 104,
    utilization: 94,
    blockageProbability: 88,
    status: 'CRITICAL',
    outfall: 'Brahmaputra River Sluice (Bharalumukh)'
  },
  {
    id: 'D-203',
    name: 'Barak River Urban Dyke (Silchar)',
    coordinates: [
      [24.8150, 92.7600],
      [24.8333, 92.7789],
      [24.8500, 92.8050]
    ],
    baseCapacity: 620,
    currentLoad: 590,
    utilization: 95,
    blockageProbability: 65,
    status: 'CRITICAL',
    outfall: 'Meghna River System'
  },

  // --- BIHAR (GANGA & KOSI DRAINAGE) ---
  {
    id: 'D-301',
    name: 'Ganga-Punpun Siphon & Flood Bypass (Patna)',
    coordinates: [
      [25.6150, 85.0800],
      [25.5941, 85.1376],
      [25.5800, 85.1900],
      [25.5650, 85.2400]
    ],
    baseCapacity: 1450,
    currentLoad: 1380,
    utilization: 95,
    blockageProbability: 58,
    status: 'CRITICAL',
    outfall: 'Ganga Main Stream at Fatuha Confluence'
  },
  {
    id: 'D-302',
    name: 'Kamala-Balan & Kosi Floodway (Darbhanga)',
    coordinates: [
      [26.2500, 85.8500],
      [26.1542, 85.8918],
      [26.0500, 85.9400]
    ],
    baseCapacity: 850,
    currentLoad: 810,
    utilization: 95,
    blockageProbability: 74,
    status: 'CRITICAL',
    outfall: 'Ganga Confluence near Kursela'
  },

  // --- MAHARASHTRA (MITHI RIVER & KONKAN) ---
  {
    id: 'D-401',
    name: 'Mithi River (Powai to Mahim Causeway, Mumbai)',
    coordinates: [
      [19.1250, 72.9050],
      [19.0950, 72.8900],
      [19.0726, 72.8845],
      [19.0550, 72.8550],
      [19.0400, 72.8350]
    ],
    baseCapacity: 340,
    currentLoad: 325,
    utilization: 96,
    blockageProbability: 82,
    status: 'CRITICAL',
    outfall: 'Mahim Bay / Arabian Sea'
  },
  {
    id: 'D-402',
    name: 'Vashishti River Flood Channel (Chiplun)',
    coordinates: [
      [17.5600, 73.5450],
      [17.5323, 73.5186],
      [17.5050, 73.4900]
    ],
    baseCapacity: 480,
    currentLoad: 445,
    utilization: 93,
    blockageProbability: 55,
    status: 'CRITICAL',
    outfall: 'Dabhol Estuary / Arabian Sea'
  },

  // --- DELHI-NCR (YAMUNA & NAJAFGARH) ---
  {
    id: 'D-501',
    name: 'Yamuna River Inter-State Channel (Delhi)',
    coordinates: [
      [28.7200, 77.2200],
      [28.6653, 77.2327],
      [28.6289, 77.2435],
      [28.5800, 77.2600]
    ],
    baseCapacity: 1600,
    currentLoad: 1480,
    utilization: 93,
    blockageProbability: 52,
    status: 'CRITICAL',
    outfall: 'Okhla Barrage into Southern Yamuna'
  },
  {
    id: 'D-502',
    name: 'Najafgarh Storm Drain Corridor (Delhi-Gurugram)',
    coordinates: [
      [28.4900, 76.9900],
      [28.5600, 77.0800],
      [28.6400, 77.1600],
      [28.6900, 77.2100]
    ],
    baseCapacity: 420,
    currentLoad: 380,
    utilization: 90,
    blockageProbability: 76,
    status: 'CRITICAL',
    outfall: 'Yamuna River at Wazirabad'
  },

  // --- KERALA (PERIYAR & KUTTANAD SPILLWAYS) ---
  {
    id: 'D-601',
    name: 'Periyar River Lower Reach (Aluva - Kochi)',
    coordinates: [
      [10.1350, 76.3800],
      [10.1076, 76.3516],
      [10.0500, 76.3000],
      [9.9800, 76.2400]
    ],
    baseCapacity: 1200,
    currentLoad: 1120,
    utilization: 93,
    blockageProbability: 45,
    status: 'CRITICAL',
    outfall: 'Vembanad Backwaters & Cochin Arabian Sea Outfall'
  },
  {
    id: 'D-602',
    name: 'Thottappally Spillway & Pamba Basin (Kuttanad)',
    coordinates: [
      [9.5400, 76.4800],
      [9.4981, 76.4382],
      [9.3200, 76.3850]
    ],
    baseCapacity: 680,
    currentLoad: 660,
    utilization: 97,
    blockageProbability: 60,
    status: 'CRITICAL',
    outfall: 'Arabian Sea via Thottappally Regulator'
  },

  // --- TAMIL NADU (ADYAR & BUCKINGHAM) ---
  {
    id: 'D-701',
    name: 'Adyar River Storm Basin (Chennai)',
    coordinates: [
      [12.9900, 80.1200],
      [13.0100, 80.1700],
      [13.0213, 80.2231],
      [13.0150, 80.2650]
    ],
    baseCapacity: 750,
    currentLoad: 710,
    utilization: 95,
    blockageProbability: 68,
    status: 'CRITICAL',
    outfall: 'Bay of Bengal via Adyar Estuary'
  },
  {
    id: 'D-702',
    name: 'Buckingham Canal (Velachery - Sholinganallur)',
    coordinates: [
      [13.0100, 80.2450],
      [12.9759, 80.2212],
      [12.9200, 80.2250],
      [12.8700, 80.2300]
    ],
    baseCapacity: 280,
    currentLoad: 265,
    utilization: 95,
    blockageProbability: 84,
    status: 'CRITICAL',
    outfall: 'Kovalam Estuary & Bay of Bengal'
  },

  // --- ODISHA (MAHANADI-KATHAJODI) ---
  {
    id: 'D-801',
    name: 'Mahanadi-Kathajodi Delta Spillways (Cuttack)',
    coordinates: [
      [20.4850, 85.8400],
      [20.4625, 85.8828],
      [20.4400, 85.9300]
    ],
    baseCapacity: 1850,
    currentLoad: 1720,
    utilization: 93,
    blockageProbability: 50,
    status: 'CRITICAL',
    outfall: 'Bay of Bengal at Paradip'
  },

  // --- GUJARAT (TAPI RIVER) ---
  {
    id: 'D-901',
    name: 'Tapi River Flood Channel (Surat)',
    coordinates: [
      [21.2100, 72.8800],
      [21.1702, 72.8311],
      [21.1300, 72.7600]
    ],
    baseCapacity: 1400,
    currentLoad: 1290,
    utilization: 92,
    blockageProbability: 54,
    status: 'CRITICAL',
    outfall: 'Gulf of Khambhat / Arabian Sea'
  },

  // --- KARNATAKA (BENGALURU RAJAKALUVES) ---
  {
    id: 'D-902',
    name: 'Bellandur-Varthur Rajakaluve Primary Outfall (Bengaluru)',
    coordinates: [
      [12.9550, 77.6550],
      [12.9352, 77.6784],
      [12.9400, 77.7200],
      [12.9450, 77.7600]
    ],
    baseCapacity: 190,
    currentLoad: 178,
    utilization: 94,
    blockageProbability: 85,
    status: 'CRITICAL',
    outfall: 'Dakshina Pinakini River Basin'
  }
];

// Alias for backward compatibility
export const KOLKATA_DRAINAGE_NETWORKS: DrainageSegment[] = INDIA_DRAINAGE_NETWORKS;
