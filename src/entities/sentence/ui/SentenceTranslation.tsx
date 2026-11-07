import { Box, Typography } from '@mui/material';
import { useTranslation } from '../../../shared';

export interface SentenceTranslationProps {
  text: string;
  translation?: string;
  secondaryTranslation?: string;
  japaneseText?: string;
  sourceLang?: string;
}

export const SentenceTranslation = ({
  text: _text,
  translation,
  secondaryTranslation,
  japaneseText,
  sourceLang,
}: SentenceTranslationProps) => {
  const { t, lang } = useTranslation();
  const isEnglish = sourceLang === 'en';


  const formatTranslation = (raw: string | undefined): string => {
    if (!raw) {
      return '';
    }


    const sentencePrefixMatch = raw.match(/^(?:Перевод предложения:|Sentence translation:)\s*(.*)$/i);
    if (sentencePrefixMatch) {
      return `${t('translationSentencePrefix')} ${sentencePrefixMatch[1]}`;
    }

    const jaPrefixMatch = raw.match(/^(?:Перевод на японский:|Japanese translation:)\s*(.*)$/i);
    if (jaPrefixMatch) {
      return `${t('translationHeadingJa')} ${jaPrefixMatch[1]}`;
    }

    const generalPrefixMatch = raw.match(/^(?:Перевод:|Translation:)\s*(.*)$/i);
    if (generalPrefixMatch) {
      return `${t('translationHeadingEn')} ${generalPrefixMatch[1]}`;
    }

    return raw;
  };

  const displayTranslation = formatTranslation(translation);

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
        {isEnglish ? t('translationHeadingJa') : t('translationHeadingEn')}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          fontSize: '1.15rem',
          color: '#222222',
          lineHeight: 1.5,
          maxWidth: { xs: '100%', md: 620 },
          fontFamily: isEnglish ? "'Noto Sans JP', 'Inter', sans-serif" : "'Inter', sans-serif",
        }}
      >
        {displayTranslation}
      </Typography>

      {/* If English input and Japanese text is available */}
      {isEnglish && japaneseText && japaneseText !== displayTranslation && (
        <Typography
          variant="body2"
          sx={{
            fontSize: '1.05rem',
            color: '#555555',
            fontFamily: "'Noto Sans JP', sans-serif",
            lineHeight: 1.4,
            maxWidth: { xs: '100%', md: 620 },
          }}
        >
          {japaneseText}
        </Typography>
      )}

      {/* Russian translation for English or Japanese input when Russian language is active */}
      {lang === 'ru' && secondaryTranslation && secondaryTranslation !== displayTranslation && (
        <Box sx={{ mt: 0.5 }}>
          <Typography
            sx={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#777777',
              mb: 0.2,
            }}
          >
            {isEnglish ? 'Перевод на русский:' : 'English:'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: '1.05rem',
              color: '#444444',
              lineHeight: 1.4,
              maxWidth: { xs: '100%', md: 620 },
            }}
          >
            {secondaryTranslation}
          </Typography>
        </Box>
      )}
    </Box>
  );
};


