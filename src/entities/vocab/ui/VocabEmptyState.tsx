import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RED_COLOR, useTranslation } from '../../../shared';

export const VocabEmptyState = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 600,
        backgroundColor: '#FFFFFF',
        border: '1.5px dashed #D0D0D0',
        borderRadius: '12px',
        p: { xs: 4, sm: 6 },
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        my: 3,
        transition: 'all 0.25s ease',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: 'rgba(153, 15, 15, 0.08)',
          color: RED_COLOR,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.75rem',
          fontFamily: "'Noto Sans JP', sans-serif",
          fontWeight: 700,
          mb: 1,
        }}
      >
        語
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: '#111111',
          fontFamily: "'Inter', sans-serif",
          fontSize: { xs: '1.3rem', sm: '1.5rem' },
        }}
      >
        {t('emptyVocabTitle')}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: '#666666',
          maxWidth: 420,
          lineHeight: 1.5,
          fontSize: '0.95rem',
        }}
      >
        {t('emptyVocabDesc')}
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            borderRadius: '6px',
            px: 3.5,
            py: 0.8,
            fontSize: '0.9rem',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#222222',
            },
          }}
        >
          {t('analyzeTextBtn')}
        </Button>
      </Box>
    </Box>
  );
};
