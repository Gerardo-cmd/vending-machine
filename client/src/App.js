import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import './App.css';
import VendingMachine from './modules/VendingMachine/VendingMachine';
import Error from './modules/Error/Error';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#121111'
    },
    secondary: {
      main: '#211f1f'
    },
  }
});

const App = () => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<VendingMachine />} />
          <Route path="/error" element={<Error />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
