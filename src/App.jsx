import React from 'react';
import { StoreProvider } from 'easy-peasy';
import store from './store';
import Modes from './components/modes/modes';

function App() {
  return (
    <StoreProvider store={store}>
      <Modes />
    </StoreProvider>
  );
}

export default App;
