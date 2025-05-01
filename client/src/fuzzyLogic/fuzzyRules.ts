type FuzzySet = { veryLow: number; low: number; medium: number; high: number };
type CreditHistorySet = { poor: number; average: number; good: number };

// Интерфейс для правила
interface Rule {
  income: keyof FuzzySet;
  debtLoad: keyof FuzzySet;
  creditHistory: keyof CreditHistorySet;
  age: keyof FuzzySet;
  output: 'veryLow' | 'low' | 'medium' | 'high' | 'veryHigh';
  weight: number;
}

// Генерация всех возможных правил
const generateRules = (): Rule[] => {
  const incomeTerms: (keyof FuzzySet)[] = ['veryLow', 'low', 'medium', 'high'];
  const debtLoadTerms: (keyof FuzzySet)[] = ['veryLow', 'low', 'medium', 'high'];
  const creditHistoryTerms: (keyof CreditHistorySet)[] = ['poor', 'average', 'good'];
  const ageTerms: (keyof FuzzySet)[] = ['veryLow', 'low', 'medium', 'high'];
  const rules: Rule[] = [];

  for (const income of incomeTerms) {
    for (const debtLoad of debtLoadTerms) {
      for (const creditHistory of creditHistoryTerms) {
        for (const age of ageTerms) {
          const incomeScore = { veryLow: 0, low: 1, medium: 2, high: 3 }[income];
          const debtLoadScore = { veryLow: 3, low: 2, medium: 1, high: 0 }[debtLoad];
          const creditHistoryScore = { poor: 0, average: 1, good: 2 }[creditHistory];
          const ageScore = { veryLow: 0, low: 1, medium: 2, high: 1 }[age];

          const totalScore = incomeScore + debtLoadScore + creditHistoryScore + ageScore;

          let output: Rule['output'];
          let weight: number;

          if (totalScore >= 9) {
            output = 'veryHigh';
            weight = 0.95 - (10 - totalScore) * 0.05;
          } else if (totalScore >= 7) {
            output = 'high';
            weight = 0.85 - (8 - totalScore) * 0.05;
          } else if (totalScore >= 4) {
            output = 'medium';
            weight = 0.6 - (6 - totalScore) * 0.05;
          } else if (totalScore >= 2) {
            output = 'low';
            weight = 0.3 - (3 - totalScore) * 0.05;
          } else {
            output = 'veryLow';
            weight = 0.15 - (1 - totalScore) * 0.05;
          }

          rules.push({
            income,
            debtLoad,
            creditHistory,
            age,
            output,
            weight,
          });
        }
      }
    }
  }

  return rules;
};

// Все правила (192 комбинации)
const fuzzyRules: Rule[] = generateRules();

// Оптимизированная функция для оценки правил
export const evaluateRules = (
  income: FuzzySet,
  debtLoad: FuzzySet,
  creditHistory: CreditHistorySet,
  age: FuzzySet
): { probability: number; weights: Record<string, number> } => {
  const outputWeights: Record<string, number> = {
    veryLow: 0,
    low: 0,
    medium: 0,
    high: 0,
    veryHigh: 0,
  };

  // Фильтруем ненулевые термы
  const activeIncomeTerms = Object.entries(income).filter(([, value]) => value > 0).map(([term]) => term as keyof FuzzySet);
  const activeDebtLoadTerms = Object.entries(debtLoad).filter(([, value]) => value > 0).map(([term]) => term as keyof FuzzySet);
  const activeCreditHistoryTerms = Object.entries(creditHistory).filter(([, value]) => value > 0).map(([term]) => term as keyof CreditHistorySet);
  const activeAgeTerms = Object.entries(age).filter(([, value]) => value > 0).map(([term]) => term as keyof FuzzySet);

  // Применяем только правила с активными термами
  fuzzyRules.forEach((rule) => {
    if (
      activeIncomeTerms.includes(rule.income) &&
      activeDebtLoadTerms.includes(rule.debtLoad) &&
      activeCreditHistoryTerms.includes(rule.creditHistory) &&
      activeAgeTerms.includes(rule.age)
    ) {
      const ruleStrength = Math.min(
        income[rule.income],
        debtLoad[rule.debtLoad],
        creditHistory[rule.creditHistory],
        age[rule.age]
      );

      outputWeights[rule.output] = Math.max(outputWeights[rule.output], ruleStrength * rule.weight);
    }
  });

  // Дефаззификация
  const probability =
    (outputWeights.veryLow * 10 +
      outputWeights.low * 30 +
      outputWeights.medium * 50 +
      outputWeights.high * 80 +
      outputWeights.veryHigh * 95) /
    (outputWeights.veryLow + outputWeights.low + outputWeights.medium + outputWeights.high + outputWeights.veryHigh || 1);

  return { probability, weights: outputWeights };
};