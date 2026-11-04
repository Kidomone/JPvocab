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
  Alert,
} from '@mui/material';
import { useTranslation } from '../../../shared';
import { useAuth } from '../model/context';
import { AuthApiError } from '../api/authApi';

export interface LoginFormProps {
  onSuccess?: () => void;
}

export type AuthMode = 'login' | 'register';

export interface LoginFormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { t } = useTranslation();
  const { login, register, isLoading } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrors({});
    setServerError(null);
  };

  const validate = (): boolean => {
    const newErrors: LoginFormErrors = {};
    const trimmedUser = usernameInput.trim();

    if (!trimmedUser) {
      newErrors.username = t('errUserRequired');
    } else if (trimmedUser.length < 3) {
      newErrors.username = t('errUserShort');
    } else if (trimmedUser.length > 50) {
      newErrors.username = t('errUserLong');
    }

    if (mode === 'register') {
      const trimmedEmail = emailInput.trim();
      if (!trimmedEmail) {
        newErrors.email = t('errEmailRequired');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        newErrors.email = t('errEmailInvalid');
      }
    }

    if (!passwordInput) {
      newErrors.password = t('errPassRequired');
    } else if (passwordInput.length < 4) {
      newErrors.password = t('errPassShort');
    }

    if (mode === 'register' && passwordInput !== confirmPasswordInput) {
      newErrors.confirmPassword = t('errPassMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate() || isLoading) {
      return;
    }

    try {
      if (mode === 'login') {
        await login({
          username: usernameInput.trim(),
          password: passwordInput,
        });
      } else {
        await register({
          username: usernameInput.trim(),
          email: emailInput.trim(),
          password: passwordInput,
        });
      }
      onSuccess?.();
    } catch (err: unknown) {
      if (err instanceof AuthApiError) {
        setServerError(err.message);
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError(t('authErrorDefault'));
      }
    }
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(e.target.value);
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: undefined }));
    }
    if (serverError) setServerError(null);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
    if (serverError) setServerError(null);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
    if (serverError) setServerError(null);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPasswordInput(e.target.value);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
    if (serverError) setServerError(null);
  };

  return (
    <Grow in timeout={450}>
      <Paper
        elevation={6}
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          width: '100%',
          maxWidth: 420,
          minHeight: 460,
          p: { xs: 3.5, sm: 4.5 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s ease',
        }}
      >
        {/* Tab switcher: Login | Register */}
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            backgroundColor: '#F0F0F0',
            borderRadius: '8px',
            p: 0.5,
            mb: 3,
          }}
        >
          <Button
            fullWidth
            onClick={() => switchMode('login')}
            sx={{
              py: 0.8,
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: mode === 'login' ? 700 : 500,
              color: mode === 'login' ? '#FFFFFF' : '#555555',
              backgroundColor: mode === 'login' ? '#000000' : 'transparent',
              textTransform: 'none',
              boxShadow: mode === 'login' ? '0 2px 6px rgba(0,0,0,0.2)' : 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: mode === 'login' ? '#1E1E1E' : 'rgba(0,0,0,0.05)',
              },
            }}
          >
            {t('loginTab')}
          </Button>

          <Button
            fullWidth
            onClick={() => switchMode('register')}
            sx={{
              py: 0.8,
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: mode === 'register' ? 700 : 500,
              color: mode === 'register' ? '#FFFFFF' : '#555555',
              backgroundColor: mode === 'register' ? '#000000' : 'transparent',
              textTransform: 'none',
              boxShadow: mode === 'register' ? '0 2px 6px rgba(0,0,0,0.2)' : 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: mode === 'register' ? '#1E1E1E' : 'rgba(0,0,0,0.05)',
              },
            }}
          >
            {t('registerTab')}
          </Button>
        </Box>

        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: '1.85rem',
            color: '#1a1a1a',
            textAlign: 'center',
            mb: 3,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {mode === 'login' ? t('loginTitle') : t('registerTitle')}
        </Typography>

        {/* Server Error Alert */}
        <Collapse in={Boolean(serverError)} sx={{ width: '100%', mb: 2 }}>
          <Alert
            severity="error"
            onClose={() => setServerError(null)}
            sx={{
              fontSize: '0.85rem',
              py: 0.5,
              borderRadius: '6px',
            }}
          >
            {serverError}
          </Alert>
        </Collapse>

        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, mb: 3.5 }}>
          {/* Username row */}
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5,
              }}
            >
              <Typography
                component="label"
                htmlFor="auth-username"
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#333333',
                  minWidth: 85,
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
                  id="auth-username"
                  fullWidth
                  value={usernameInput}
                  onChange={handleUsernameChange}
                  disabled={isLoading}
                  inputProps={{
                    style: {
                      fontSize: '0.92rem',
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
                  mt: 0.5,
                  textAlign: 'right',
                  fontWeight: 500,
                }}
              >
                {errors.username}
              </Typography>
            </Collapse>
          </Box>

          {/* Email row (Register mode only) */}
          {mode === 'register' && (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                }}
              >
                <Typography
                  component="label"
                  htmlFor="auth-email"
                  sx={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#333333',
                    minWidth: 85,
                  }}
                >
                  {t('loginEmailLabel')}
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: '#D9D9D9',
                    borderRadius: '4px',
                    px: 1.5,
                    py: 0.6,
                    transition: 'all 0.2s ease',
                    boxShadow: errors.email ? '0 0 0 2px rgba(211, 47, 47, 0.7)' : 'none',
                    '&:focus-within': {
                      backgroundColor: '#CECECE',
                      boxShadow: errors.email ? '0 0 0 2px #d32f2f' : '0 0 0 1.5px #555555',
                    },
                  }}
                >
                  <InputBase
                    id="auth-email"
                    type="email"
                    fullWidth
                    value={emailInput}
                    onChange={handleEmailChange}
                    disabled={isLoading}
                    inputProps={{
                      style: {
                        fontSize: '0.92rem',
                        color: '#222222',
                      },
                    }}
                  />
                </Box>
              </Box>

              <Collapse in={Boolean(errors.email)}>
                <Typography
                  sx={{
                    color: '#d32f2f',
                    fontSize: '0.78rem',
                    mt: 0.5,
                    textAlign: 'right',
                    fontWeight: 500,
                  }}
                >
                  {errors.email}
                </Typography>
              </Collapse>
            </Box>
          )}

          {/* Password row */}
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5,
              }}
            >
              <Typography
                component="label"
                htmlFor="auth-password"
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#333333',
                  minWidth: 85,
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
                  id="auth-password"
                  type="password"
                  fullWidth
                  value={passwordInput}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  inputProps={{
                    style: {
                      fontSize: '0.92rem',
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
                  mt: 0.5,
                  textAlign: 'right',
                  fontWeight: 500,
                }}
              >
                {errors.password}
              </Typography>
            </Collapse>
          </Box>

          {/* Confirm Password row (Register mode only) */}
          {mode === 'register' && (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                }}
              >
                <Typography
                  component="label"
                  htmlFor="auth-confirm-password"
                  sx={{
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    color: '#333333',
                    minWidth: 85,
                    lineHeight: 1.2,
                  }}
                >
                  {t('loginConfirmPasswordLabel')}
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: '#D9D9D9',
                    borderRadius: '4px',
                    px: 1.5,
                    py: 0.6,
                    transition: 'all 0.2s ease',
                    boxShadow: errors.confirmPassword ? '0 0 0 2px rgba(211, 47, 47, 0.7)' : 'none',
                    '&:focus-within': {
                      backgroundColor: '#CECECE',
                      boxShadow: errors.confirmPassword ? '0 0 0 2px #d32f2f' : '0 0 0 1.5px #555555',
                    },
                  }}
                >
                  <InputBase
                    id="auth-confirm-password"
                    type="password"
                    fullWidth
                    value={confirmPasswordInput}
                    onChange={handleConfirmPasswordChange}
                    disabled={isLoading}
                    inputProps={{
                      style: {
                        fontSize: '0.92rem',
                        color: '#222222',
                      },
                    }}
                  />
                </Box>
              </Box>

              <Collapse in={Boolean(errors.confirmPassword)}>
                <Typography
                  sx={{
                    color: '#d32f2f',
                    fontSize: '0.78rem',
                    mt: 0.5,
                    textAlign: 'right',
                    fontWeight: 500,
                  }}
                >
                  {errors.confirmPassword}
                </Typography>
              </Collapse>
            </Box>
          )}
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
            py: 0.8,
            fontSize: '0.88rem',
            fontWeight: 600,
            textTransform: 'lowercase',
            letterSpacing: '0.3px',
            minWidth: 120,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#222222',
            },
            '&:active': {
              transform: 'scale(0.97)',
            },
            '&.Mui-disabled': {
              backgroundColor: '#666666',
              color: '#CCCCCC',
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={16} sx={{ color: '#FFFFFF' }} />
          ) : mode === 'login' ? (
            t('loginSubmitBtn')
          ) : (
            t('registerSubmitBtn')
          )}
        </Button>
      </Paper>
    </Grow>
  );
};
