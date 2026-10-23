import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RED_COLOR, useTranslation } from '../../../shared';

interface SentenceEmptyStateProps {
  message?: string;
  onReset?: () => void;
}

export const SentenceEmptyState = ({
  message,
  onReset,
}: SentenceEmptyStateProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 540,
        backgroundColor: '#FFFFFF',
        border: '1.5px dashed #D0D0D0',
        borderRadius: '12px',
        p: { xs: 4, sm: 5 },
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        my: 4,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: RED_COLOR,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {t('noDataTitle')}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: '#555555',
          maxWidth: 400,
          lineHeight: 1.5,
          fontSize: '0.95rem',
        }}
      >
        {message || t('noDataDesc')}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
        {onReset && (
          <Button
            variant="contained"
            onClick={onReset}
            sx={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              borderRadius: '6px',
              px: 3,
              py: 0.8,
              fontSize: '0.88rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#222222',
              },
            }}
          >
            {t('resetDefaultBtn')}
          </Button>
        )}

        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{
            borderColor: '#CCCCCC',
            color: '#333333',
            borderRadius: '6px',
            px: 2.5,
            py: 0.8,
            fontSize: '0.88rem',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#999999',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          {t('toHomeBtn')}
        </Button>
      </Box>
    </Box>
  );
};
