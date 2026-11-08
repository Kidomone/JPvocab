import type { ReactNode } from 'react';
import { Box, Typography, Divider, Fade, Skeleton } from '@mui/material';
import { RED_COLOR, useTranslation } from '../../../shared';
import type { WordDetail } from '../model/types';
import { KanjiBreakdown } from './KanjiBreakdown';

export interface WordCardProps {
  wordDetail?: WordDetail | null;
  actionSlot?: ReactNode;
  isLoading?: boolean;
}

export const WordCard = ({ wordDetail, actionSlot, isLoading = false }: WordCardProps) => {
  const { t } = useTranslation();

  if (isLoading || !wordDetail) {
    return (
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', md: 440 },
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

  const hasComponents = wordDetail.components && wordDetail.components.length > 0;
  const isNotFound = Boolean(wordDetail.notFound || !wordDetail.meaning || !wordDetail.meaning.trim());

  return (

    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', md: 440 },
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
            <Typography
              component="h2"
              sx={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontWeight: 700,
                fontSize:
                  wordDetail.word.length > 10
                    ? '1.5rem'
                    : wordDetail.word.length > 6
                    ? '1.75rem'
                    : '2.05rem',
                lineHeight: 1.2,
                wordBreak: 'break-word',
                color: '#FFFFFF',
                mb: 0.5,
              }}
            >
              {wordDetail.word}
            </Typography>

            {/* Readings */}
            {wordDetail.reading && wordDetail.reading !== wordDetail.word && (
              <Typography
                sx={{
                  fontSize: '0.92rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontFamily: "'Noto Sans JP', sans-serif",
                  mb: 1,
                }}
              >
                {wordDetail.reading}
              </Typography>
            )}

            {/* Meaning */}
            {isNotFound ? (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.24)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '6px',
                  px: 1.25,
                  py: 0.4,
                  mt: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.82rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 500,
                  }}
                >
                  {t('wordNotFoundInDb')}
                </Typography>
              </Box>
            ) : (
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '1.18rem',
                  lineHeight: 1.35,
                  color: '#FFFFFF',
                  wordBreak: 'break-word',
                  mt: 0.5,
                }}
              >
                {wordDetail.meaning}
              </Typography>
            )}
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
