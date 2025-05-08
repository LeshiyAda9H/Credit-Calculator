import { Provider } from 'react-redux';
import store from './store';
import CreditForm from './components/CreditForm';
import CreditResult from './components/CreditResult';
import { Container, Box, ThemeProvider, Paper } from '@mui/material';
import theme from './theme';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {/* Основной Box на экране */}
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start', // Изменено с center на flex-start для скроллинга
            // pt: { xs: 2, sm: 4 }, // Отступ сверху для sticky
          }}
        >
          {/* Формат заполнения контейнера */}
          <Container
            maxWidth="xl"
            disableGutters
            sx={{
              backgroundColor: '#f5f5f5',
              p: { xs: 2, sm: 2 },
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
              }}
            >
              <Box
                sx={{
                  flex: { md: 1 },
                  position: { md: 'sticky' }, // Sticky только на десктопе
                  top: { md: 8 }, // Отступ от верха (учитываем pt контейнера)
                  alignSelf: { md: 'flex-start' }, // Чтобы sticky работал корректно
                }}
              >
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                  <CreditForm />
                </Paper>
              </Box>

              <Box sx={{ flex: { md: 2 } }}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <CreditResult />
                </Paper>
              </Box>

            </Box>
          </Container>
        </Box>
      </ThemeProvider >
    </Provider >
  );
}
