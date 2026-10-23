import { useState, type SyntheticEvent, type ChangeEvent } from 'react';
import {
  Box,
  Typography,
  Button,
  InputBase,
  Paper,
  Collapse,
  CircularProgress,
  Grow,
} from '@mui/material';
import { useTranslation } from '../../../shared';

export interface LoginFormProps {
  onSuccess?: () => void;
}

export interface LoginFormErrors {
  username?: string;
  password?: string;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { t } = useTranslation();
  const [nameInput, setNameInput] = useState('Kidomone');
  const [passwordInput, setPasswordInput] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: LoginFormErrors = {};

    const trimmedUser = nameInput.trim();
    if (!trimmedUser) {
      newErrors.username = t('errUserRequired');
    } else if (trimmedUser.length < 3) {
      newErrors.username = t('errUserShort');
    } else if (trimmedUser.length > 30) {
      newErrors.username = t('errUserLong');
    }

    if (!passwordInput) {
      newErrors.password = t('errPassRequired');
    } else if (passwordInput.length < 4) {
      newErrors.password = t('errPassShort');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: undefined }));
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleLogin = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!validate() || isLoading) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess?.();
    }, 400);
  };

  return (
    <Grow in timeout={450}>
      <Paper
        elevation={6}
        component="form"
        onSubmit={handleLogin}
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          width: '100%',
          maxWidth: 400,
          minHeight: 440,
          p: { xs: 4, sm: 5 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s ease',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: '2rem',
            color: '#1a1a1a',
            textAlign: 'center',
            mt: 2,
            mb: 5,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {t('loginTitle')}
        </Typography>

        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5, mb: 4.5 }}>
          {/* Username row */}
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Typography
                component="label"
                htmlFor="login-username"
                sx={{
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: '#333333',
                  minWidth: 80,
                }}
              >
                {t('loginUsernameLabel')}
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  backgroundColor: '#D9D9D9',
                  borderRadius: '4px',
                  px: 1.5,
                  py: 0.6,
                  transition: 'all 0.2s ease',
                  boxShadow: errors.username ? '0 0 0 2px rgba(211, 47, 47, 0.7)' : 'none',
                  '&:focus-within': {
                    backgroundColor: '#CECECE',
                    boxShadow: errors.username ? '0 0 0 2px #d32f2f' : '0 0 0 1.5px #555555',
                  },
                }}
              >
                <InputBase
                  id="login-username"
                  fullWidth
                  value={nameInput}
                  onChange={handleUsernameChange}
                  disabled={isLoading}
                  inputProps={{
                    style: {
                      fontSize: '0.95rem',
                      color: '#222222',
                    },
                  }}
                />
              </Box>
            </Box>

            <Collapse in={Boolean(errors.username)}>
              <Typography
                sx={{
                  color: '#d32f2f',
                  fontSize: '0.78rem',
                  mt: 0.6,
                  textAlign: 'right',
                  fontWeight: 500,
                }}
              >
                {errors.username}
              </Typography>
            </Collapse>
          </Box>

          {/* Password row */}
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Typography
                component="label"
                htmlFor="login-password"
                sx={{
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: '#333333',
                  minWidth: 80,
                }}
              >
                {t('loginPasswordLabel')}
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  backgroundColor: '#D9D9D9',
                  borderRadius: '4px',
                  px: 1.5,
                  py: 0.6,
                  transition: 'all 0.2s ease',
                  boxShadow: errors.password ? '0 0 0 2px rgba(211, 47, 47, 0.7)' : 'none',
                  '&:focus-within': {
                    backgroundColor: '#CECECE',
                    boxShadow: errors.password ? '0 0 0 2px #d32f2f' : '0 0 0 1.5px #555555',
                  },
                }}
              >
                <InputBase
                  id="login-password"
                  type="password"
                  fullWidth
                  value={passwordInput}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  inputProps={{
                    style: {
                      fontSize: '0.95rem',
                      color: '#222222',
                    },
                  }}
                />
              </Box>
            </Box>

            <Collapse in={Boolean(errors.password)}>
              <Typography
                sx={{
                  color: '#d32f2f',
                  fontSize: '0.78rem',
                  mt: 0.6,
                  textAlign: 'right',
                  fontWeight: 500,
                }}
              >
                {errors.password}
              </Typography>
            </Collapse>
          </Box>
        </Box>

        {/* Submit button */}
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            borderRadius: '6px',
            px: 4,
            py: 0.7,
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'lowercase',
            letterSpacing: '0.3px',
            minWidth: 100,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#222222',
            },
            '&:active': {
              transform: 'scale(0.97)',
            },
          }}
        >
          {isLoading ? <CircularProgress size={16} sx={{ color: '#FFFFFF' }} /> : t('loginSubmitBtn')}
        </Button>
      </Paper>
    </Grow>
  );
};
