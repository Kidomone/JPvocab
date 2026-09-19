import { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputBase,
} from '@mui/material';
import { Layout } from '../components/Layout';
import { RED_COLOR } from '../theme';

interface DemoVocabItem {
  id: number;
  word: string;
  meaning: string;
  notes: string;
}

const initialDemoVocab: DemoVocabItem[] = [
  {
    id: 1,
    word: '今日',
    meaning: 'today',
    notes: 'сегодня',
  },
];

export const VocabPage = () => {
  const [vocabList, setVocabList] = useState<DemoVocabItem[]>(initialDemoVocab);

  const handleNoteChange = (id: number, val: string) => {
    setVocabList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes: val } : item))
    );
  };

  const minRows = 4;
  const emptyRowsCount = Math.max(0, minRows - vocabList.length);

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

        {/* Table Container */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 780,
            overflowX: 'auto',
          }}
        >
          <TableContainer
            sx={{
              backgroundColor: '#FFFFFF',
              boxShadow: 'none',
            }}
          >
            <Table
              sx={{
                borderCollapse: 'collapse',
                '& th, & td': {
                  borderBottom: '1px solid #D0D0D0',
                  borderRight: '1px solid #D0D0D0',
                  padding: '12px 16px',
                  fontSize: '1.05rem',
                },
                '& th:last-child, & td:last-child': {
                  borderRight: 'none',
                },
              }}
            >
              {/* Header */}
              <TableHead>
                <TableRow sx={{ borderTop: '1px solid #D0D0D0' }}>
                  <TableCell
                    align="center"
                    sx={{
                      width: 80,
                      fontWeight: 600,
                      color: '#222222',
                      fontSize: '1.1rem',
                    }}
                  >
                    №
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      width: 200,
                      fontWeight: 600,
                      color: '#222222',
                      fontSize: '1.1rem',
                    }}
                  >
                    word
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      width: 220,
                      fontWeight: 600,
                      color: '#222222',
                      fontSize: '1.1rem',
                    }}
                  >
                    meaning
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      width: 240,
                      fontWeight: 600,
                      color: '#222222',
                      fontSize: '1.1rem',
                    }}
                  >
                    notes
                  </TableCell>
                </TableRow>
              </TableHead>

              {/* Body */}
              <TableBody>
                {vocabList.map((item, idx) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      height: 52,
                      transition: 'background-color 0.15s',
                      '&:hover': {
                        backgroundColor: '#FAFAFA',
                      },
                    }}
                  >
                    <TableCell align="center" sx={{ color: '#222222' }}>
                      {idx + 1}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontWeight: 500,
                        fontSize: '1.15rem',
                        color: '#111111',
                      }}
                    >
                      {item.word}
                    </TableCell>
                    <TableCell align="center" sx={{ color: '#222222' }}>
                      {item.meaning}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: '#222222',
                        p: '6px 8px',
                      }}
                    >
                      <InputBase
                        value={item.notes}
                        onChange={(e) => handleNoteChange(item.id, e.target.value)}
                        placeholder="Добавить заметку..."
                        fullWidth
                        inputProps={{
                          'aria-label': `Заметки для ${item.word}`,
                          style: {
                            textAlign: 'center',
                            fontSize: '1.05rem',
                            color: '#222222',
                            padding: '4px 8px',
                          },
                        }}
                        sx={{
                          borderRadius: '4px',
                          transition: 'all 0.15s ease-in-out',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: '#FFFFFF',
                            boxShadow: `0 0 0 1.5px ${RED_COLOR}`,
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}

                {/* Empty placeholder rows */}
                {Array.from({ length: emptyRowsCount }).map((_, idx) => (
                  <TableRow key={`empty-${idx}`} sx={{ height: 52 }}>
                    <TableCell align="center">&nbsp;</TableCell>
                    <TableCell align="center">&nbsp;</TableCell>
                    <TableCell align="center">&nbsp;</TableCell>
                    <TableCell align="center">&nbsp;</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Layout>
  );
};
