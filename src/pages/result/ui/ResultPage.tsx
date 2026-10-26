import { useState, useEffect } from 'react';
import { Box, Fade, Snackbar, Alert } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { Layout, useTranslation } from '../../../shared';
import {
  DEFAULT_SENTENCE,
  TODAY_WORD_DETAIL,
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
  const rawText = searchParams.get('text') ?? DEFAULT_SENTENCE;

  const [activeWord, setActiveWord] = useState<WordDetail>(TODAY_WORD_DETAIL);
  const [selectedTokenId, setSelectedTokenId] = useState<string>('1');
  const [prevRawText, setPrevRawText] = useState(rawText);
  const [prevLang, setPrevLang] = useState(lang);
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeSentenceResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  if (rawText !== prevRawText || lang !== prevLang) {
    setPrevRawText(rawText);
    setPrevLang(lang);
    setIsLoading(true);
  }

  useEffect(() => {
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
          setActiveWord(selected.detail || TODAY_WORD_DETAIL);
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

  const handleResetDefault = () => {
    setSearchParams({ text: DEFAULT_SENTENCE });
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
          px: { xs: 3, sm: 6, md: 10 },
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
          containerSx={{ mb: 8, mt: 4 }}
        />

        {/* Content States */}
        {isLoading ? (
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
            <SentenceSkeleton />
            <WordCard wordDetail={activeWord} isLoading={true} />
          </Box>
        ) : hasNoData ? (
          <Fade in timeout={350}>
            <Box>
              <SentenceEmptyState
                message={t('noDataDesc')}
                onReset={handleResetDefault}
              />
            </Box>
          </Fade>
        ) : (
          <Fade in timeout={350}>
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
                  activeWord={activeWord}
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
                actionSlot={<AddToVocabButton word={activeWord} onAdd={handleWordAdded} />}
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
