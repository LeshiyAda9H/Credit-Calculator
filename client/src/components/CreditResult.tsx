import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CreditResult = () => {
  const output = useSelector((state: RootState) => state.credit.output);

  if (!output) {
    return <Typography>Введите данные и нажмите "Рассчитать"</Typography>;
  }

  //Данные для графика
  const data = [
    {
      name: 'Вероятность одобрения',
      probability: output.approvalProbability,
    }
  ]

  return (
    <div>
      <Typography variant="h6">Результаты:</Typography>
      <Typography>
        Вероятность одобрения: {output.approvalProbability}%
      </Typography>
      <Typography>
        Рекомендуемая сумма: {output.recommendedAmount} руб.
      </Typography>

      <div style = {{marginTop: '20px'}}>
        <Typography variant='subtitle1'>
          График вероятности:
        </Typography>
        <ResponsiveContainer width='100%' height={200}>
          <BarChart data = {data}>
            <CartesianGrid strokeDasharray='3 3'/>
            <XAxis dataKey='name'/>
            <YAxis domain={[0,100]}/>
            <Tooltip/>
            <Bar dataKey='probability' fill='#8884d8'/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CreditResult;
