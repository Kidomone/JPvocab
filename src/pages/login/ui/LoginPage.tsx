import { Box, Typography } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from '../../../shared';
import { LoginForm } from '../../../features';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { lang } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'radial-gradient(ellipse at 50% 20%, #A81212 0%, #820909 50%, #5E0505 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 },
        position: 'relative',
      }}
    >
      {/* Top back navigation */}
      <Box
        component={RouterLink}
        to="/"
        sx={{
          position: { xs: 'static', sm: 'absolute' },
          top: { sm: 24 },
          left: { sm: 32 },
          mb: { xs: 2.5, sm: 0 },
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          color: 'rgba(255, 255, 255, 0.85)',
          textDecoration: 'none',
          fontSize: '0.92rem',
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          transition: 'all 0.18s ease',
          px: 1.5,
          py: 0.75,
          borderRadius: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          '&:hover': {
            color: '#FFFFFF',
            backgroundColor: 'rgba(0, 0, 0, 0.28)',
            borderColor: 'rgba(255, 255, 255, 0.35)',
            transform: 'translateX(-2px)',
          },
        }}
      >
        <Typography component="span" sx={{ fontSize: '1.1rem', lineHeight: 1 }}>
          ←
        </Typography>
        <span>{lang === 'ru' ? 'На главную' : 'Back to home'}</span>
      </Box>

      {/* Centered Form */}
      <LoginForm onSuccess={() => navigate('/')} />
    </Box>
  );
};
