import { Box } from '@mui/material';
import { RED_COLOR } from '../../../shared';
import type { ParsedToken } from '../model/types';
import type { WordDetail } from '../../word';

interface SentenceTokensProps {
  tokens: ParsedToken[];
  activeWord?: WordDetail;
  onTokenClick: (detail?: WordDetail) => void;
}

export const SentenceTokens = ({
  tokens,
  activeWord,
  onTokenClick,
}: SentenceTokensProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        alignItems: 'baseline',
        mb: 8,
      }}
    >
      {tokens.map((tok) => {
        const isSelected = activeWord?.word === tok.text;
        return (
          <Box
            key={tok.id}
            onClick={() => onTokenClick(tok.detail)}
            component="span"
            sx={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: { xs: '1.75rem', sm: '2.1rem' },
              fontWeight: 500,
              color: '#000000',
              cursor: tok.detail ? 'pointer' : 'default',
              px: 0.8,
              py: 0.2,
              borderRadius: '6px',
              backgroundColor: isSelected
                ? 'rgba(153, 15, 15, 0.12)'
                : 'transparent',
              borderBottom: isSelected
                ? `3px solid ${RED_COLOR}`
                : '3px solid transparent',
              transition: 'all 0.15s ease-in-out',
              '&:hover': tok.detail
                ? {
                    backgroundColor: 'rgba(153, 15, 15, 0.08)',
                  }
                : {},
            }}
            title={tok.detail ? `Кликните для разбора: ${tok.text}` : undefined}
          >
            {tok.text}
          </Box>
        );
      })}
    </Box>
  );
};
