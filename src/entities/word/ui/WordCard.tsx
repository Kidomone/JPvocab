import type { ReactNode } from 'react';
import { Box, Typography, Divider, Fade, Skeleton } from '@mui/material';
import { RED_COLOR, useTranslation } from '../../../shared';
import type { WordDetail } from '../model/types';
import { KanjiBreakdown } from './KanjiBreakdown';

export interface WordCardProps {
  wordDetail: WordDetail;
  actionSlot?: ReactNode;
  isLoading?: boolean;
}

export const WordCard = ({ wordDetail, actionSlot, isLoading = false }: WordCardProps) => {
  const { lang } = useTranslation();
  const hasComponents = wordDetail.components && wordDetail.components.length > 0;

  const formatMeaning = (meaning: string) => {
    if (!meaning) return '';
    if (lang === 'en') {
      return meaning.replace(/^значение:\s*/i, 'definition of ');
    }
    return meaning.replace(/^definition of\s*/i, 'значение: ');
  };

  if (isLoading) {
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
          minHeight: 280,
        }}
      >
        <Skeleton animation="wave" variant="rounded" height={38} sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Skeleton animation="wave" variant="text" width="60%" height={36} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Skeleton animation="wave" variant="text" width="40%" height={24} sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Skeleton animation="wave" variant="rounded" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      </Box>
    );
  }

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
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {actionSlot}

      <Fade key={wordDetail.word} in timeout={300}>
        <Box>
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
                {formatMeaning(wordDetail.meaning)}
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
      </Fade>
    </Box>
  );
};
