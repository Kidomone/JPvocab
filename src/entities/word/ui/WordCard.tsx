import type { ReactNode } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { RED_COLOR } from '../../../shared';
import type { WordDetail } from '../model/types';
import { KanjiBreakdown } from './KanjiBreakdown';

interface WordCardProps {
  wordDetail: WordDetail;
  actionSlot?: ReactNode;
}

export const WordCard = ({ wordDetail, actionSlot }: WordCardProps) => {
  const hasComponents = wordDetail.components && wordDetail.components.length > 0;

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 380,
        backgroundColor: RED_COLOR,
        color: '#FFFFFF',
        borderRadius: '16px',
        p: { xs: 3, sm: 3.5 },
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {actionSlot}

      {/* Main Word Overview */}
      <Box sx={{ mb: 2.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 2,
            mb: 0.5,
          }}
        >
          <Typography
            component="span"
            sx={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 700,
              fontSize: '2.1rem',
              lineHeight: 1.1,
            }}
          >
            {wordDetail.word}
          </Typography>
          <Typography
            component="span"
            sx={{
              fontWeight: 700,
              fontSize: '1.35rem',
              textAlign: 'right',
            }}
          >
            {wordDetail.meaning}
          </Typography>
        </Box>

        {/* Readings */}
        <Typography
          sx={{
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: "'Noto Sans JP', sans-serif",
          }}
        >
          {wordDetail.reading}
        </Typography>
      </Box>

      {/* Divider */}
      {hasComponents && (
        <Divider
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.7)',
            my: 2,
            borderWidth: '0.5px',
          }}
        />
      )}

      {/* Kanji Breakdown List */}
      <KanjiBreakdown components={wordDetail.components} />
    </Box>
  );
};
