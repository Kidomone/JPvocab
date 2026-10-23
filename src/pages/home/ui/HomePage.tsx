import { Box, Typography, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Layout, useTranslation } from '../../../shared';
import { DEFAULT_SENTENCE } from '../../../entities';
import { AnalyzeSentenceForm } from '../../../features';

export const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAnalyze = (query: string) => {
    const target = query.trim() || DEFAULT_SENTENCE;
    navigate(`/result?text=${encodeURIComponent(target)}`);
  };

  return (
    <Layout>
      <Fade in timeout={400}>
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
            {t('homeTitle')}
          </Typography>

          <AnalyzeSentenceForm
            onSubmit={handleAnalyze}
            showSubmitButton
            placeholder={t('homeInputPlaceholder')}
            buttonText={t('analyzeButton')}
            ariaLabel={t('homeInputAria')}
          />
        </Box>
      </Fade>
    </Layout>
  );
};
