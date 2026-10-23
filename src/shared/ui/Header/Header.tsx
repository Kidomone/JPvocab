import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { RED_COLOR } from '../../config';
import { useTranslation } from '../../lib/i18n';

export const Header = () => {
  const location = useLocation();
  const { lang, setLang, toggleLang, t } = useTranslation();

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
          {t('navVocab')}
        </MuiLink>

        <MuiLink
          component={RouterLink}
          to="/login"
          sx={{
            color: '#FFFFFF',
            fontSize: '0.95rem',
            fontWeight: 500,
            textDecoration: location.pathname === '/login' ? 'underline' : 'none',
            textUnderlineOffset: '4px',
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 0.85,
              textDecoration: 'underline',
            },
          }}
        >
          Kidomone
        </MuiLink>

        <Box
          onClick={toggleLang}
          role="button"
          tabIndex={0}
          aria-label={lang === 'ru' ? 'Switch to English' : 'Переключить на русский'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleLang();
            }
          }}
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: 72,
            height: 28,
            backgroundColor: 'rgba(0, 0, 0, 0.28)',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            borderRadius: '14px',
            p: '2px',
            cursor: 'pointer',
            userSelect: 'none',
            overflow: 'hidden',
            transition: 'border-color 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'rgba(0, 0, 0, 0.36)',
            },
            '&:focus-visible': {
              outline: '2px solid #FFFFFF',
              outlineOffset: 2,
            },
          }}
          title={lang === 'ru' ? 'Switch to English' : 'Переключить на русский'}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 2,
              bottom: 2,
              left: 2,
              width: 34,
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.25)',
              transform: lang === 'ru' ? 'translateX(0)' : 'translateX(34px)',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.25, 0.64, 1)',
              pointerEvents: 'none',
            }}
          />

          <Box
            component="span"
            onClick={(e) => {
              e.stopPropagation();
              setLang('ru');
            }}
            sx={{
              flex: 1,
              textAlign: 'center',
              fontSize: '0.72rem',
              fontWeight: 700,
              zIndex: 1,
              letterSpacing: '0.4px',
              color: lang === 'ru' ? RED_COLOR : 'rgba(255, 255, 255, 0.85)',
              transition: 'color 0.25s ease',
              lineHeight: '24px',
            }}
          >
            RU
          </Box>

          <Box
            component="span"
            onClick={(e) => {
              e.stopPropagation();
              setLang('en');
            }}
            sx={{
              flex: 1,
              textAlign: 'center',
              fontSize: '0.72rem',
              fontWeight: 700,
              zIndex: 1,
              letterSpacing: '0.4px',
              color: lang === 'en' ? RED_COLOR : 'rgba(255, 255, 255, 0.85)',
              transition: 'color 0.25s ease',
              lineHeight: '24px',
            }}
          >
            EN
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
