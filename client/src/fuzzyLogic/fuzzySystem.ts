import { CreditInput, CreditOutput } from '../types';

//Функции принадлежности для дохода
const incomeMembership = (income: number) => ({
  low: Math.max(0, Math.min(1, (income - 50_000) / 50_000)), //до 50_000 - низкий
  medium: Math.max(0, Math.min(1, (income - 50_000) / 50_000, (150_000 - income) / 100_000 )), //50_000-150_000
  high: Math.max(0, Math.min(1, (income - 100_000)/ 100_000)), //от 100_000 - высокий
});

//Функции принадлежности для долговой нагрузки
const debtLoadMembership = (debtLoad: number) => ({
  low: Math.max(0, Math.min(1, (10_000 - debtLoad)/ 10_000)), //До 10_000 - низкая
  medium: Math.max(0, Math.min(1, (debtLoad - 10_000)/10_000, (30_000 - debtLoad)/ 20_000)), //10_000-30_000
  high: Math.max(0, Math.min(1, (debtLoad - 20_000) / 20_000)), //От 20_000 - высокая
})

//Функция принадлежности для кредитной истории
const creditHistoryMembership = (history: 'poor' | 'average' | 'good') => ({
  poor: history === 'poor' ? 1: 0,
  average: history === 'average' ? 1: 0,
  good: history === 'good' ? 1: 0,
})

//Правила вывода (упрощенные)
const evaluateRules = (
  income: {low: number; medium: number; high: number},
  debtLoad: {low: number; medium: number; high: number},
  creditHistory: {poor: number; average: number; good: number},
) => {
  //Пример правил:
  //1. Если доход высокий И долг низкий И история хорошая => высокая вероятность
  //2. Если доход низкий ИЛИ долг высокий ИЛИ история плохая => низкая вероятность

  const highProbability = Math.min(income.high, debtLoad.low, creditHistory.good);
  const mediumProbability = Math.min(income.medium, debtLoad.medium, creditHistory.average);
  const lowProbability = Math.max(income.low, debtLoad.high, creditHistory.poor);

  //Взвешанное среднее для вероятности
  const approvalProbability = 
    (highProbability * 90 + mediumProbability * 50 + lowProbability * 20) /
    (highProbability + mediumProbability + lowProbability || 1);

  return approvalProbability;
}

export const calculateCredit = (input: CreditInput): CreditOutput => {

  const income = incomeMembership(input.income);
  const debtLoad = debtLoadMembership(input.debtLoad);
  const creditHistory = creditHistoryMembership(input.creditHistory);

  const approvalProbability = evaluateRules(income, debtLoad, creditHistory);

  //Рекомендуемая сумма (упрощённая формула)
  const recommendedAmount = input.income * (approvalProbability/100) * 50;

  return {
    approvalProbability: Math.round(approvalProbability),
    recommendedAmount: Math.round(recommendedAmount),
  };
};
