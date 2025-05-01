import { TextField, Select, MenuItem, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setOutput, updateInput } from '../store/slices/creditSlice';

// Заглушка для нечёткой логики
const calculateCredit = (input: {
  income: number;
  creditHistory: 'poor' | 'average' | 'good';
  debtLoad: number;
}) => ({
  approvalProbability: 50, // Заглушка
  recommendedAmount: input.income * 3, // Пример
});

const CreditForm = () => {
  const dispatch = useDispatch();
  const input = useSelector((state: RootState) => state.credit.input);

  const handleSubmit = () => {
    const output = calculateCredit(input);
    dispatch(setOutput(output));
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '400px',
      }}
    >
      <TextField
        label="Доход"
        type="number"
        value={input.income}
        onChange={(e) =>
          dispatch(updateInput({ income: Number(e.target.value) }))
        }
      />
      <Select
        value={input.creditHistory}
        onChange={(e) =>
          dispatch(
            updateInput({
              creditHistory: e.target.value as 'poor' | 'average' | 'good',
            })
          )
        }
      >
        <MenuItem value="poor">Плохая</MenuItem>
        <MenuItem value="average">Средняя</MenuItem>
        <MenuItem value="good">Хорошая</MenuItem>
      </Select>
      <TextField
        label="Долговая нагрузка"
        type="number"
        value={input.debtLoad}
        onChange={(e) =>
          dispatch(updateInput({ debtLoad: Number(e.target.value) }))
        }
      />
      <Button variant="contained" onClick={handleSubmit}>
        Рассчитать
      </Button>
    </div>
  );
};
export default CreditForm;
