import { useState, useEffect } from 'react';
import { Box, Typography, Fade, Snackbar, Alert, Button } from '@mui/material';
import { Layout, RED_COLOR, useTranslation } from '../../../shared';
import {
  loadVocabList,
  updateWordNotes,
  removeWordFromVocab,
  clearVocab,
  VocabTable,
  VocabEmptyState,
  VocabSearchEmptyState,
  VocabSkeleton,
  VocabSearchBar,
  filterVocabList,
  type VocabItem,
} from '../../../entities';

export const VocabPage = () => {
  const { t, lang } = useTranslation();
  const [vocabList, setVocabList] = useState<VocabItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setVocabList(loadVocabList());
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleNoteChange = (id: number, val: string) => {
    const updated = updateWordNotes(id, val);
    setVocabList(updated);
  };

  const handleDelete = (id: number) => {
    const itemToDelete = vocabList.find((i) => i.id === id);
    const updated = removeWordFromVocab(id);
    setVocabList(updated);
    const msg = itemToDelete
      ? (lang === 'en' ? `Word "${itemToDelete.word}" removed` : `Слово «${itemToDelete.word}» удалено`)
      : (lang === 'en' ? 'Word removed' : 'Слово удалено');
    setSnackbarMessage(msg);
    setSnackbarOpen(true);
  };

  const handleClearAll = () => {
    const cleared = clearVocab();
    setVocabList(cleared);
    setSearchQuery('');
    setSnackbarMessage(t('vocabClearedSnackbar'));
    setSnackbarOpen(true);
  };

  const filteredList = filterVocabList(vocabList, searchQuery);
  const isSearching = Boolean(searchQuery.trim());

  return (
    <Layout>
      <Box
        sx={{
          flex: 1,
          px: { xs: 2, sm: 4, md: 8 },
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.5rem' },
            color: RED_COLOR,
            textAlign: 'center',
            mb: 2.5,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {t('vocabTitle')}
        </Typography>

        {/* Search Bar */}
        {!isLoading && vocabList.length > 0 && (
          <VocabSearchBar
            query={searchQuery}
            onQueryChange={setSearchQuery}
          />
        )}

        {/* Action bar */}
        {!isLoading && vocabList.length > 0 && (
          <Box
            sx={{
              width: '100%',
              maxWidth: 780,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2.5,
              px: 0.5,
            }}
          >
            <Typography variant="body2" sx={{ color: '#666666', fontWeight: 500 }}>
              {isSearching
                ? `${t('vocabFoundCount')} ${filteredList.length} / ${vocabList.length}`
                : `${t('vocabCount')} ${vocabList.length}`}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              {isSearching && (
                <Button
                  size="small"
                  onClick={() => setSearchQuery('')}
                  sx={{
                    color: RED_COLOR,
                    fontSize: '0.8rem',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(153, 15, 15, 0.06)',
                    },
                  }}
                >
                  {t('vocabResetSearchBtn')}
                </Button>
              )}

              <Button
                size="small"
                onClick={handleClearAll}
                sx={{
                  color: '#777777',
                  fontSize: '0.8rem',
                  textTransform: 'none',
                  '&:hover': {
                    color: RED_COLOR,
                    backgroundColor: 'rgba(153, 15, 15, 0.04)',
                  },
                }}
              >
                {t('clearVocabBtn')}
              </Button>
            </Box>
          </Box>
        )}

        {/* Content States */}
        {isLoading ? (
          <VocabSkeleton />
        ) : vocabList.length === 0 ? (
          <Fade in timeout={350}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <VocabEmptyState />
            </Box>
          </Fade>
        ) : filteredList.length === 0 ? (
          <Fade in timeout={350}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <VocabSearchEmptyState
                query={searchQuery}
                onReset={() => setSearchQuery('')}
              />
            </Box>
          </Fade>
        ) : (
          <Fade in timeout={350}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <VocabTable
                items={filteredList}
                onNoteChange={handleNoteChange}
                onDelete={handleDelete}
              />
            </Box>
          </Fade>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2200}
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
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};
