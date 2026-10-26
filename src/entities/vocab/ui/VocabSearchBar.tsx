import type { ChangeEvent } from 'react';
import { Box, InputBase, IconButton, Fade } from '@mui/material';
import { RED_COLOR, useTranslation } from '../../../shared';

export interface VocabSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
}

export const VocabSearchBar = ({
  query,
  onQueryChange,
  placeholder,
}: VocabSearchBarProps) => {
  const { t } = useTranslation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
  };

  const handleClear = () => {
    onQueryChange('');
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 780,
        backgroundColor: '#ECECEC',
        borderRadius: '8px',
        px: 2,
        py: 0.8,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          backgroundColor: '#E5E5E5',
        },
        '&:focus-within': {
          backgroundColor: '#FFFFFF',
          boxShadow: `0 0 0 2px ${RED_COLOR}`,
        },
        mb: 2.5,
      }}
    >
      {/* Search Icon */}
      <Box
        component="span"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#777777',
          flexShrink: 0,
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </Box>

      {/* Input */}
      <InputBase
        fullWidth
        value={query}
        onChange={handleChange}
        placeholder={placeholder || t('vocabSearchPlaceholder')}
        inputProps={{
          'aria-label': t('vocabSearchAria'),
          style: {
            fontSize: '0.98rem',
            color: '#1a1a1a',
            fontFamily: "'Noto Sans JP', 'Inter', sans-serif",
            padding: '2px 0',
          },
        }}
      />

      {/* Clear Button */}
      <Fade in={Boolean(query)} timeout={200}>
        <IconButton
          size="small"
          onClick={handleClear}
          aria-label={t('vocabResetSearchBtn')}
          sx={{
            color: '#777777',
            p: 0.5,
            transition: 'color 0.15s, transform 0.15s',
            '&:hover': {
              color: RED_COLOR,
              transform: 'scale(1.1)',
            },
          }}
        >
          <span style={{ fontSize: '0.95rem', lineHeight: 1, fontWeight: 700 }}>✕</span>
        </IconButton>
      </Fade>
    </Box>
  );
};
