import { Box, Typography } from '@mui/material';
import {
  DEFAULT_SENTENCE,
  DEFAULT_TRANSLATION_EN,
  DEFAULT_TRANSLATION_RU,
} from '../model/mockData';

interface SentenceTranslationProps {
  text: string;
}

export const SentenceTranslation = ({ text }: SentenceTranslationProps) => {
  const isDefault = text === DEFAULT_SENTENCE;

  return (
    <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography
        variant="h6"
        component="div"
        sx={{
          fontWeight: 600,
          fontSize: '1.2rem',
          color: '#1a1a1a',
        }}
      >
        Перевод:
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: '1.15rem',
          color: '#222222',
          lineHeight: 1.5,
          maxWidth: 480,
        }}
      >
        {isDefault ? DEFAULT_TRANSLATION_EN : `Перевод предложения: "${text}"`}
      </Typography>
      {isDefault && (
        <Typography
          variant="body2"
          sx={{
            fontSize: '1.05rem',
            color: '#666666',
            lineHeight: 1.4,
            maxWidth: 480,
          }}
        >
          {DEFAULT_TRANSLATION_RU}
        </Typography>
      )}
    </Box>
  );
};
