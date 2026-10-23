import { useState } from 'react';
import { Button } from '@mui/material';
import { addWordToVocab, isWordSaved } from '../../../entities/vocab';
import type { WordDetail } from '../../../entities/word';
import { useTranslation } from '../../../shared';

export interface AddToVocabButtonProps {
  word?: WordDetail;
  onAdd?: (word: WordDetail) => void;
}

export const AddToVocabButton = ({ word, onAdd }: AddToVocabButtonProps) => {
  const { t } = useTranslation();
  const [prevWordKey, setPrevWordKey] = useState<string | undefined>(word?.word);
  const [isSaved, setIsSaved] = useState<boolean>(() => (word ? isWordSaved(word.word) : false));
  const [justAdded, setJustAdded] = useState(false);

  if (word?.word !== prevWordKey) {
    setPrevWordKey(word?.word);
    setIsSaved(word ? isWordSaved(word.word) : false);
    setJustAdded(false);
  }

  const handleAdd = () => {
    if (!word) return;
    addWordToVocab(word);
    setIsSaved(true);
    setJustAdded(true);
    onAdd?.(word);
    setTimeout(() => {
      setJustAdded(false);
    }, 2200);
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
