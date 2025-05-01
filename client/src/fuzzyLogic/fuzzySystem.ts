import { CreditInput, CreditOutput } from '../types';
import { evaluateRules } from './fuzzyRules';

// Функции принадлежности для дохода
const incomeMembership = (income: number) => ({
  veryLow: Math.max(0, Math.min(1, (30000 - income) / 30000)), // До 30,000
  low: Math.max(0, Math.min(1, (income - 20000) / 20000, (60000 - income) / 40000)), // 20,000-60,000
  medium: Math.max(0, Math.min(1, (income - 50000) / 30000, (120000 - income) / 70000)), // 50,000-120,000
  high: Math.max(0, Math.min(1, (income - 100000) / 50000)), // От 100,000
});

// Функции принадлежности для долговой нагрузки
const debtLoadMembership = (debtLoad: number) => ({
  veryLow: Math.max(0, Math.min(1, (5000 - debtLoad) / 5000)), // До 5,000
  low: Math.max(0, Math.min(1, (debtLoad - 3000) / 5000, (15000 - debtLoad) / 12000)), // 3,000-15,000
  medium: Math.max(0, Math.min(1, (debtLoad - 10000) / 10000, (30000 - debtLoad) / 20000)), // 10,000-30,000
  high: Math.max(0, Math.min(1, (debtLoad - 25000) / 15000)), // От 25,000
});

// Функции принадлежности для кредитной истории
const creditHistoryMembership = (history: 'poor' | 'average' | 'good') => ({
  poor: history === 'poor' ? 1 : 0,
  average: history === 'average' ? 1 : 0,
  good: history === 'good' ? 1 : 0,
});

// Функции принадлежности для возраста
const ageMembership = (age: number) => ({
  veryLow: Math.max(0, Math.min(1, (25 - age) / 7)), // До 25
  low: Math.max(0, Math.min(1, (age - 20) / 10, (35 - age) / 15)), // 20-35
  medium: Math.max(0, Math.min(1, (age - 30) / 10, (50 - age) / 20)), // 30-50
  high: Math.max(0, Math.min(1, (age - 45) / 15, (65 - age) / 20)), // 45-65
  veryHigh: Math.max(0, Math.min(1, (age - 60) / 10)), // От 60
});


export const calculateCredit = (input: CreditInput): CreditOutput => {

  const income = incomeMembership(input.income);
  const debtLoad = debtLoadMembership(input.debtLoad);
  const creditHistory = creditHistoryMembership(input.creditHistory);
  const age = ageMembership(input.age);

  const { probability } = evaluateRules(income, debtLoad, creditHistory, age);
  
  const ageFactor = input.age < 30 ? 0.8 : input.age > 60 ? 0.7 : 1;

  const recommendedAmount = input.income * (probability / 100) * 0.6 * ageFactor;

  return {
    approvalProbability: Math.round(probability),
    recommendedAmount: Math.round(recommendedAmount),
  };
};
