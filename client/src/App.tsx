import { Provider } from 'react-redux';
import store from './store';
import CreditForm from './components/CreditForm';
import CreditResult from './components/CreditResult';
import { Container, Typography } from '@mui/material';

export default function App() {
  return (
    <Provider store={store}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Кредитный калькулятор
        </Typography>
        <CreditForm />
        <CreditResult />
      </Container>
    </Provider>
  );
}
