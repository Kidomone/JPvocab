import { Box, Typography } from '@mui/material';
import type { KanjiComponent } from '../model/types';
import { useTranslation } from '../../../shared';

interface KanjiBreakdownProps {
  components: KanjiComponent[];
}

export const KanjiBreakdown = ({ components }: KanjiBreakdownProps) => {
  const { lang } = useTranslation();

  if (!components || components.length === 0) {
    return null;
  }

  const formatReadings = (readings: string) => {
    if (!readings) return '';
    if (lang === 'en') {
      return readings
        .replace(/он\s*\/\s*кун/gi, 'on / kun')
        .replace(/\bон\b/gi, 'on')
        .replace(/\bкун\b/gi, 'kun');
    }
    return readings
      .replace(/on\s*\/\s*kun/gi, 'он / кун')
      .replace(/\bon\b/gi, 'он')
      .replace(/\bkun\b/gi, 'кун');
  };

  const formatMeaning = (meaning: string) => {
    if (!meaning) return '';
    if (lang === 'en') {
      return meaning
        .replace(/^иероглиф:\s*/i, 'kanji character: ')
        .replace(/^значение:\s*/i, 'definition of ');
    }
    return meaning
      .replace(/^kanji character:\s*/i, 'иероглиф: ')
      .replace(/^definition of\s*/i, 'значение: ');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {components.map((comp, idx) => (
        <Box key={idx}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Typography
              component="span"
              sx={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontWeight: 700,
                fontSize: '1.65rem',
                lineHeight: 1.2,
              }}
            >
              {comp.kanji}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontWeight: 600,
                fontSize: '1.15rem',
                textAlign: 'right',
              }}
            >
              {formatMeaning(comp.meaning)}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: '0.82rem',
              color: 'rgba(255, 255, 255, 0.9)',
              fontFamily: "'Noto Sans JP', sans-serif",
              mt: 0.3,
            }}
          >
            {formatReadings(comp.readings)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
