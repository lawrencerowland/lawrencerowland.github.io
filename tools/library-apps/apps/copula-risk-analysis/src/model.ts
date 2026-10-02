export const normalQuantile = (p: number) => {
        // Approximation of the inverse of the normal CDF (quantile function)
        p = Math.max(1e-12, Math.min(1 - 1e-12, p));
        if (p === 0.5) return 0;
        
        let q, r;
        if (p < 0.5) {
          q = p;
          r = -1;
        } else {
          q = 1 - p;
          r = 1;
        }
        
        const y = Math.sqrt(-2 * Math.log(q));
        const a = 2.515517 + (0.802853 * y) + (0.010328 * y * y);
        const b = 1 + (1.432788 * y) + (0.189269 * y * y) + (0.001308 * y * y * y);
        
        return r * (y - (a / b));
      };
      

  // Generate gaussian copula samples
export const generateGaussianCopula = (correlation: number, size: number, random = Math.random) => {
    if (Math.abs(correlation) > 1 || !Number.isFinite(correlation)) throw new RangeError("Correlation must be between -1 and 1");
    
    // Generate multivariate normal data
    const mvNormalData: any[] = [];
    
    for (let i = 0; i < size; i++) {
      // Generate independent standard normal variables
      const z1 = gaussianRandom(random);
      const z2 = gaussianRandom(random);
      
      // Transform to correlated normal variables
      const x1 = z1;
      const x2 = correlation * z1 + Math.sqrt(1 - correlation * correlation) * z2;
      
      // Transform to uniform using the CDF of standard normal
      // Using the error function approximation for normal CDF
      const normalCDF = (x: number) => {
        // Implementation of normal CDF using error function
        return 0.5 * (1 + erf(x / Math.sqrt(2)));
      };
      
      // Error function approximation
      const erf = (x: number) => {
        // Constants
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;
        
        // Save the sign
        const sign = (x < 0) ? -1 : 1;
        x = Math.abs(x);
        
        // Approximation formula
        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        
        return sign * y;
      };
      
      const u1 = normalCDF(x1);
      const u2 = normalCDF(x2);
      
      mvNormalData.push({u1, u2});
    }
    
    return mvNormalData;
  };
  
  // Standard normal random variable generator
  const gaussianRandom = (random = Math.random) => {
    let u = 0, v = 0;
    while (u === 0) u = random();
    while (v === 0) v = random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };
  
  // Transform uniform marginals to specific distributions for concrete project tasks
export const createRiskDistributions = (copulaData: any[]) => {
    const riskData = copulaData.map(point => {
      // Foundation Work Delay: Right-skewed distribution
      // Using quantile function approximation
      const mu_foundation = 2.0;
      const sigma_foundation = 0.8;
      const foundationDelay = Math.exp(mu_foundation + sigma_foundation * normalQuantile(point.u1));
      
      // Original bounded power marginal: F(x) = (x / 4)^1.5 on [0, 4].
      const shape = 1.5;
      const scale = 4;
      const electricalDelay = scale * Math.pow(point.u2, 1/shape);
      
      return {
        foundationDelay: Math.min(foundationDelay, 30),
        electricalDelay,
        u1: point.u1, u2: point.u2,
        probability: 1/copulaData.length
      };
    });
    
    return riskData;
  };
  
// Normalize weights for both the full sample and a conditional tail subset.
export const calculateImpact = (data: any[]) => {
  const weight = data.reduce((sum, point) => sum + point.probability, 0);
  if (!weight) return null;
  // Two sequential tasks: incremental delays add, with no float or overlap.
  const delay = data.reduce((sum, point) => sum +
    (point.foundationDelay + point.electricalDelay) * point.probability, 0) / weight;
  const cost = data.reduce((sum, point) => sum +
    (point.foundationDelay * 5000 + point.electricalDelay * 3000) * point.probability, 0) / weight;
  return { delay: Math.round(delay * 10) / 10, cost: Math.round(cost / 1000) };
};

// Intersect the underlying uniform percentiles before foundation capping creates ties.
// Preserve original sample weights: the subset mass estimates this joint event's probability.
export const generateExtremeScenario = (data: any[], percentile = 0.9) =>
  data.filter(point => point.u1 > percentile && point.u2 > percentile);

export const seededRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return (state + 0.5) / 4294967296;
  };
};

export const getHistogramData = (data: any[], accessor: (d: any) => number, bins = 10, maxValue = 30) => {
  const counts = Array(bins).fill(0);
  for (const point of data) {
    const value = accessor(point);
    const index = Math.max(0, Math.min(bins - 1, Math.floor(value / maxValue * bins)));
    counts[index] += 1;
  }
  return counts.map((count, i) => ({
    bin: `${(i * maxValue / bins).toFixed(1)}–${((i + 1) * maxValue / bins).toFixed(1)}`,
    binCenter: (i + 0.5) * maxValue / bins,
    count: data.length ? count / data.length : 0,
  }));
};
