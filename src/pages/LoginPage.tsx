import { useState, type SyntheticEvent } from 'react';
import { Box, Typography, Button, InputBase, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RED_COLOR } from '../theme';

export const LoginPage = () => {
  const [nameInput, setNameInput] = useState('Kidomone');
  const [passwordInput, setPasswordInput] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: SyntheticEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: RED_COLOR,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
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
        }}
      >
        {/* Card Title */}
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
          Login
        </Typography>

        {/* Inputs container */}
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3, mb: 5 }}>
          {/* Username row */}
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
              username
            </Typography>
            <Box
              sx={{
                flex: 1,
                backgroundColor: '#D9D9D9',
                borderRadius: '4px',
                px: 1.5,
                py: 0.6,
                transition: 'background-color 0.2s',
                '&:focus-within': {
                  backgroundColor: '#CECECE',
                },
              }}
            >
              <InputBase
                id="login-username"
                fullWidth
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                inputProps={{
                  style: {
                    fontSize: '0.95rem',
                    color: '#222222',
                  },
                }}
              />
            </Box>
          </Box>

          {/* Password row */}
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
              password
            </Typography>
            <Box
              sx={{
                flex: 1,
                backgroundColor: '#D9D9D9',
                borderRadius: '4px',
                px: 1.5,
                py: 0.6,
                transition: 'background-color 0.2s',
                '&:focus-within': {
                  backgroundColor: '#CECECE',
                },
              }}
            >
              <InputBase
                id="login-password"
                type="password"
                fullWidth
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                inputProps={{
                  style: {
                    fontSize: '0.95rem',
                    color: '#222222',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Submit button */}
        <Button
          type="submit"
          variant="contained"
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
            '&:hover': {
              backgroundColor: '#222222',
            },
          }}
        >
          login
        </Button>
      </Paper>
    </Box>
  );
};
