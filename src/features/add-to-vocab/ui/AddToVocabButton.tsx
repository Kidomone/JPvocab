import { useState } from 'react';
import { Button } from '@mui/material';
import type { WordDetail } from '../../../entities/word';

interface AddToVocabButtonProps {
  word?: WordDetail;
  onAdd?: (word: WordDetail) => void;
}

export const AddToVocabButton = ({ word, onAdd }: AddToVocabButtonProps) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    if (!word) return;
    onAdd?.(word);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Button
      variant="contained"
      onClick={handleAdd}
      sx={{
        backgroundColor: isAdded ? '#2e7d32' : '#000000',
        color: '#FFFFFF',
        borderRadius: '8px',
        py: 1,
        fontSize: '0.88rem',
        fontWeight: 600,
        mb: 3,
        boxShadow: 'none',
        transition: 'background-color 0.2s',
        '&:hover': {
          backgroundColor: isAdded ? '#1b5e20' : '#222222',
          boxShadow: 'none',
        },
      }}
    >
      {isAdded ? 'Добавлено в словарь' : 'Добавить в словарь'}
    </Button>
  );
};
