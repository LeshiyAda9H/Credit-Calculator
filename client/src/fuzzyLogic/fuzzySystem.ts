import { CreditInput, CreditOutput } from '../types';

export const calculateCredit = (input: CreditInput): CreditOutput => {
  //Заглушка: пока просто возвращаем фиксированные значения
  return {
    approvalProbability: 50,
    recommendedAmount: input.income * 0.3,
  };
};
