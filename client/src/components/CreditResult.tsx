import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Typography } from '@mui/material';

const CreditResult = () => {
  const output = useSelector((state: RootState) => state.credit.output);

  if (!output) {
    return <Typography>Введите данные и нажмите "Рассчитать"</Typography>;
  }

  return (
    <div>
      <Typography variant="h6">Результаты:</Typography>
      <Typography>
        Вероятность одобрения: {output.approvalProbability}%
      </Typography>
      <Typography>
        Рекомендуемая сумма: {output.recommendedAmount} руб.
      </Typography>
    </div>
  );
};

export default CreditResult;
