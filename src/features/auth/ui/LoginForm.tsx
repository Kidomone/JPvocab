import { useState, type SyntheticEvent, type ChangeEvent } from 'react';
import {
  Box,
  Typography,
  Button,
  InputBase,
  Paper,
  Collapse,
  CircularProgress,
  Fade,
  Alert,
} from '@mui/material';
import { useTranslation, RED_COLOR } from '../../../shared';
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

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  isPassword?: boolean;
}

const FormField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  disabled,
  autoComplete,
  isPassword = false,
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
      <Typography
        component="label"
        htmlFor={id}
        sx={{
          fontSize: '0.86rem',
          fontWeight: 600,
          color: '#333333',
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 44,
          px: 1.75,
          backgroundColor: '#ECECEC',
          borderRadius: '6px',
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: error ? '0 0 0 2px #d32f2f' : 'none',
          '&:hover': {
            backgroundColor: '#E2E2E2',
          },
          '&:focus-within': {
            backgroundColor: '#FFFFFF',
            boxShadow: error ? '0 0 0 2px #d32f2f' : `0 0 0 2px ${RED_COLOR}`,
          },
        }}
      >
        <InputBase
          id={id}
          type={inputType}
          fullWidth
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
          inputProps={{
            style: {
              fontSize: '0.92rem',
              color: '#222222',
              padding: 0,
            },
          }}
        />
        {isPassword && (
          <Box
            component="button"
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            sx={{
              background: 'transparent',
              border: 'none',
              p: 0.5,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              color: '#777777',
              transition: 'color 0.15s ease',
              '&:hover': {
                color: '#111111',
              },
            }}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </Box>
        )}
      </Box>
      <Collapse in={Boolean(error)}>
        <Typography sx={{ color: '#d32f2f', fontSize: '0.78rem', mt: 0.25, fontWeight: 500 }}>
          {error}
        </Typography>
      </Collapse>
    </Box>
  );
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { t, lang } = useTranslation();
  const { user, isAuthenticated, login, register, logout, isLoading } = useAuth();

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

  // Profile card for authenticated users
  if (isAuthenticated && user) {
    const userInitial = (user.username?.[0] || 'U').toUpperCase();

    return (
      <Fade in timeout={300}>
        <Paper
          elevation={0}
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            width: '100%',
            maxWidth: 420,
            p: { xs: 3.5, sm: 4.5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.35)',
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              backgroundColor: RED_COLOR,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.9rem',
              fontWeight: 800,
              fontFamily: "'Inter', sans-serif",
              mb: 2,
              boxShadow: '0 6px 16px rgba(153, 15, 15, 0.28)',
            }}
          >
            {userInitial}
          </Box>

          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: '1.45rem',
              color: '#111111',
              textAlign: 'center',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {user.username}
          </Typography>

          <Typography
            sx={{
              fontSize: '0.9rem',
              color: '#666666',
              textAlign: 'center',
              mb: 2.5,
            }}
          >
            {user.email}
          </Typography>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.5,
              py: 0.5,
              borderRadius: '20px',
              backgroundColor: '#ECFDF5',
              color: '#065F46',
              fontSize: '0.8rem',
              fontWeight: 600,
              mb: 3.5,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#10B981',
              }}
            />
            {lang === 'ru' ? 'Активная сессия' : 'Active Session'}
          </Box>

          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={onSuccess}
              sx={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                borderRadius: '6px',
                py: 1.2,
                fontSize: '0.92rem',
                fontWeight: 600,
                textTransform: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#222222',
                },
              }}
            >
              {t('navVocab')}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => logout()}
              sx={{
                borderColor: '#D9D9D9',
                color: '#333333',
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                py: 1.2,
                fontSize: '0.92rem',
                fontWeight: 600,
                textTransform: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#B0B0B0',
                  backgroundColor: '#F5F5F5',
                },
              }}
            >
              {t('navLogout')}
            </Button>
          </Box>
        </Paper>
      </Fade>
    );
  }

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

  return (
    <Fade in timeout={300}>
      <Paper
        elevation={0}
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          width: '100%',
          maxWidth: 440,
          p: { xs: 3, sm: 4.5 },
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* Modern Minimalist Tabs */}
        <Box
          sx={{
            display: 'flex',
            borderBottom: '1px solid #EAEAEA',
            width: '100%',
            mb: 2.5,
          }}
        >
          <Box
            component="button"
            type="button"
            onClick={() => switchMode('login')}
            sx={{
              flex: 1,
              pb: 1.5,
              pt: 0.5,
              background: 'transparent',
              border: 'none',
              borderBottom: mode === 'login' ? '2.5px solid #111111' : '2.5px solid transparent',
              color: mode === 'login' ? '#111111' : '#888888',
              fontSize: '1.05rem',
              fontWeight: mode === 'login' ? 700 : 500,
              cursor: 'pointer',
              textAlign: 'center',
              fontFamily: "'Inter', sans-serif",
              transition: 'all 0.18s ease',
              mb: '-1px',
              '&:hover': {
                color: '#111111',
              },
            }}
          >
            {t('loginTab')}
          </Box>

          <Box
            component="button"
            type="button"
            onClick={() => switchMode('register')}
            sx={{
              flex: 1,
              pb: 1.5,
              pt: 0.5,
              background: 'transparent',
              border: 'none',
              borderBottom: mode === 'register' ? '2.5px solid #111111' : '2.5px solid transparent',
              color: mode === 'register' ? '#111111' : '#888888',
              fontSize: '1.05rem',
              fontWeight: mode === 'register' ? 700 : 500,
              cursor: 'pointer',
              textAlign: 'center',
              fontFamily: "'Inter', sans-serif",
              transition: 'all 0.18s ease',
              mb: '-1px',
              '&:hover': {
                color: '#111111',
              },
            }}
          >
            {t('registerTab')}
          </Box>
        </Box>

        {/* Subtitle */}
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: '#666666',
            textAlign: 'center',
            mb: 3,
          }}
        >
          {mode === 'login'
            ? (lang === 'ru' ? 'Введите ваши данные для входа' : 'Sign in to access your saved words')
            : (lang === 'ru' ? 'Создайте профиль для синхронизации словаря' : 'Create an account to track your progress')}
        </Typography>

        {/* Server Error Alert */}
        <Collapse in={Boolean(serverError)} sx={{ width: '100%', mb: 2 }}>
          <Alert
            severity="error"
            onClose={() => setServerError(null)}
            sx={{
              fontSize: '0.84rem',
              py: 0.5,
              borderRadius: '6px',
            }}
          >
            {serverError}
          </Alert>
        </Collapse>

        {/* Input Fields */}
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <FormField
            id="auth-username"
            label={t('loginUsernameLabel')}
            value={usernameInput}
            onChange={(e) => {
              setUsernameInput(e.target.value);
              if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
              if (serverError) setServerError(null);
            }}
            error={errors.username}
            disabled={isLoading}
            autoComplete="username"
          />

          {mode === 'register' && (
            <FormField
              id="auth-email"
              label={t('loginEmailLabel')}
              type="email"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                if (serverError) setServerError(null);
              }}
              error={errors.email}
              disabled={isLoading}
              autoComplete="email"
            />
          )}

          <FormField
            id="auth-password"
            label={t('loginPasswordLabel')}
            isPassword
            value={passwordInput}
            onChange={(e) => {
              setPasswordInput(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              if (serverError) setServerError(null);
            }}
            error={errors.password}
            disabled={isLoading}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          {mode === 'register' && (
            <FormField
              id="auth-confirm-password"
              label={t('loginConfirmPasswordLabel')}
              isPassword
              value={confirmPasswordInput}
              onChange={(e) => {
                setConfirmPasswordInput(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                if (serverError) setServerError(null);
              }}
              error={errors.confirmPassword}
              disabled={isLoading}
              autoComplete="new-password"
            />
          )}
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            borderRadius: '6px',
            py: 1.25,
            fontSize: '0.95rem',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#222222',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            },
            '&:active': {
              transform: 'scale(0.99)',
            },
            '&.Mui-disabled': {
              backgroundColor: '#666666',
              color: '#CCCCCC',
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
          ) : mode === 'login' ? (
            t('loginSubmitBtn')
          ) : (
            t('registerSubmitBtn')
          )}
        </Button>

        {/* Bottom Switch Link */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
            mt: 3,
            pt: 2.5,
            borderTop: '1px solid #EEEEEE',
            width: '100%',
          }}
        >
          <Typography sx={{ fontSize: '0.86rem', color: '#666666' }}>
            {mode === 'login'
              ? (lang === 'ru' ? 'Ещё нет аккаунта?' : "Don't have an account?")
              : (lang === 'ru' ? 'Уже зарегистрированы?' : 'Already have an account?')}
          </Typography>
          <Button
            type="button"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            sx={{
              p: 0,
              minWidth: 'auto',
              fontSize: '0.86rem',
              fontWeight: 700,
              color: RED_COLOR,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            {mode === 'login' ? t('registerTab') : t('loginTab')}
          </Button>
        </Box>
      </Paper>
    </Fade>
  );
};
