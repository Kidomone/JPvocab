import { useState, type SyntheticEvent } from 'react';
import { Box, Button, InputBase, type SxProps, type Theme } from '@mui/material';

interface AnalyzeSentenceFormProps {
  initialValue?: string;
  onSubmit: (query: string) => void;
  showSubmitButton?: boolean;
  placeholder?: string;
  buttonText?: string;
  ariaLabel?: string;
  containerSx?: SxProps<Theme>;
}

export const AnalyzeSentenceForm = ({
  initialValue = '',
  onSubmit,
  showSubmitButton = false,
  placeholder = 'Например, こんにちは',
  buttonText = 'Разобрать',
  ariaLabel = 'японский текст для разбора',
  containerSx,
}: AnalyzeSentenceFormProps) => {
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  const [text, setText] = useState(initialValue);

  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    setText(initialValue);
  }

  const handleSubmit = (e?: SyntheticEvent) => {
    if (e) e.preventDefault();
    onSubmit(text);
  };

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
          transition: 'background-color 0.2s, box-shadow 0.2s',
          '&:focus-within': {
            backgroundColor: '#E2E2E2',
            boxShadow: '0 0 0 2px #990f0f58',
          },
          mb: showSubmitButton ? 2.5 : 0,
        }}
      >
        <InputBase
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          inputProps={{
            'aria-label': ariaLabel,
            style: {
              textAlign: 'center',
              fontSize: '0.95rem',
              color: '#222222',
              fontFamily: "'Noto Sans JP', 'Inter', sans-serif",
            },
          }}
        />
      </Box>

      {showSubmitButton && (
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            borderRadius: '6px',
            px: 3.5,
            py: 0.8,
            fontSize: '0.9rem',
            fontWeight: 600,
            minWidth: 110,
            '&:hover': {
              backgroundColor: '#222222',
            },
          }}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
};
