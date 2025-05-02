import { Provider } from 'react-redux';
import store from './store';
import CreditForm from './components/CreditForm';
import CreditResult from './components/CreditResult';
import { Container, Grid, Box, ThemeProvider, Paper } from '@mui/material';
import theme from './theme';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>

        <Container maxWidth="xl" disableGutters sx={{ backgroundColor: '#f5f5f5', p: 3, borderRadius: 2 }}>
          {/* <Box sx={{ my: 4 }}>

            <Grid container spacing={4}>

              <Grid item xs={12} md={4}>
                <Paper elevation={3}>
                  <CreditForm />
                </Paper>
              </Grid>

              <Grid item xs={12} md={8}>
                <Paper elevation={3}>
                  <CreditResult />
                </Paper>
              </Grid>
              
            </Grid>

          </Box> */}

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <Box sx={{ flex: { md: 1 } }}><Paper><CreditForm /></Paper></Box>
            <Box sx={{ flex: { md: 2 } }}><Paper><CreditResult /></Paper></Box>
          </Box>
          
        </Container>
      </ThemeProvider>

    </Provider>
  );
}
