import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme, I18nProvider } from '../shared';
import { HomePage, LoginPage, ResultPage, VocabPage } from '../pages';

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <I18nProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/vocab" element={<VocabPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  );
};

export default App;
