import { useState, useMemo, type SyntheticEvent } from 'react';
import {
  Box,
  Typography,
  Button,
  InputBase,
  Divider,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { RED_COLOR } from '../theme';
import {
  DEFAULT_SENTENCE,
  DEFAULT_TRANSLATION_EN,
  DEFAULT_TRANSLATION_RU,
  TODAY_WORD_DETAIL,
  parseSentence,
} from '../mockData';
import type { WordDetail } from '../index';

export const ResultPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawText = searchParams.get('text') || DEFAULT_SENTENCE;

  const [inputVal, setInputVal] = useState(rawText);
  const [activeWord, setActiveWord] = useState<WordDetail>(TODAY_WORD_DETAIL);

  // Tokens breakdown
  const tokens = useMemo(() => parseSentence(rawText), [rawText]);

  // Handle re-submission of search
  const handleSearchSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ text: inputVal.trim() });
    }
  };

  const handleTokenClick = (detail?: WordDetail) => {
    if (detail) {
      setActiveWord(detail);
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          flex: 1,
          px: { xs: 3, sm: 6, md: 10 },
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Top Input Bar */}
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            width: '100%',
            maxWidth: 480,
            backgroundColor: '#ECECEC',
            borderRadius: '6px',
            px: 2,
            py: 0.8,
            mb: 10,
            mt: 5,
            transition: 'background-color 0.2s, box-shadow 0.2s',
            '&:focus-within': {
              backgroundColor: '#E2E2E2',
              boxShadow: '0 0 0 2px #990f0f58',
            },
          }}
        >
          <InputBase
            fullWidth
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            inputProps={{
              'aria-label': 'предложение для разбора',
              style: {
                textAlign: 'center',
                fontSize: '0.95rem',
                color: '#222222',
                fontFamily: "'Noto Sans JP', 'Inter', sans-serif",
              },
            }}
          />
        </Box>

        {/* Content Section: 2 Columns */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 1050,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: { xs: 5, md: 8 },
          }}
        >
          {/* Left Column: Parsed Tokens + Translation */}
          <Box
            sx={{
              flex: 1,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              pt: 2,
            }}
          >
            {/* Tokens */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                alignItems: 'baseline',
                mb: 8,
              }}
            >
              {tokens.map((tok) => {
                const isSelected = activeWord.word === tok.text;
                return (
                  <Box
                    key={tok.id}
                    onClick={() => handleTokenClick(tok.detail)}
                    component="span"
                    sx={{
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: { xs: '1.75rem', sm: '2.1rem' },
                      fontWeight: 500,
                      color: '#000000',
                      cursor: tok.detail ? 'pointer' : 'default',
                      px: 0.8,
                      py: 0.2,
                      borderRadius: '6px',
                      backgroundColor: isSelected
                        ? 'rgba(153, 15, 15, 0.12)'
                        : 'transparent',
                      borderBottom: isSelected
                        ? `3px solid ${RED_COLOR}`
                        : '3px solid transparent',
                      transition: 'all 0.15s ease-in-out',
                      '&:hover': tok.detail
                        ? {
                          backgroundColor: 'rgba(153, 15, 15, 0.08)',
                        }
                        : {},
                    }}
                    title={tok.detail ? `Кликните для разбора: ${tok.text}` : undefined}
                  >
                    {tok.text}
                  </Box>
                );
              })}
            </Box>

            {/* Translation block */}
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
                {rawText === DEFAULT_SENTENCE
                  ? DEFAULT_TRANSLATION_EN
                  : `Перевод предложения: "${rawText}"`}
              </Typography>
                            {rawText === DEFAULT_SENTENCE && (
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
          </Box>

          {/* Right Column: Word Card */}
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
            {/* Top Button: Добавить в словарь */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                borderRadius: '8px',
                py: 1,
                fontSize: '0.88rem',
                fontWeight: 600,
                mb: 3,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#222222',
                  boxShadow: 'none',
                },
              }}
            >
              Добавить в словарь
            </Button>

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
                  {activeWord.word}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.35rem',
                    textAlign: 'right',
                  }}
                >
                  {activeWord.meaning}
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
                {activeWord.reading}
              </Typography>
            </Box>

            {/* Divider */}
            {activeWord.components && activeWord.components.length > 0 && (
              <Divider
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                  my: 2,
                  borderWidth: '0.5px',
                }}
              />
            )}

            {/* Kanji Breakdown List */}
            {activeWord.components && activeWord.components.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {activeWord.components.map((comp, idx) => (
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
                        {comp.meaning}
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
                      {comp.readings}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};
