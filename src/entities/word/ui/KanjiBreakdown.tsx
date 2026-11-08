import { Box, Typography } from '@mui/material';
import type { KanjiComponent } from '../model/types';

interface KanjiBreakdownProps {
  components: KanjiComponent[];
}

export const KanjiBreakdown = ({ components }: KanjiBreakdownProps) => {
  if (!components || components.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {components.map((comp, idx) => (
        <Box key={idx}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Typography
              component="span"
              sx={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontWeight: 700,
                fontSize: '1.45rem',
                lineHeight: 1.2,
                flexShrink: 0,
              }}
            >
              {comp.kanji}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontWeight: 600,
                fontSize: '1.05rem',
                textAlign: 'right',
                lineHeight: 1.3,
                wordBreak: 'break-word',
              }}
            >
              {comp.meaning}
            </Typography>
          </Box>
          {comp.readings && (
            <Typography
              sx={{
                fontSize: '0.82rem',
                color: 'rgba(255, 255, 255, 0.9)',
                fontFamily: "'Noto Sans JP', sans-serif",
                mt: 0.3,
              }}
            >
              {comp.readings}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};
