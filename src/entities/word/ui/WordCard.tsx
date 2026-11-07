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
  const { lang, t } = useTranslation();

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

  const formatMeaning = (meaning: string) => {
    if (!meaning) return '';
    if (lang === 'en') {
      return meaning.replace(/^значение:\s*/i, '');
    }
    return meaning.replace(/^definition of\s*/i, '');
  };
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
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
                  fontSize: wordDetail.word.length > 5 ? '1.75rem' : '2.05rem',
                  lineHeight: 1.15,
                  flexShrink: 0,
                }}
              >
                {wordDetail.word}
              </Typography>

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
                    textAlign: 'right',
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
                  component="span"
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.18rem',
                    textAlign: 'right',
                    lineHeight: 1.3,
                    wordBreak: 'break-word',
                  }}
                >
                  {formatMeaning(wordDetail.meaning)}
                </Typography>
              )}
            </Box>

            {/* Readings */}
            <Typography
              sx={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.88)',
                fontFamily: "'Noto Sans JP', sans-serif",
                mt: 0.5,
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
