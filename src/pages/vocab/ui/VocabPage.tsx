import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Layout, RED_COLOR } from '../../../shared';
import { initialVocabList, VocabTable, type VocabItem } from '../../../entities';

export const VocabPage = () => {
  const [vocabList, setVocabList] = useState<VocabItem[]>(initialVocabList);

  const handleNoteChange = (id: number, val: string) => {
    setVocabList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes: val } : item))
    );
  };

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
        {/* Title: Словарь */}
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.5rem' },
            color: RED_COLOR,
            textAlign: 'center',
            mb: 4,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Словарь
        </Typography>

        {/* Vocab Table Entity component */}
        <VocabTable items={vocabList} onNoteChange={handleNoteChange} />
      </Box>
    </Layout>
  );
};
