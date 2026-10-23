import { useState, type SyntheticEvent, type ChangeEvent } from 'react';
import {
  Box,
  Button,
  InputBase,
  Typography,
  Collapse,
  CircularProgress,
  type SxProps,
  type Theme,
} from '@mui/material';
import { RED_COLOR, useTranslation } from '../../../shared';

export interface AnalyzeSentenceFormProps {
  initialValue?: string;
  onSubmit: (query: string) => void;
  showSubmitButton?: boolean;
  placeholder?: string;
  buttonText?: string;
  ariaLabel?: string;
  containerSx?: SxProps<Theme>;
  isLoading?: boolean;
}

export const AnalyzeSentenceForm = ({
  initialValue = '',
  onSubmit,
  showSubmitButton = false,
  placeholder,
  buttonText,
  ariaLabel,
  containerSx,
  isLoading = false,
}: AnalyzeSentenceFormProps) => {
  const { t } = useTranslation();
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  const [text, setText] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    setText(initialValue);
    setError(null);
  }

  const validate = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return t('validationEmpty');
    }
    if (trimmed.length > 300) {
      return t('validationLong');
    }
    return null;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = (e?: SyntheticEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    const validationError = validate(text);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onSubmit(text.trim());
  };

  const currentPlaceholder = placeholder || t('homeInputPlaceholder');
  const currentButtonText = buttonText || t('analyzeButton');
  const currentAriaLabel = ariaLabel || t('homeInputAria');

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: 480,
        ...containerSx,
      }}
    >
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#ECECEC',
          borderRadius: '6px',
          px: 2,
          py: 0.8,
          display: 'flex',
          alignItems: 'center',
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: error ? '0 0 0 2px #d32f2f' : 'none',
          '&:focus-within': {
            backgroundColor: '#FFFFFF',
            boxShadow: error ? '0 0 0 2px #d32f2f' : `0 0 0 2px ${RED_COLOR}`,
          },
          mb: error ? 1 : showSubmitButton ? 2.5 : 0,
        }}
      >
        <InputBase
          fullWidth
          value={text}
          onChange={handleChange}
          placeholder={currentPlaceholder}
          disabled={isLoading}
          inputProps={{
            'aria-label': currentAriaLabel,
            style: {
              textAlign: 'center',
              fontSize: '0.95rem',
              color: '#222222',
              fontFamily: "'Noto Sans JP', 'Inter', sans-serif",
            },
          }}
        />
      </Box>

      {/* Error collapse */}
      <Collapse in={Boolean(error)} sx={{ width: '100%', mb: showSubmitButton ? 2 : 0 }}>
        <Typography
          sx={{
            color: '#d32f2f',
            fontSize: '0.82rem',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          {error}
        </Typography>
      </Collapse>

      {showSubmitButton && (
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            borderRadius: '6px',
            px: 3.5,
            py: 0.8,
            fontSize: '0.9rem',
            fontWeight: 600,
            minWidth: 110,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#222222',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} sx={{ color: '#FFFFFF' }} />
              <span>...</span>
            </Box>
          ) : (
            currentButtonText
          )}
        </Button>
      )}
    </Box>
  );
};
