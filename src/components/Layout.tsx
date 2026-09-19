import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Header } from './Header';
import { RED_COLOR } from '../theme';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          height: 30,
          backgroundColor: RED_COLOR,
          width: '100%',
        }}
      />
    </Box>
  );
};
