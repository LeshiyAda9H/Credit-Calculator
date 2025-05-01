import { calculateCredit } from './fuzzySystem';

describe('calculateCredit', () => {
  it('returns very high probability for high income, very low debt, good credit history, and medium age', () => {
    const input = {
      income: 150000,
      debtLoad: 3000,
      creditHistory: 'good' as const,
      age: 40,
    };
    const output = calculateCredit(input);
    expect(output.approvalProbability).toBeGreaterThan(90);
    expect(output.recommendedAmount).toBeGreaterThan(70000);
  });

  it('returns low probability for very low income, high debt, poor credit history, and very low age', () => {
    const input = {
      income: 20000,
      debtLoad: 30000,
      creditHistory: 'poor' as const,
      age: 20,
    };
    const output = calculateCredit(input);
    expect(output.approvalProbability).toBeLessThan(20);
    expect(output.recommendedAmount).toBeLessThan(10000);
  });

  it('returns medium probability for medium income, medium debt, average credit history, and medium age', () => {
    const input = {
      income: 80000,
      debtLoad: 20000,
      creditHistory: 'average' as const,
      age: 35,
    };
    const output = calculateCredit(input);
    expect(output.approvalProbability).toBeGreaterThan(40);
    expect(output.approvalProbability).toBeLessThan(60);
    expect(output.recommendedAmount).toBeGreaterThan(20000);
    expect(output.recommendedAmount).toBeLessThan(40000);
  });

  it('handles edge case with zero income and high debt', () => {
    const input = {
      income: 0,
      debtLoad: 40000,
      creditHistory: 'poor' as const,
      age: 25,
    };
    const output = calculateCredit(input);
    expect(output.approvalProbability).toBeLessThan(15);
    expect(output.recommendedAmount).toBe(0);
  });
});