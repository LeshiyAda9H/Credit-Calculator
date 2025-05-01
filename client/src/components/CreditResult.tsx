import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Typography, Divider } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateCredit } from '../fuzzyLogic/fuzzySystem';

// Генерация данных для графика зависимости вероятности от дохода
const generateIncomeGraphData = (input: { creditHistory: 'poor' | 'average' | 'good'; debtLoad: number; age: number }) => {
  const data = [];
  for (let income = 0; income <= 200_000; income += 10_000) {
    const output = calculateCredit({ income, creditHistory: input.creditHistory, debtLoad: input.debtLoad, age: input.age });
    data.push({ income, probability: output.approvalProbability });
  }
  return data;
};

// Генерация данных для графика зависимости вероятности от долговой нагрузки
const generateDebtLoadGraphData = (input: { income: number; creditHistory: 'poor' | 'average' | 'good'; age: number }) => {
  const data = [];
  for (let debtLoad = 0; debtLoad <= 50_000; debtLoad += 2_000) {
    const output = calculateCredit({ income: input.income, creditHistory: input.creditHistory, debtLoad, age: input.age });
    data.push({ debtLoad, probability: output.approvalProbability });
  }
  return data;
};

// Генерация данных для графика зависимости вероятности от возраста
const generateAgeGraphData = (input: { income: number; creditHistory: 'poor' | 'average' | 'good'; debtLoad: number }) => {
  const data = [];
  for (let age = 18; age <= 70; age += 2) {
    const output = calculateCredit({ income: input.income, creditHistory: input.creditHistory, debtLoad: input.debtLoad, age });
    data.push({ age, probability: output.approvalProbability });
  }
  return data;
};

// Генерация данных для функций принадлежности дохода
const generateIncomeMembershipData = () => {
  const data = [];
  for (let income = 0; income <= 200_000; income += 5_000) {
    const membership = {
      veryLow: Math.max(0, Math.min(1, (30000 - income) / 30000)),
      low: Math.max(0, Math.min(1, (income - 20000) / 20000, (60000 - income) / 40000)),
      medium: Math.max(0, Math.min(1, (income - 50000) / 30000, (120000 - income) / 70000)),
      high: Math.max(0, Math.min(1, (income - 100000) / 50000)),
    };
    data.push({ income, ...membership });
  }
  return data;
};

// Генерация данных для функций принадлежности долговой нагрузки
const generateDebtLoadMembershipData = () => {
  const data = [];
  for (let debtLoad = 0; debtLoad <= 50_000; debtLoad += 1_000) {
    const membership = {
      veryLow: Math.max(0, Math.min(1, (5000 - debtLoad) / 5000)),
      low: Math.max(0, Math.min(1, (debtLoad - 3000) / 5000, (15000 - debtLoad) / 12000)),
      medium: Math.max(0, Math.min(1, (debtLoad - 10000) / 10000, (30000 - debtLoad) / 20000)),
      high: Math.max(0, Math.min(1, (debtLoad - 25000) / 15000)),
    };
    data.push({ debtLoad, ...membership });
  }
  return data;
};

// Генерация данных для функций принадлежности возраста
const generateAgeMembershipData = () => {
  const data = [];
  for (let age = 18; age <= 70; age += 1) {
    const membership = {
      veryLow: Math.max(0, Math.min(1, (25 - age) / 7)),
      low: Math.max(0, Math.min(1, (age - 20) / 10, (35 - age) / 15)),
      medium: Math.max(0, Math.min(1, (age - 30) / 10, (50 - age) / 20)),
      high: Math.max(0, Math.min(1, (age - 45) / 15)),
    };
    data.push({ age, ...membership });
  }
  return data;
};

// Вычисление вклада переменных
const calculateContributions = (input: { income: number; debtLoad: number; creditHistory: 'poor' | 'average' | 'good'; age: number }) => {
  const incomeMembership = {
    veryLow: Math.max(0, Math.min(1, (30000 - input.income) / 30000)),
    low: Math.max(0, Math.min(1, (input.income - 20000) / 20000, (60000 - input.income) / 40000)),
    medium: Math.max(0, Math.min(1, (input.income - 50000) / 30000, (120000 - input.income) / 70000)),
    high: Math.max(0, Math.min(1, (input.income - 100000) / 50000)),
  };
  const debtLoadMembership = {
    veryLow: Math.max(0, Math.min(1, (5000 - input.debtLoad) / 5000)),
    low: Math.max(0, Math.min(1, (input.debtLoad - 3000) / 5000, (15000 - input.debtLoad) / 12000)),
    medium: Math.max(0, Math.min(1, (input.debtLoad - 10000) / 10000, (30000 - input.debtLoad) / 20000)),
    high: Math.max(0, Math.min(1, (input.debtLoad - 25000) / 15000)),
  };
  const creditHistoryMembership = {
    poor: input.creditHistory === 'poor' ? 1 : 0,
    average: input.creditHistory === 'average' ? 1 : 0,
    good: input.creditHistory === 'good' ? 1 : 0,
  };
  const ageMembership = {
    veryLow: Math.max(0, Math.min(1, (25 - input.age) / 7)),
    low: Math.max(0, Math.min(1, (input.age - 20) / 10, (35 - input.age) / 15)),
    medium: Math.max(0, Math.min(1, (input.age - 30) / 10, (50 - input.age) / 20)),
    high: Math.max(0, Math.min(1, (input.age - 45) / 15)),
  };

  // Оцениваем вклад каждой переменной
  const incomeContribution = Math.max(...Object.values(incomeMembership)) * (input.income >= 100000 ? 0.4 : input.income >= 50000 ? 0.3 : 0.2);
  const debtLoadContribution = Math.max(...Object.values(debtLoadMembership)) * (input.debtLoad <= 5000 ? 0.3 : input.debtLoad <= 15000 ? 0.2 : 0.1);
  const creditHistoryContribution = Math.max(...Object.values(creditHistoryMembership)) * (input.creditHistory === 'good' ? 0.3 : input.creditHistory === 'average' ? 0.2 : 0.1);
  const ageContribution = Math.max(...Object.values(ageMembership)) * (input.age >= 30 && input.age <= 50 ? 0.2 : 0.1);

  const total = incomeContribution + debtLoadContribution + creditHistoryContribution + ageContribution || 1;

  return {
    income: (incomeContribution / total) * 100,
    debtLoad: (debtLoadContribution / total) * 100,
    creditHistory: (creditHistoryContribution / total) * 100,
    age: (ageContribution / total) * 100,
  };
};


const CreditResult = () => {
  const { input, output } = useSelector((state: RootState) => state.credit);

  if (!output) {
    return (
      <Typography variant='h6' style={{ display: 'grid', placeItems: 'center', margin: '230px auto' }}>
        Введите данные для расчёта
      </Typography>
    );
  }

  const incomeGraphData = generateIncomeGraphData(input);
  const debtLoadGraphData = generateDebtLoadGraphData(input);
  const ageGraphData = generateAgeGraphData(input);
  const incomeMembershipData = generateIncomeMembershipData();
  const debtLoadMembershipData = generateDebtLoadMembershipData();
  const ageMembershipData = generateAgeMembershipData();
  const contributions = calculateContributions(input);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Typography variant="h4">Результаты:</Typography>

      <div>
        <Typography>Вероятность одобрения: {output.approvalProbability}%</Typography>
        <Typography>Рекомендуемая сумма: {output.recommendedAmount} руб.</Typography>
      </div>

      <Divider />

      <div>
        <Typography variant="subtitle1">Вклад переменных в результат:</Typography>
        <Typography>Доход: {contributions.income.toFixed(1)}%</Typography>
        <Typography>Долговая нагрузка: {contributions.debtLoad.toFixed(1)}%</Typography>
        <Typography>Кредитная история: {contributions.creditHistory.toFixed(1)}%</Typography>
        <Typography>Возраст: {contributions.age.toFixed(1)}%</Typography>
      </div>

      <Divider />

      <div>
        <Typography variant="subtitle1">Зависимость вероятности одобрения от дохода:</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={incomeGraphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="income" tickFormatter={(value) => `${value / 1000}k`} />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => `${value}%`} labelFormatter={(value) => `Доход: ${value}`} />
            <Line type="monotone" dataKey="probability" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <Typography variant="subtitle1">Зависимость вероятности одобрения от долговой нагрузки:</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={debtLoadGraphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="debtLoad" tickFormatter={(value) => `${value / 1000}k`} />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => `${value}%`} labelFormatter={(value) => `Долг: ${value}`} />
            <Line type="monotone" dataKey="probability" stroke="#82ca9d" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <Typography variant="subtitle1">Зависимость вероятности одобрения от возраста:</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ageGraphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => `${value}%`} labelFormatter={(value) => `Возраст: ${value}`} />
            <Line type="monotone" dataKey="probability" stroke="#ffc107" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Divider />

      <div>
        <Typography variant="subtitle1">Функции принадлежности для дохода:</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={incomeMembershipData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="income" tickFormatter={(value) => `${value / 1000}k`} />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line type="monotone" dataKey="veryLow" stroke="#ff7300" dot={false} />
            <Line type="monotone" dataKey="low" stroke="#387908" dot={false} />
            <Line type="monotone" dataKey="medium" stroke="#8884d8" dot={false} />
            <Line type="monotone" dataKey="high" stroke="#82ca9d" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <Typography variant="subtitle1">Функции принадлежности для долговой нагрузки:</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={debtLoadMembershipData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="debtLoad" tickFormatter={(value) => `${value / 1000}k`} />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line type="monotone" dataKey="veryLow" stroke="#ff7300" dot={false} />
            <Line type="monotone" dataKey="low" stroke="#387908" dot={false} />
            <Line type="monotone" dataKey="medium" stroke="#8884d8" dot={false} />
            <Line type="monotone" dataKey="high" stroke="#82ca9d" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <Typography variant="subtitle1">Функции принадлежности для возраста:</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ageMembershipData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line type="monotone" dataKey="veryLow" stroke="#ff7300" dot={false} />
            <Line type="monotone" dataKey="low" stroke="#387908" dot={false} />
            <Line type="monotone" dataKey="medium" stroke="#8884d8" dot={false} />
            <Line type="monotone" dataKey="high" stroke="#82ca9d" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CreditResult;
