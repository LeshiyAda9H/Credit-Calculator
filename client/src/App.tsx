import { Provider } from 'react-redux';
import store from './store';
import CreditForm from './components/CreditForm';
import CreditResult from './components/CreditResult';
import { Container } from '@mui/material';

export default function App() {
  return (
    <Provider store={store}>
      <Container>
        <div style={{ width: '100vh', display: 'flex', gap: '100px', justifyContent:'space-between', margin:'10vh 0'}}>
          
          <div 
          // style={{ position:'fixed'}}
          >
            <CreditForm />
          </div>
          
          <div style={{ minWidth:'70vh' }}>
            <CreditResult />
          </div>

        </div>

      </Container>
    </Provider>
  );
}
