import { TextField, Select, MenuItem, Button, Typography, Slider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setOutput, updateInput } from '../store/slices/creditSlice';
import { calculateCredit } from '../fuzzyLogic/fuzzySystem';
import { useEffect } from 'react';

const CreditForm = () => {
  const dispatch = useDispatch();
  const input = useSelector((state: RootState) => state.credit.input);

  // Обновляем результаты при изменении входных данных
  useEffect(() => {
    if (input.income > 0 || input.debtLoad > 0 || input.age > 0) {
      const output = calculateCredit(input);
      dispatch(setOutput(output));
    }
  }, [input, dispatch]);

  // Обновляем результаты при изменении входных данных (кнопка)
  const handleSubmit = () => {
    const output = calculateCredit(input);
    dispatch(setOutput(output));
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '400px',
      }}
    >
      <Typography variant="h4">
        Кредитный калькулятор
      </Typography>
      {/* Доход (руб.) */}
      <div>
        <Typography>Доход (руб.)</Typography>
        <TextField
          style={{ width: '400px' }}
          type="number"
          value={input.income}
          onChange={(e) =>
            dispatch(updateInput({ income: Number(e.target.value) }))
          }
        />
        <Slider
          value={input.income}
          onChange={(_, value) => dispatch(updateInput({ income: value as number }))}
          min={0}
          max={200_000}
          step={1_000}
          valueLabelDisplay='auto'
        />
      </div>

      {/* Кредитная история */}
      <div>
        <Typography gutterBottom>Кредитная история</Typography>
        <Select
          value={input.creditHistory}
          onChange={(e) =>
            dispatch(updateInput({ creditHistory: e.target.value as 'poor' | 'average' | 'good' }))
          }
          fullWidth
        >
          <MenuItem value="poor">Плохая</MenuItem>
          <MenuItem value="average">Средняя</MenuItem>
          <MenuItem value="good">Хорошая</MenuItem>
        </Select>
      </div>

      {/* Долговая нагрузка */}
      <div>
        <Typography gutterBottom>Долговая нагрузка (руб.)</Typography>
        <TextField
          style={{ width: '400px' }}
          type="number"
          value={input.debtLoad}
          onChange={(e) =>
            dispatch(updateInput({ debtLoad: Number(e.target.value) }))
          }
        />
        <Slider
          value={input.debtLoad}
          onChange={(_, value) => dispatch(updateInput({ debtLoad: value as number }))}
          min={0}
          max={50000}
          step={1000}
          valueLabelDisplay="auto"
        />
      </div>

      {/* Возраст */}
      <div>
        <Typography gutterBottom>Возраст (лет)</Typography>
        <TextField
          style={{}}
          type='number'
          value={input.age}
          onChange={(e) => dispatch(updateInput({age: Number(e.target.value)}))}
        />
        <Slider
          value={input.age}
          onChange={(_,value) => dispatch(updateInput({age: value as number}))}
          min={18}
          max={70}
          step={1}
          valueLabelDisplay='auto'
        />
        
      </div>
      
      <Button variant="contained" onClick={handleSubmit}>
        Рассчитать
      </Button>
    </div>
  );
};
export default CreditForm;
