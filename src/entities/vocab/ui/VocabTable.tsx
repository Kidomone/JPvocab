import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputBase,
  IconButton,
  Tooltip,
} from '@mui/material';
import { RED_COLOR, useTranslation } from '../../../shared';
import type { VocabItem } from '../model/types';

export interface VocabTableProps {
  items: VocabItem[];
  onNoteChange: (id: number, val: string) => void;
  onDelete?: (id: number) => void;
  minRows?: number;
}

export const VocabTable = ({
  items,
  onNoteChange,
  onDelete,
  minRows = 4,
}: VocabTableProps) => {
  const { t, lang } = useTranslation();
  const emptyRowsCount = Math.max(0, minRows - items.length);

  return (
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
          <TableHead>
            <TableRow sx={{ borderTop: '1px solid #D0D0D0' }}>
              <TableCell
                align="center"
                sx={{
                  width: 70,
                  fontWeight: 600,
                  color: '#222222',
                  fontSize: '1.1rem',
                }}
              >
                {t('tableNum')}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  width: 180,
                  fontWeight: 600,
                  color: '#222222',
                  fontSize: '1.1rem',
                }}
              >
                {t('tableWord')}
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
                {t('tableMeaning')}
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
                {t('tableNotes')}
              </TableCell>
              {onDelete && (
                <TableCell
                  align="center"
                  sx={{
                    width: 50,
                    fontWeight: 600,
                    color: '#222222',
                    p: '8px',
                  }}
                >
                  &nbsp;
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((item, idx) => (
              <TableRow
                key={item.id}
                sx={{
                  height: 52,
                  transition: 'background-color 0.15s ease',
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
                    onChange={(e) => onNoteChange(item.id, e.target.value)}
                    placeholder={t('notesPlaceholder')}
                    fullWidth
                    inputProps={{
                      'aria-label': lang === 'en' ? `Notes for ${item.word}` : `Заметки для ${item.word}`,
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
                {onDelete && (
                  <TableCell align="center" sx={{ p: '4px 8px' }}>
                    <Tooltip title={t('deleteTooltip')} arrow>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(item.id)}
                        sx={{
                          color: '#888888',
                          transition: 'color 0.15s, transform 0.15s',
                          '&:hover': {
                            color: RED_COLOR,
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        <span style={{ fontSize: '1rem', lineHeight: 1 }}>✕</span>
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
              </TableRow>
            ))}

            {Array.from({ length: emptyRowsCount }).map((_, idx) => (
              <TableRow key={`empty-${idx}`} sx={{ height: 52 }}>
                <TableCell align="center">&nbsp;</TableCell>
                <TableCell align="center">&nbsp;</TableCell>
                <TableCell align="center">&nbsp;</TableCell>
                <TableCell align="center">&nbsp;</TableCell>
                {onDelete && <TableCell align="center">&nbsp;</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
