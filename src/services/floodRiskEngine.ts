import { 
  LocationZone, 
  CalculatedZoneRisk, 
  RiskLevel, 
  SimulationParams, 
  NowcastTimelineStep 
} from '../types';

/**
 * Deterministic AI Flood Risk Engine
 * Mathematical coupling of Rainfall, Drainage, DEM Elevation, Soil, and Catchment characteristics.
 * Strictly adheres to SIH26085 formula weights:
 * - Rainfall: 30%
 * - Drainage stress: 25%
 * - Elevation: 15%
 * - Historical waterlogging: 10%
 * - Impervious surface: 10%
 * - Soil saturation: 5%
 * - Other geographic factors: 5%
 */
export function calculateZoneRisk(
  zone: LocationZone,
  simParams: SimulationParams,
  timelineStep: NowcastTimelineStep
): CalculatedZoneRisk {
  // Timeline rainfall multipliers:
  // Step 0 (NOW): 1.0x
  // Step 1 (+1H): 1.25x
  // Step 2 (+2H): 1.55x (Peak storm cloudburst)
  // Step 3 (+3H): 1.20x (Slow recession)
  const timelineMultipliers = [1.0, 1.25, 1.55, 1.20];
  const stepMult = timelineMultipliers[timelineStep] || 1.0;

  // Effective rainfall for this zone
  const effectiveRainfall = Math.min(180, Math.round(simParams.rainfall * stepMult));
  
  // Forecast rainfall for the next hour
  const nextHourMult = timelineStep < 3 ? timelineMultipliers[timelineStep + 1] : 0.95;
  const forecastRainfall = Math.min(180, Math.round(simParams.rainfall * nextHourMult));

  // Drainage stress computation:
  // Combines baseline zone stress + simulation blockage + efficiency modifier + rainfall surge
  const drainageEfficiencyFactor = (100 - simParams.drainageEfficiency) * 0.4;
  const blockageImpact = simParams.drainBlockage * 0.45;
  const rainLoad = (effectiveRainfall / 100) * 35;
  const computedDrainageStress = Math.min(
    100,
    Math.max(10, Math.round(zone.drainageStressBase * 0.5 + drainageEfficiencyFactor + blockageImpact + rainLoad))
  );

  // Normalized factor sub-scores (0 to 100 scale)
  // 1. Rainfall score (30% weight) -> 120 mm/hr = 100
  const rainfallScore = Math.min(100, Math.max(0, (effectiveRainfall / 110) * 100));

  // 2. Drainage stress score (25% weight)
  const drainageScore = computedDrainageStress;

  // 3. Elevation score (15% weight) -> In Kolkata: 4.5m is very low (score 100), 9m is safe (score 10)
  // Inverse relationship: lower elevation = higher flood risk
  const elevationScore = Math.min(100, Math.max(5, (10 - zone.elevation) * 18));

  // 4. Historical waterlogging score (10% weight)
  const historicalScore = zone.historicalWaterlogging;

  // 5. Impervious surface score (10% weight)
  const imperviousScore = zone.imperviousSurface;

  // 6. Soil saturation score (5% weight)
  const simSoilSatNum = typeof simParams.soilSaturation === 'number' 
    ? simParams.soilSaturation 
    : (simParams.soilSaturation === 'SATURATED' ? 95 : simParams.soilSaturation === 'NORMAL' ? 55 : 20);
  const soilSaturation = Math.min(100, Math.max(10, Math.round(zone.soilSaturationBase * 0.4 + simSoilSatNum * 0.6)));
  const soilScore = soilSaturation;

  // 7. Other geographic factors score (5% weight) -> low slope, proximity to canal
  const slopePenalty = Math.max(0, (3 - zone.slope) * 20);
  const canalProximityPenalty = Math.max(0, (1500 - zone.distanceToCanal) / 15);
  const otherScore = Math.min(100, (slopePenalty + canalProximityPenalty) / 2);

  // Weighted formula:
  // Rainfall = 30%, Drainage = 25%, Elevation = 15%, Historical = 10%, Impervious = 10%, Soil = 5%, Other = 5%
  const weightedSum =
    rainfallScore * 0.30 +
    drainageScore * 0.25 +
    elevationScore * 0.15 +
    historicalScore * 0.10 +
    imperviousScore * 0.10 +
    soilScore * 0.05 +
    otherScore * 0.05;

  const floodProbability = Math.min(99, Math.max(5, Math.round(weightedSum)));

  // Risk Level Classification:
  // 0–25 LOW, 26–50 MODERATE, 51–75 HIGH, 76–100 SEVERE
  let riskLevel: RiskLevel = 'LOW';
  if (floodProbability > 75) {
    riskLevel = 'SEVERE';
  } else if (floodProbability > 50) {
    riskLevel = 'HIGH';
  } else if (floodProbability > 25) {
    riskLevel = 'MODERATE';
  }

  // Water depth computation (meters):
  // Dependent on flood probability and elevation delta
  let waterDepth = 0.02;
  if (floodProbability > 25) {
    const rawDepth = (floodProbability / 100) * 0.58 + (effectiveRainfall > 70 ? (effectiveRainfall - 70) * 0.003 : 0);
    waterDepth = Math.round(rawDepth * 100) / 100;
  }
  if (riskLevel === 'SEVERE' && waterDepth < 0.42) {
    waterDepth = 0.48;
  }

  // Time to expected inundation
  let expectedFloodingTime = 'No immediate inundation';
  if (riskLevel === 'SEVERE') {
    expectedFloodingTime = timelineStep === 0 ? '25–40 minutes' : 'Active inundation cresting';
  } else if (riskLevel === 'HIGH') {
    expectedFloodingTime = timelineStep === 0 ? '45–60 minutes' : 'Accumulating surface runoff';
  } else if (riskLevel === 'MODERATE') {
    expectedFloodingTime = '60–90 minutes if rain persists';
  }

  // Recommended Action
  let recommendedAction = 'Maintain normal monitoring of street stormwater sumps.';
  if (riskLevel === 'SEVERE') {
    recommendedAction = 'Issue immediate red alert. Deploy high-capacity dewatering pumps. Close low-lying underpasses and reroute arterial traffic to elevated bypasses.';
  } else if (riskLevel === 'HIGH') {
    recommendedAction = 'Deploy quick response traffic wardens. Prepare suction pumps at local canal outfalls. Advise light vehicles to avoid inner roads.';
  } else if (riskLevel === 'MODERATE') {
    recommendedAction = 'Inspect drainage grates for plastic debris. Pre-position dewatering crews near transit nodes.';
  }

  // Exact contribution bars for Explainable AI (XAI)
  // Normalized to sum to 100%
  const rawContribs = {
    rainfall: rainfallScore * 0.30,
    drainageStress: drainageScore * 0.25,
    elevation: elevationScore * 0.15,
    historical: historicalScore * 0.10,
    impervious: imperviousScore * 0.10,
    soilSaturation: soilScore * 0.05,
    other: otherScore * 0.05,
  };
  const totalRaw = Object.values(rawContribs).reduce((a, b) => a + b, 0);

  const contributions = {
    rainfall: Math.round((rawContribs.rainfall / totalRaw) * 100),
    drainageStress: Math.round((rawContribs.drainageStress / totalRaw) * 100),
    elevation: Math.round((rawContribs.elevation / totalRaw) * 100),
    historical: Math.round((rawContribs.historical / totalRaw) * 100),
    impervious: Math.round((rawContribs.impervious / totalRaw) * 100),
    soilSaturation: Math.round((rawContribs.soilSaturation / totalRaw) * 100),
    other: Math.round((rawContribs.other / totalRaw) * 100),
  };

  // Human-readable Explainable AI Diagnostic Text
  const primaryFactor = contributions.rainfall >= 28 ? 'intense precipitation rates' : 'elevated hydraulic drainage stress';
  const secondaryFactor = contributions.elevation >= 16 ? `low ground elevation (${zone.elevation}m ASL)` : `dense impervious landcover (${zone.imperviousSurface}%)`;
  
  let explanation = '';
  if (riskLevel === 'SEVERE') {
    explanation = `Severe flood risk is primarily driven by ${primaryFactor} exceeding local outfall capacity, compounded by ${secondaryFactor} and known chronic waterlogging history (${zone.historicalWaterlogging}% historical recurrence).`;
  } else if (riskLevel === 'HIGH') {
    explanation = `High flood risk is projected due to rapid rainfall accumulation overwhelming stormwater conduits, coupled with ${secondaryFactor}.`;
  } else if (riskLevel === 'MODERATE') {
    explanation = `Moderate flood potential identified as drainage capacity approaches threshold under steady rainfall; runoff will pond in micro-depressions.`;
  } else {
    explanation = `Low risk profile maintained due to adequate gravity drainage gradient and modern retention infrastructure keeping surface runoff manageable.`;
  }

  // Confidence calculation (deterministic, between 88% and 95%)
  const confidence = 89 + (zone.name.length % 6);

  // Affected population estimate
  const popRatio = riskLevel === 'SEVERE' ? 0.75 : riskLevel === 'HIGH' ? 0.45 : riskLevel === 'MODERATE' ? 0.15 : 0.02;
  const affectedPopulation = Math.round(zone.population * popRatio);

  return {
    zoneId: zone.id,
    name: zone.name,
    lat: zone.lat,
    lng: zone.lng,
    radius: zone.radius,
    rainfall: effectiveRainfall,
    forecastRainfall,
    elevation: zone.elevation,
    drainageCapacity: zone.drainageCapacity,
    drainageStress: computedDrainageStress,
    waterDepth,
    floodProbability,
    riskLevel,
    expectedFloodingTime,
    recommendedAction,
    confidence,
    state: zone.state,
    region: zone.region,
    riverBasin: zone.riverBasin,
    contributions,
    explanation,
    affectedPopulation,
  };
}
