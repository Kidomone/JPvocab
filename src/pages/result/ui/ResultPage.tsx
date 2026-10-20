import { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../../../shared';
import {
  DEFAULT_SENTENCE,
  TODAY_WORD_DETAIL,
  parseSentence,
  SentenceTokens,
  SentenceTranslation,
  WordCard,
  type WordDetail,
} from '../../../entities';
import { AnalyzeSentenceForm, AddToVocabButton } from '../../../features';

export const ResultPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawText = searchParams.get('text') || DEFAULT_SENTENCE;

  const [activeWord, setActiveWord] = useState<WordDetail>(TODAY_WORD_DETAIL);

  // Tokens breakdown
  const tokens = useMemo(() => parseSentence(rawText), [rawText]);

  // Handle re-submission of search
  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      setSearchParams({ text: query.trim() });
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
        {/* Top Input Bar Feature */}
        <AnalyzeSentenceForm
          initialValue={rawText}
          onSubmit={handleSearchSubmit}
          ariaLabel="предложение для разбора"
          containerSx={{ mb: 10, mt: 5 }}
        />

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
            <SentenceTokens
              tokens={tokens}
              activeWord={activeWord}
              onTokenClick={handleTokenClick}
            />

            <SentenceTranslation text={rawText} />
          </Box>

          {/* Right Column: Word Card with Add to Vocab Feature */}
          <WordCard
            wordDetail={activeWord}
            actionSlot={<AddToVocabButton word={activeWord} />}
          />
        </Box>
      </Box>
    </Layout>
  );
};
