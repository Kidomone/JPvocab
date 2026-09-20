import { useState, type SyntheticEvent } from 'react';
import { Box, Typography, Button, InputBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { DEFAULT_SENTENCE } from '../mockData';

export const HomePage = () => {
  const [inputText, setInputText] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = (e?: SyntheticEvent) => {
    if (e) e.preventDefault();
    const query = inputText.trim() || DEFAULT_SENTENCE;
    navigate(`/result?text=${encodeURIComponent(query)}`);
  };

  return (
    <Layout>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          pb: 8,
        }}
      >
        <Box
          component="form"
          onSubmit={handleAnalyze}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 480,
          }}
        >
          {/* Main Title */}
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '2.8rem' },
              color: '#000000',
              textAlign: 'center',
              mb: 3,
              letterSpacing: '-0.5px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Введите текст
          </Typography>

          {/* Search/Input bar */}
          <Box
            sx={{
              width: '100%',
              backgroundColor: '#ECECEC',
              borderRadius: '6px',
              px: 2,
              py: 0.8,
              display: 'flex',
              alignItems: 'center',
              transition: 'background-color 0.2s, box-shadow 0.2s',
              '&:focus-within': {
                backgroundColor: '#E2E2E2',
                boxShadow: '0 0 0 2px #990f0f58',
              },
              mb: 2.5,
            }}
          >
            <InputBase
              fullWidth
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Например, こんにちは"
              inputProps={{
                'aria-label': 'японский текст для разбора',
                style: {
                  textAlign: 'center',
                  fontSize: '0.95rem',
                  color: '#222222',
                  fontFamily: "'Noto Sans JP', 'Inter', sans-serif",
                },
              }}
            />
          </Box>

          {/* Action Button */}
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              borderRadius: '6px',
              px: 3.5,
              py: 0.8,
              fontSize: '0.9rem',
              fontWeight: 600,
              minWidth: 110,
              '&:hover': {
                backgroundColor: '#222222',
              },
            }}
          >
            Разобрать
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};
