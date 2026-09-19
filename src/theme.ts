import { createTheme } from '@mui/material/styles';

export const RED_COLOR = '#990F0F';

export const theme = createTheme({
  palette: {
    primary: {
      main: RED_COLOR,
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111111',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Noto Sans JP', sans-serif",
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
  },
});
