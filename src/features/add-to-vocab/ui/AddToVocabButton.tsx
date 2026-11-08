import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  addWordApi,
  isWordSaved,
  isCacheLoaded,
  ensureUserWordsLoaded,
} from '../../../entities/vocab';
import type { WordDetail } from '../../../entities/word';
import { useTranslation } from '../../../shared';
import { useAuth } from '../../../features/auth';

export interface AddToVocabButtonProps {
  word?: WordDetail;
  onAdd?: (word: WordDetail, alreadyExists?: boolean) => void;
}

export const AddToVocabButton = ({ word, onAdd }: AddToVocabButtonProps) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [prevWordKey, setPrevWordKey] = useState<string | undefined>(word?.word);
  const [isSaved, setIsSaved] = useState<boolean>(() => (word ? isWordSaved(word.word) : false));
  const [justAdded, setJustAdded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wordKey = word?.word;

  useEffect(() => {
    if (!isAuthenticated || !wordKey) {
      setIsSaved(false);
      return;
    }

    if (isCacheLoaded()) {
      setIsSaved(isWordSaved(wordKey));
    } else {
      ensureUserWordsLoaded()
        .then((set) => {
          setIsSaved(set.has(wordKey.trim()));
        })
        .catch(() => {});
    }
  }, [wordKey, isAuthenticated]);

  if (word?.word !== prevWordKey) {
    setPrevWordKey(word?.word);
    setIsSaved(word ? isWordSaved(word.word) : false);
    setJustAdded(false);
  }

  const handleAdd = async () => {
    if (!word || isSubmitting) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }

    if (isSaved) {
      onAdd?.(word, true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addWordApi(word);
      setIsSaved(true);
      if (res.alreadyExists) {
        onAdd?.(word, true);
      } else {
        setJustAdded(true);
        onAdd?.(word, false);
        setTimeout(() => {
          setJustAdded(false);
        }, 2200);
      }
    } catch (err) {
      console.error('Failed to add word to backend server:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonLabel = () => {
    if (justAdded) return t('justAdded');
    if (isSaved) return t('inVocab');
    return t('addToVocab');
  };

  const isHighlighted = justAdded || isSaved;

  return (
    <Button
      variant="contained"
      onClick={handleAdd}
      disabled={isSubmitting}
      sx={{
        backgroundColor: isHighlighted ? '#FFFFFF' : '#000000',
        color: isHighlighted ? '#111111' : '#FFFFFF',
        borderRadius: '8px',
        py: 1,
        fontSize: '0.88rem',
        fontWeight: isHighlighted ? 700 : 600,
        mb: 3,
        boxShadow: isHighlighted ? '0 2px 6px rgba(0, 0, 0, 0.18)' : 'none',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          backgroundColor: isHighlighted ? '#F2F2F2' : '#222222',
          color: isHighlighted ? '#000000' : '#FFFFFF',
          boxShadow: isHighlighted ? '0 3px 8px rgba(0, 0, 0, 0.25)' : 'none',
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
      }}
    >
      {getButtonLabel()}
    </Button>
  );
};
