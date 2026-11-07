import { useState, useEffect } from 'react';
import { Box, Fade, Snackbar, Alert } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { Layout, useTranslation } from '../../../shared';
import {
  analyzeSentenceApi,
  SentenceTokens,
  SentenceTranslation,
  SentenceSkeleton,
  SentenceEmptyState,
  WordCard,
  type WordDetail,
  type ParsedToken,
  type AnalyzeSentenceResult,
} from '../../../entities';
import { AnalyzeSentenceForm, AddToVocabButton } from '../../../features';

export const ResultPage = () => {
  const { t, lang } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawText = searchParams.get('text') ?? '';

  const [activeWord, setActiveWord] = useState<WordDetail | null>(null);
  const [selectedTokenId, setSelectedTokenId] = useState<string>('1');
  const [prevRawText, setPrevRawText] = useState(rawText);
  const [prevLang, setPrevLang] = useState(lang);
  const [isLoading, setIsLoading] = useState(Boolean(rawText.trim()));
  const [analysisResult, setAnalysisResult] = useState<AnalyzeSentenceResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  if (rawText !== prevRawText || lang !== prevLang) {
    setPrevRawText(rawText);
    setPrevLang(lang);
    setIsLoading(Boolean(rawText.trim()));
  }

  useEffect(() => {
    if (!rawText.trim()) {
      setIsLoading(false);
      setAnalysisResult(null);
      setActiveWord(null);
      return;
    }

    if (!isLoading) return;

    let isMounted = true;
    analyzeSentenceApi(rawText, lang)
      .then((res) => {
        if (!isMounted) return;
        setAnalysisResult(res);
        if (res.tokens.length > 0) {
          const currentWordKey = activeWord?.word;
          const matchingToken = res.tokens.find((t) => t.detail?.word === currentWordKey);
          const firstWithDetail = res.tokens.find((t) => t.detail);
          const selected = matchingToken || firstWithDetail || res.tokens[0];
          setSelectedTokenId(selected.id);
          setActiveWord(selected.detail || null);
        }
      })
      .catch((err) => {
        console.error('Failed to analyze sentence:', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [rawText, lang, isLoading, activeWord?.word]);

  const tokens: ParsedToken[] = analysisResult?.tokens || [];

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      setSearchParams({ text: query.trim() });
    }
  };

  const handleTokenClick = (detail?: WordDetail, tok?: ParsedToken) => {
    if (tok) {
      setSelectedTokenId(tok.id);
    }
    if (detail) {
      setActiveWord(detail);
    }
  };

  const handleWordAdded = (word: WordDetail) => {
    const msg = lang === 'en'
      ? `Word "${word.word}" added to dictionary`
      : `Слово «${word.word}» добавлено в словарь`;
    setSnackbarMessage(msg);
    setSnackbarOpen(true);
  };

  const hasNoData = !rawText.trim() || (!isLoading && tokens.length === 0);

  return (
    <Layout>
      <Box
        sx={{
          flex: 1,
          px: { xs: 2, sm: 4, md: 6 },
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <AnalyzeSentenceForm
          initialValue={rawText}
          onSubmit={handleSearchSubmit}
          isLoading={isLoading}
          placeholder={t('resultInputPlaceholder')}
          ariaLabel={t('homeInputAria')}
          containerSx={{ mb: 7, mt: 3, maxWidth: 880 }}
        />

        {/* Content States */}
        {isLoading ? (
          <Box
            sx={{
              width: '100%',
              maxWidth: 1220,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'center', md: 'flex-start' },
              gap: { xs: 4, md: 6 },
            }}
          >
            <SentenceSkeleton />
            <WordCard wordDetail={activeWord} isLoading={true} />
          </Box>
        ) : hasNoData ? (
          <Fade in timeout={350}>
            <Box>
              <SentenceEmptyState
                message={
                  !rawText.trim()
                    ? (lang === 'en'
                        ? 'No sentence specified. Please enter a sentence to analyze.'
                        : 'Текст для разбора не указан. Пожалуйста, введите предложение выше.')
                    : t('noDataDesc')
                }
              />
            </Box>
          </Fade>
        ) : (
          <Fade in timeout={350}>
            <Box
              sx={{
                width: '100%',
                maxWidth: 1220,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'center', md: 'flex-start' },
                gap: { xs: 4, md: 6 },
              }}
            >
              {/* Left Column */}
              <Box
                sx={{
                  flex: 1,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  pt: 2,
                }}
              >
                <SentenceTokens
                  tokens={tokens}
                  selectedTokenId={selectedTokenId}
                  activeWord={activeWord || undefined}
                  onTokenClick={handleTokenClick}
                />


                <SentenceTranslation
                  text={rawText}
                  translation={analysisResult?.translation}
                  secondaryTranslation={analysisResult?.secondaryTranslation}
                  japaneseText={analysisResult?.japaneseText}
                  sourceLang={analysisResult?.sourceLang}
                />
              </Box>

              {/* Right Column */}
              <WordCard
                wordDetail={activeWord}
                isLoading={isLoading}
                actionSlot={activeWord ? <AddToVocabButton word={activeWord} onAdd={handleWordAdded} /> : null}
              />
            </Box>
          </Fade>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2500}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="info"
            variant="filled"
            sx={{
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};
