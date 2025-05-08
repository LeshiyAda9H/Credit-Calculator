import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  Typography,
  Divider,
  Tabs,
  Tab,
  Box,
  Fade,
  Stack,
  LinearProgress,
  Tooltip as MuiTooltip,
} from '@mui/material';
import {
  MonetizationOn,
  AccountBalance,
  Person,
  TrendingUp,
  TrendingDown,
  Timeline,
  History,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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

// Генерация данных для графика зависимости вероятности от кредитной истории
const generateCreditHistoryGraphData = (input: { income: number; debtLoad: number; age: number }) => {
  const creditHistories: ('poor' | 'average' | 'good')[] = ['poor', 'average', 'good'];
  const data = creditHistories.map((creditHistory) => {
    const output = calculateCredit({ income: input.income, creditHistory, debtLoad: input.debtLoad, age: input.age });
    return { creditHistory, probability: output.approvalProbability };
  });
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

// Генерация данных для функций принадлежности вероятности
const generateProbabilityMembershipData = () => {
  const data = [];
  for (let probability = 0; probability <= 100; probability += 2) {
    const membership = {
      low: Math.max(0, Math.min(1, (40 - probability) / 40)),
      medium: Math.max(0, Math.min(1, (probability - 20) / 30, (80 - probability) / 30)),
      high: Math.max(0, Math.min(1, (probability - 60) / 40)),
    };
    data.push({ probability, ...membership });
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
  const [activeTab, setActiveTab] = useState(0);

  if (!output) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', mt: 10 }}>
        Введите данные для расчёта
      </Typography>
    );
  }

  const incomeGraphData = generateIncomeGraphData(input);
  const debtLoadGraphData = generateDebtLoadGraphData(input);
  const ageGraphData = generateAgeGraphData(input);
  const creditHistoryGraphData = generateCreditHistoryGraphData(input);
  const incomeMembershipData = generateIncomeMembershipData();
  const debtLoadMembershipData = generateDebtLoadMembershipData();
  const ageMembershipData = generateAgeMembershipData();
  const probabilityMembershipData = generateProbabilityMembershipData();
  const contributions = calculateContributions(input);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        maxWidth: 800,
        mx: 'auto',
        p: { xs: 2, sm: 3 },
      }}
    >
      {/* Блок результатов */}
      <Fade in timeout={800}>
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 2,
            }}
          >
            Результаты
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2} sx={{ mb: 3 }}>
            <Box>
              <Typography variant="h6" color="text.secondary">
                Вероятность одобрения
              </Typography>
              <MuiTooltip title={`${output.approvalProbability}% вероятности одобрения кредита`}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MonetizationOn color="primary" />
                  <LinearProgress
                    variant="determinate"
                    value={output.approvalProbability}
                    sx={{
                      flexGrow: 1,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'grey.300',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor:
                          output.approvalProbability > 50 ? 'success.main' : 'warning.main',
                      },
                    }}
                  />
                  <Typography variant="body1" fontWeight="bold">
                    {output.approvalProbability}%
                  </Typography>
                </Box>
              </MuiTooltip>
            </Box>

            <Box>
              <Typography variant="h6" color="text.secondary">
                Рекомендуемая сумма
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalance color="primary" />
                <Typography variant="body1" fontWeight="bold">
                  {output.recommendedAmount.toLocaleString()} руб.
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Вклад переменных
          </Typography>
          <Stack spacing={1.5}>
            {[
              { label: 'Доход', value: contributions.income, icon: <MonetizationOn /> },
              { label: 'Долговая нагрузка', value: contributions.debtLoad, icon: <AccountBalance /> },
              { label: 'Кредитная история', value: contributions.creditHistory, icon: <History /> },
              { label: 'Возраст', value: contributions.age, icon: <Person /> },
            ].map((item, index) => (
              <Box key={index}>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <MuiTooltip title={`${item.label}: ${item.value.toFixed(1)}% влияния`}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.icon}
                    <LinearProgress
                      variant="determinate"
                      value={item.value}
                      sx={{
                        flexGrow: 1,
                        height: 6,
                        borderRadius: 4,
                        backgroundColor: 'grey.300',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: 'info.main',
                        },
                      }}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {item.value.toFixed(1)}%
                    </Typography>
                  </Box>
                </MuiTooltip>
              </Box>
            ))}
          </Stack>
        </Box>
      </Fade>

      <Divider />

      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Переключение графиков"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                flex: 1,
                minWidth: { xs: '80px', sm: '100px' },
                maxWidth: { xs: '120px', sm: '150px' },
                padding: { xs: '8px', sm: '12px' },
                fontSize: { xs: '0.75rem', sm: '0.75rem' },
              },
              '& .MuiTabs-flexContainer': {
                justifyContent: 'space-between',
                gap: { xs: '4px', sm: '8px' },
              },
            }}
          >
            <Tab icon={<MonetizationOn />} label="Доход" />
            <Tab icon={<AccountBalance />} label="Долг" />
            <Tab icon={<Person />} label="Возраст" />
            <Tab icon={<History />} label="История" />
            <Tab icon={<TrendingUp />} label="Фун. дохода" />
            <Tab icon={<TrendingDown />} label="Фун. долга" />
            <Tab icon={<Timeline />} label="Фун. возраста" />
            <Tab icon={<TrendingUp />} label="Фун. вероятности" />
          </Tabs>
        </Box>
      </Box>

      <Divider />

      <Fade in={true} timeout={500}>
        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && (
            <div>
              <Typography variant="subtitle1" textAlign="center">
                Зависимость вероятности одобрения от дохода
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={incomeGraphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="income" tickFormatter={(value) => `${value / 1000}k`} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} labelFormatter={(value) => `Доход: ${value}`} />
                  <Legend />
                  <Line type="monotone" dataKey="probability" name="Вероятность" stroke="#8884d8" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <Typography variant="subtitle1" textAlign="center">
                Зависимость вероятности одобрения от долговой нагрузки
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={debtLoadGraphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="debtLoad" tickFormatter={(value) => `${value / 1000}k`} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} labelFormatter={(value) => `Долг: ${value}`} />
                  <Legend />
                  <Line type="monotone" dataKey="probability" name="Вероятность" stroke="#82ca9d" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <Typography variant="subtitle1" textAlign="center">
                Зависимость вероятности одобрения от возраста
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ageGraphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} labelFormatter={(value) => `Возраст: ${value}`} />
                  <Legend />
                  <Line type="monotone" dataKey="probability" name="Вероятность" stroke="#ffc107" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <Typography variant="subtitle1" textAlign="center">
                Зависимость вероятности одобрения от кредитной истории
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={creditHistoryGraphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="creditHistory" tickFormatter={(value) => value === 'poor' ? 'Плохая' : value === 'average' ? 'Средняя' : 'Хорошая'} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} labelFormatter={(value) => `История: ${value}`} />
                  <Legend />
                  <Line type="monotone" dataKey="probability" name="Вероятность" stroke="#ff7300" dot={true} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {activeTab === 4 && (
            <div>
              <Typography variant="subtitle1" textAlign="center">
                Функции принадлежности для дохода
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={incomeMembershipData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="income" tickFormatter={(value) => `${value / 1000}k`} />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="veryLow" name="Очень низкий" stroke="#ff7300" dot={false} />
                  <Line type="monotone" dataKey="low" name="Низкий" stroke="#387908" dot={false} />
                  <Line type="monotone" dataKey="medium" name="Средний" stroke="#8884d8" dot={false} />
                  <Line type="monotone" dataKey="high" name="Высокий" stroke="#82ca9d" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {activeTab === 5 && (
            <div>
              <Typography variant="subtitle1" textAlign="center">
                Функции принадлежности для долговой нагрузки
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={debtLoadMembershipData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="debtLoad" tickFormatter={(value) => `${value / 1000}k`} />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="veryLow" name="Очень низкий" stroke="#ff7300" dot={false} />
                  <Line type="monotone" dataKey="low" name="Низкий" stroke="#387908" dot={false} />
                  <Line type="monotone" dataKey="medium" name="Средний" stroke="#8884d8" dot={false} />
                  <Line type="monotone" dataKey="high" name="Высокий" stroke="#82ca9d" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {activeTab === 6 && (
            <div>
              <Typography variant="subtitle1" textAlign="center">
                Функции принадлежности для возраста
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ageMembershipData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="veryLow" name="Очень низкий" stroke="#ff7300" dot={false} />
                  <Line type="monotone" dataKey="low" name="Низкий" stroke="#387908" dot={false} />
                  <Line type="monotone" dataKey="medium" name="Средний" stroke="#8884d8" dot={false} />
                  <Line type="monotone" dataKey="high" name="Высокий" stroke="#82ca9d" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {activeTab === 7 && (
            <div>
              <Typography variant="subtitle1" textAlign="center">
                Функции принадлежности для вероятности
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={probabilityMembershipData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="probability" tickFormatter={(value) => `${value}%`} />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="low" name="Низкая" stroke="#ff7300" dot={false} />
                  <Line type="monotone" dataKey="medium" name="Средняя" stroke="#8884d8" dot={false} />
                  <Line type="monotone" dataKey="high" name="Высокая" stroke="#82ca9d" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default CreditResult;