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

        {/* Основной Box на экране*/}
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>

          {/* Формат заполнения контейнера */}
          <Container
            maxWidth="xl"
            disableGutters
            sx={{
              backgroundColor: '#f5f5f5',
              p: { xs: 2, sm: 2 },
              borderRadius: 2,
              boxShadow: 3,
            }}>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2
              }}>

              <Box sx={{ flex: { md: 1 } }}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <CreditForm />
                </Paper>
              </Box>

              <Box sx={{ flex: { md: 2 } }}>
                <Paper >
                  <CreditResult />
                </Paper>
              </Box>

            </Box>

          </Container>
        </Box>

      </ThemeProvider>

    </Provider>
  );
}
