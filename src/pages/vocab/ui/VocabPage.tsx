import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Fade,
  Snackbar,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import { Layout, RED_COLOR, useTranslation } from '../../../shared';
import {
  fetchUserWordsApi,
  updateWordNotesApi,
  deleteWordApi,
  addCustomWordApi,
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
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Add word dialog state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [wordInput, setWordInput] = useState('');
  const [readingInput, setReadingInput] = useState('');
  const [meaningInput, setMeaningInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setFetchError(null);
    fetchUserWordsApi()
      .then((serverWords) => {
        if (!isMounted) return;
        setVocabList(serverWords);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Backend words fetch failed:', err);
        const errMsg = String(err?.message || '');
        const isAuthError = errMsg.includes('401') || errMsg.includes('403');
        if (isAuthError) {
          window.location.href = '/login';
          return;
        }
        setFetchError(
          lang === 'en'
            ? 'Failed to connect to server. Please check your connection.'
            : 'Не удалось связаться с сервером. Пожалуйста, проверьте соединение.'
        );
        setVocabList([]);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [lang]);

  const handleOpenAdd = () => {
    setWordInput('');
    setReadingInput('');
    setMeaningInput('');
    setNotesInput('');
    setAddError(null);
    setIsAddOpen(true);
  };

  const handleCloseAdd = () => {
    if (isSubmitting) return;
    setIsAddOpen(false);
    setAddError(null);
  };

  const handleSaveNewWord = async () => {
    const trimmedWord = wordInput.trim();
    if (!trimmedWord) {
      setAddError(lang === 'en' ? 'Word is required' : 'Введите слово');
      return;
    }

    setIsSubmitting(true);
    setAddError(null);

    try {
      const createdItem = await addCustomWordApi({
        word: trimmedWord,
        reading: readingInput.trim(),
        meaning: meaningInput.trim(),
        notes: notesInput.trim(),
      });

      setVocabList((prev) => [createdItem, ...prev.filter((item) => item.id !== createdItem.id)]);
      setIsAddOpen(false);

      const msg = lang === 'en'
        ? `Word "${createdItem.word}" added to dictionary`
        : `Слово «${createdItem.word}» добавлено в словарь`;
      setSnackbarMessage(msg);
      setSnackbarOpen(true);
    } catch (err: any) {
      setAddError(err?.message || (lang === 'en' ? 'Failed to add word' : 'Ошибка добавления слова'));
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleNoteChange = async (id: number, val: string) => {
    try {
      await updateWordNotesApi(id, val);
      setVocabList((prev) => prev.map((item) => (item.id === id ? { ...item, notes: val } : item)));
    } catch (err) {
      console.error('Server note update failed:', err);
      setSnackbarMessage(lang === 'en' ? 'Failed to update note on server' : 'Ошибка сохранения заметки на сервере');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    const itemToDelete = vocabList.find((i) => i.id === id);
    try {
      await deleteWordApi(id);
      setVocabList((prev) => prev.filter((item) => item.id !== id));
      const msg = itemToDelete
        ? (lang === 'en' ? `Word "${itemToDelete.word}" removed` : `Слово «${itemToDelete.word}» удалено`)
        : (lang === 'en' ? 'Word removed' : 'Слово удалено');
      setSnackbarMessage(msg);
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Server word delete failed:', err);
      setSnackbarMessage(lang === 'en' ? 'Failed to delete word from server' : 'Ошибка удаления слова на сервере');
      setSnackbarOpen(true);
    }
  };

  const handleClearAll = async () => {
    try {
      await Promise.all(vocabList.map((item) => deleteWordApi(item.id)));
      setVocabList([]);
      setSearchQuery('');
      setSnackbarMessage(t('vocabClearedSnackbar'));
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Clear all failed:', err);
      setSnackbarMessage(lang === 'en' ? 'Failed to clear dictionary on server' : 'Ошибка очистки словаря на сервере');
      setSnackbarOpen(true);
    }
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

        {fetchError && (
          <Alert severity="warning" sx={{ mb: 2.5, width: '100%', maxWidth: 780 }}>
            {fetchError}
          </Alert>
        )}

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
              <Button
                size="small"
                variant="contained"
                onClick={handleOpenAdd}
                sx={{
                  backgroundColor: RED_COLOR,
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '6px',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#7A0B0B',
                    boxShadow: 'none',
                  },
                }}
              >
                {lang === 'en' ? '+ Add word' : '+ Добавить слово'}
              </Button>

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
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Button
                variant="contained"
                onClick={handleOpenAdd}
                sx={{
                  backgroundColor: RED_COLOR,
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  px: 2.5,
                  py: 0.8,
                  mb: 1.5,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#7A0B0B',
                    boxShadow: 'none',
                  },
                }}
              >
                {lang === 'en' ? '+ Add first word' : '+ Добавить слово'}
              </Button>
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

        {/* Add Word Modal */}
        <Dialog
          open={isAddOpen}
          onClose={handleCloseAdd}
          maxWidth="xs"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                borderRadius: '12px',
                p: 1,
              },
            },
          }}

        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#111111' }}>
            {lang === 'en' ? 'Add Word to Dictionary' : 'Добавить слово в словарь'}
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {addError && (
              <Alert severity="error" sx={{ py: 0.5 }}>
                {addError}
              </Alert>
            )}
            <TextField
              autoFocus
              label={lang === 'en' ? 'Word / Kanji *' : 'Слово / Иероглифы *'}
              placeholder="今日"
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              fullWidth
              size="small"
              disabled={isSubmitting}
            />
            <TextField
              label={lang === 'en' ? 'Reading (kana)' : 'Чтение (кана)'}
              placeholder="きょう"
              value={readingInput}
              onChange={(e) => setReadingInput(e.target.value)}
              fullWidth
              size="small"
              disabled={isSubmitting}
            />
            <TextField
              label={lang === 'en' ? 'Meaning / Translation' : 'Значение / Перевод'}
              placeholder="сегодня, today"
              value={meaningInput}
              onChange={(e) => setMeaningInput(e.target.value)}
              fullWidth
              size="small"
              disabled={isSubmitting}
            />
            <TextField
              label={lang === 'en' ? 'Note (optional)' : 'Заметка (необязательно)'}
              placeholder="..."
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={2}
              disabled={isSubmitting}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseAdd} disabled={isSubmitting} sx={{ color: '#666666', textTransform: 'none' }}>
              {lang === 'en' ? 'Cancel' : 'Отмена'}
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveNewWord}
              disabled={isSubmitting}
              sx={{
                backgroundColor: RED_COLOR,
                color: '#FFFFFF',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#7A0B0B', boxShadow: 'none' },
              }}
            >
              {isSubmitting ? <CircularProgress size={20} color="inherit" /> : (lang === 'en' ? 'Save' : 'Сохранить')}
            </Button>
          </DialogActions>
        </Dialog>

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

