import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../../shared';
import { DEFAULT_SENTENCE } from '../../../entities';
import { AnalyzeSentenceForm } from '../../../features';

export const HomePage = () => {
  const navigate = useNavigate();

  const handleAnalyze = (query: string) => {
    const target = query.trim() || DEFAULT_SENTENCE;
    navigate(`/result?text=${encodeURIComponent(target)}`);
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

        {/* Search/Input bar feature */}
        <AnalyzeSentenceForm
          onSubmit={handleAnalyze}
          showSubmitButton
          placeholder="Например, こんにちは"
          buttonText="Разобрать"
        />
      </Box>
    </Layout>
  );
};
