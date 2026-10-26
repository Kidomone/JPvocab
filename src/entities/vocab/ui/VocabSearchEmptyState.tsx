import { Box, Typography, Button } from '@mui/material';
import { RED_COLOR, useTranslation } from '../../../shared';

export interface VocabSearchEmptyStateProps {
  query: string;
  onReset: () => void;
}

export const VocabSearchEmptyState = ({ query, onReset }: VocabSearchEmptyStateProps) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 600,
        backgroundColor: '#FFFFFF',
        border: '1.5px dashed #D0D0D0',
        borderRadius: '12px',
        p: { xs: 4, sm: 5 },
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        my: 3,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundColor: 'rgba(153, 15, 15, 0.08)',
          color: RED_COLOR,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          mb: 0.5,
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: '#111111',
          fontFamily: "'Inter', sans-serif",
          fontSize: { xs: '1.15rem', sm: '1.3rem' },
        }}
      >
        {t('vocabNoResultsTitle')}: &laquo;{query}&raquo;
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: '#666666',
          maxWidth: 420,
          lineHeight: 1.5,
          fontSize: '0.92rem',
        }}
      >
        {t('vocabNoResultsDesc')}
      </Typography>

      <Box sx={{ mt: 1.5 }}>
        <Button
          variant="outlined"
          onClick={onReset}
          sx={{
            borderColor: '#CCCCCC',
            color: '#222222',
            borderRadius: '6px',
            px: 3,
            py: 0.6,
            fontSize: '0.88rem',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              borderColor: RED_COLOR,
              color: RED_COLOR,
              backgroundColor: 'rgba(153, 15, 15, 0.04)',
            },
          }}
        >
          {t('vocabResetSearchBtn')}
        </Button>
      </Box>
    </Box>
  );
};
