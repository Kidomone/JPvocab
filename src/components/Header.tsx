import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { RED_COLOR } from '../theme';

export const Header = () => {
  const location = useLocation();

  return (
    <Box
      component="header"
      sx={{
        backgroundColor: RED_COLOR,
        color: '#FFFFFF',
        height: 64,
        px: { xs: 2, sm: 4, md: 6 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        userSelect: 'none',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <RouterLink to="/" style={{ textDecoration: 'none', color: '#FFFFFF' }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 800,
            fontSize: '1.65rem',
            letterSpacing: '-0.5px',
            color: '#FFFFFF',
            fontFamily: "'Inter', sans-serif",
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 0.9,
            },
          }}
        >
          JPVocab
        </Typography>
      </RouterLink>

      {/* Navigation Links */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 3 } }}>
        <MuiLink
          component={RouterLink}
          to="/vocab"
          sx={{
            color: '#FFFFFF',
            fontSize: '0.95rem',
            fontWeight: 500,
            textDecoration: location.pathname === '/vocab' ? 'underline' : 'none',
            textUnderlineOffset: '4px',
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 0.85,
              textDecoration: 'underline',
            },
          }}
        >
          Мой Словарь
        </MuiLink>

        <MuiLink
          component={RouterLink}
          to="/login"
          sx={{
            color: '#FFFFFF',
            fontSize: '0.95rem',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 0.85,
              textDecoration: 'underline',
            },
          }}
        >
          Kidomone
        </MuiLink>
      </Box>
    </Box>
  );
};
