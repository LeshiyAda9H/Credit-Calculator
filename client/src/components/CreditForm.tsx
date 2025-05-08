import { Box, TextField, Select, MenuItem, Typography, Slider, Divider, Fade, Stack, Tooltip as MuiTooltip, InputAdornment } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setOutput, updateInput } from '../store/slices/creditSlice';
import { calculateCredit } from '../fuzzyLogic/fuzzySystem';
import { useEffect } from 'react';
import { MonetizationOn, History, AccountBalance, Person } from '@mui/icons-material';

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

  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          width: '100%', // Полная ширина внутри flex
          maxWidth: { xs: '100%', sm: 400 }, // Ограничение ширины на десктопе
          mx: 'auto', // Центрирование
        }}
      >
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 2,
            }}
          >
            Кредитный калькулятор
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={3} sx={{ width: '100%' }}>
            {/* Доход (руб.) */}
            <Box>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Доход (руб.)
              </Typography>
              <MuiTooltip title="Введите ваш месячный доход">
                <TextField
                  fullWidth
                  type="number"
                  value={input.income}
                  onChange={(e) => dispatch(updateInput({ income: Number(e.target.value) }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MonetizationOn color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1 }}
                />
              </MuiTooltip>
              <Slider
                value={input.income}
                onChange={(_, value) => dispatch(updateInput({ income: value as number }))}
                min={0}
                max={200_000}
                step={1_000}
                valueLabelDisplay="auto"
                sx={{ width: '100%' }}
              />
            </Box>

            {/* Кредитная история */}
            <Box>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Кредитная история
              </Typography>
              <MuiTooltip title="Выберите состояние вашей кредитной истории">
                <Select
                  fullWidth
                  value={input.creditHistory}
                  onChange={(e) =>
                    dispatch(
                      updateInput({
                        creditHistory: e.target.value as 'poor' | 'average' | 'good',
                      })
                    )
                  }
                  startAdornment={
                    <InputAdornment position="start">
                      <History color="primary" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="poor">Плохая</MenuItem>
                  <MenuItem value="average">Средняя</MenuItem>
                  <MenuItem value="good">Хорошая</MenuItem>
                </Select>
              </MuiTooltip>
            </Box>

            {/* Долговая нагрузка */}
            <Box>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Долговая нагрузка (руб.)
              </Typography>
              <MuiTooltip title="Введите сумму текущих долговых обязательств">
                <TextField
                  fullWidth
                  type="number"
                  value={input.debtLoad}
                  onChange={(e) => dispatch(updateInput({ debtLoad: Number(e.target.value) }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountBalance color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1 }}
                />
              </MuiTooltip>
              <Slider
                value={input.debtLoad}
                onChange={(_, value) => dispatch(updateInput({ debtLoad: value as number }))}
                min={0}
                max={50_000}
                step={1_000}
                valueLabelDisplay="auto"
                sx={{ width: '100%' }}
              />
            </Box>

            {/* Возраст */}
            <Box>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Возраст (лет)
              </Typography>
              <MuiTooltip title="Введите ваш возраст">
                <TextField
                  fullWidth
                  type="number"
                  value={input.age}
                  onChange={(e) => dispatch(updateInput({ age: Number(e.target.value) }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1 }}
                />
              </MuiTooltip>
              <Slider
                value={input.age}
                onChange={(_, value) => dispatch(updateInput({ age: value as number }))}
                min={18}
                max={70}
                step={1}
                valueLabelDisplay="auto"
                sx={{ width: '100%' }}
              />
            </Box>
          </Stack>
        </Box>
      </Box>
    </Fade>
  );
};
export default CreditForm;
