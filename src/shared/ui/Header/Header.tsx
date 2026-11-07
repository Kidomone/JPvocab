import { useState, type MouseEvent } from 'react';
import { Box, Typography, Link as MuiLink, Popover } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { RED_COLOR } from '../../config';
import { useTranslation } from '../../lib/i18n';
import { useAuth } from '../../../features/auth';

export const Header = () => {
  const location = useLocation();
  const { lang, toggleLang, t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    logout();
  };

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
          }}
        >
          JPVocab
        </Typography>
      </RouterLink>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 3 } }}>
        {/* Vocab */}
        <MuiLink
          component={RouterLink}
          to="/vocab"
          sx={{
            color: '#FFFFFF',
            fontSize: '0.95rem',
            fontWeight: 500,
            textDecoration: location.pathname === '/vocab' ? 'underline' : 'none',
            textUnderlineOffset: '4px',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {t('navVocab')}
        </MuiLink>

        {/* User */}
        {isAuthenticated && user ? (
          <>
            <Box
              component="button"
              type="button"
              onClick={handleOpenMenu}
              aria-label="User menu"
              aria-expanded={isMenuOpen}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.6,
                background: 'transparent',
                border: 'none',
                p: 0,
                cursor: 'pointer',
                color: '#FFFFFF',
                userSelect: 'none',
                '&:hover .user-name': {
                  textDecoration: 'underline',
                },
              }}
            >
              <Typography
                className="user-name"
                sx={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  maxWidth: 150,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                  textUnderlineOffset: '4px',
                }}
              >
                {user.username}
              </Typography>
              <Box
                component="span"
                sx={{
                  fontSize: '0.72rem',
                  opacity: 0.8,
                  lineHeight: 1,
                }}
              >
                ▾
              </Box>
            </Box>

            <Popover
              open={isMenuOpen}
              anchorEl={anchorEl}
              onClose={handleCloseMenu}
              transitionDuration={0}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    mt: 1,
                    backgroundColor: '#FFFFFF',
                    color: '#111111',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)',
                    p: '4px',
                    minWidth: 130,
                  },
                },
              }}
            >
              <Box
                component="button"
                type="button"
                onClick={handleLogout}
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                  background: 'transparent',
                  border: 'none',
                  px: 1.5,
                  py: 1,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#DC2626',
                  textAlign: 'left',
                  transition: 'color 0.15s ease',
                  '&:hover': {
                    color: '#991B1B',
                    '& .logout-text': {
                      textDecoration: 'underline',
                    },
                  },
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <Typography
                  className="logout-text"
                  sx={{
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: 'inherit',
                    fontFamily: "'Inter', sans-serif",
                    textUnderlineOffset: '3px',
                  }}
                >
                  {t('navLogout')}
                </Typography>
              </Box>
            </Popover>
          </>
        ) : (
          <MuiLink
            component={RouterLink}
            to="/login"
            sx={{
              color: '#FFFFFF',
              fontSize: '0.95rem',
              fontWeight: 500,
              textDecoration: location.pathname === '/login' ? 'underline' : 'none',
              textUnderlineOffset: '4px',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {t('navLoginDefault')}
          </MuiLink>
        )}

        {/* Language change */}
        <Box
          component="button"
          type="button"
          onClick={toggleLang}
          sx={{
            background: 'transparent',
            border: 'none',
            p: 0,
            cursor: 'pointer',
            color: '#FFFFFF',
            fontSize: '0.92rem',
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '0.5px',
            userSelect: 'none',
            '&:hover': {
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
            },
          }}
          title={lang === 'ru' ? 'Switch to English' : 'Переключить на русский'}
        >
          {lang === 'ru' ? 'RU' : 'EN'}
        </Box>
      </Box>
    </Box>
  );
};
