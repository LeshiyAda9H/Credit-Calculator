import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreditInput, CreditOutput } from '../../types';

interface CreditState {
  input: CreditInput;
  output: CreditOutput | null;
}

const initialState: CreditState = {
  input: {
    income: 0,
    creditHistory: 'average',
    debtLoad: 0,
  },
  output: null,
};

const creditSlice = createSlice({
  name: 'credit',
  initialState,
  reducers: {
    updateInput(state, action: PayloadAction<Partial<CreditInput>>) {
      state.input = { ...state.input, ...action.payload };
    },
    setOutput(state, action: PayloadAction<CreditOutput>) {
      state.output = action.payload;
    },
  },
});

export const { updateInput, setOutput } = creditSlice.actions;
export default creditSlice.reducer;
