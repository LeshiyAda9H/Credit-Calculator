export interface CreditInput {
  income: number; // Доход
  creditHistory: 'poor' | 'average' | 'good'; // Кредитная история
  debtLoad: number; // Долговая нагрузка
  age: number; // Возраст
}

export interface CreditOutput {
  approvalProbability: number; // Вероятность одобрения (0-100%)
  recommendedAmount: number; // Рекомендуемая сумма кредита
}
