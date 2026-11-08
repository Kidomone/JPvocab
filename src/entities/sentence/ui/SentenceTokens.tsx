import { Box } from '@mui/material';
import { RED_COLOR, useTranslation, parseFurigana } from '../../../shared';
import type { ParsedToken } from '../model/types';
import type { WordDetail } from '../../word';

export interface SentenceTokensProps {
  tokens: ParsedToken[];
  selectedTokenId?: string;
  activeWord?: WordDetail;
  onTokenClick: (detail?: WordDetail, tok?: ParsedToken) => void;
}

export const SentenceTokens = ({
  tokens,
  selectedTokenId,
  activeWord,
  onTokenClick,
}: SentenceTokensProps) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        rowGap: { xs: 2.5, sm: 3 },
        columnGap: 1.5,
        alignItems: 'baseline',
        mb: 8,
      }}
    >
      {tokens.map((tok) => {
        const isSelected = selectedTokenId
          ? tok.id === selectedTokenId
          : Boolean(
              activeWord &&
              (tok.text === activeWord.word ||
               tok.detail?.word === activeWord.word ||
               tok.detail === activeWord)
            );
        return (
          <Box
            key={tok.id}
            onClick={() => onTokenClick(tok.detail, tok)}
            component="span"
            sx={{
              display: 'inline-block',
              fontFamily: "'Noto Sans JP', 'Inter', sans-serif",
              fontSize: { xs: '1.55rem', sm: '1.85rem' },
              fontWeight: 500,
              lineHeight: 1.25,
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
              transform: isSelected ? 'translateY(-2px)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': tok.detail
                ? {
                    backgroundColor: 'rgba(153, 15, 15, 0.08)',
                    transform: isSelected ? 'translateY(-2px)' : 'translateY(-1px)',
                  }
                : {},
              '&:active': tok.detail
                ? {
                    transform: 'scale(0.97)',
                  }
                : {},
            }}
            title={tok.detail ? `${t('tokenTooltip')} ${tok.text}` : undefined}
          >
            {(() => {
              const segments = parseFurigana(tok.text, tok.reading || tok.detail?.reading);
              return segments.map((seg, sIdx) =>
                seg.reading ? (
                  <Box
                    key={sIdx}
                    component="ruby"
                    sx={{
                      rubyPosition: 'over',
                      '& rt': {
                        fontSize: '0.52em',
                        fontWeight: 400,
                        color: '#555555',
                        letterSpacing: '0.02em',
                        userSelect: 'none',
                        fontFamily: "'Noto Sans JP', sans-serif",
                      },
                    }}
                  >
                    {seg.text}
                    <rt>{seg.reading}</rt>
                  </Box>
                ) : (
                  <span key={sIdx}>{seg.text}</span>
                )
              );
            })()}
          </Box>
        );
      })}
    </Box>
  );
};

