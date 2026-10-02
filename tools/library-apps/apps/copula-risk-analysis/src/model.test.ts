import { describe, expect, test } from 'vitest';
import { normalQuantile, seededRandom, generateGaussianCopula, createRiskDistributions, generateExtremeScenario, calculateImpact, getHistogramData } from './model';

const sample = (rho: number, n = 20000) => createRiskDistributions(generateGaussianCopula(rho, n, seededRandom(42)));
const correlation = (data: any[]) => {
  const x = data.map(d => d.foundationDelay), y = data.map(d => d.electricalDelay);
  const mx = x.reduce((a, b) => a + b) / x.length, my = y.reduce((a, b) => a + b) / y.length;
  return x.reduce((sum, v, i) => sum + (v - mx) * (y[i] - my), 0) /
    Math.sqrt(x.reduce((sum, v) => sum + (v - mx) ** 2, 0) * y.reduce((sum, v) => sum + (v - my) ** 2, 0));
};

describe('copula calculations', () => {
  test('normal quantiles increase with probability and have correct signs', () => {
    expect(normalQuantile(.025)).toBeCloseTo(-1.96, 2);
    expect(normalQuantile(.5)).toBe(0);
    expect(normalQuantile(.975)).toBeCloseTo(1.96, 2);
    const delays = createRiskDistributions([{u1:.1,u2:.1}, {u1:.5,u2:.5}, {u1:.9,u2:.9}]);
    expect(delays[0].foundationDelay).toBeLessThan(delays[1].foundationDelay);
    expect(delays[1].foundationDelay).toBeLessThan(delays[2].foundationDelay);
  });
  test('transformed delays retain the sign of latent dependence', () => {
    expect(correlation(sample(.9))).toBeGreaterThan(.65);
    expect(correlation(sample(-.9))).toBeLessThan(-.65);
  });
  test('independent upper deciles occur about one percent; positive dependence increases that frequency', () => {
    const independent = sample(0), dependent = sample(.9);
    expect(generateExtremeScenario(independent).length / independent.length).toBeCloseTo(.01, 2);
    expect(generateExtremeScenario(dependent).length).toBeGreaterThan(4 * generateExtremeScenario(independent).length);
    expect(independent.every(d => Number.isFinite(d.foundationDelay) && d.foundationDelay <= 30 && d.electricalDelay <= 4)).toBe(true);
  });
  test('same seed reuses the foundation draws when dependence changes', () => {
    expect(sample(-.9, 100).map(d => d.foundationDelay)).toEqual(sample(.9, 100).map(d => d.foundationDelay));
    expect(sample(.7, 100)).toEqual(sample(.7, 100));
  });
  test('conditional impact normalizes subset mass and adds sequential task delays', () => {
    const data = [{foundationDelay:10,electricalDelay:2,probability:.002}, {foundationDelay:20,electricalDelay:4,probability:.002}];
    expect(calculateImpact(data)).toEqual({delay:18,cost:84});
    expect(calculateImpact([])).toBeNull();
    expect(generateExtremeScenario([{u1:.99,u2:.1}, {u1:.1,u2:.99}])).toEqual([]);
  });
  test('upper-decile selection keeps original weights, including tied capped delays', () => {
    const points = [{u1:.95,u2:.95,foundationDelay:30,probability:.1}, {u1:.96,u2:.1,foundationDelay:30,probability:.1}];
    expect(generateExtremeScenario(points)).toEqual([points[0]]);
  });
  test('histograms include their upper endpoint and preserve sample mass', () => {
    const histogram = getHistogramData([{v:0}, {v:15}, {v:30}], d => d.v, 10, 30);
    expect(histogram.reduce((sum, d) => sum + d.count, 0)).toBeCloseTo(1);
    expect(histogram[9].count).toBeCloseTo(1/3);
  });
});
