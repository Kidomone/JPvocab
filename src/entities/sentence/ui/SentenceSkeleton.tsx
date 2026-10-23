import { Box, Skeleton } from '@mui/material';

export const SentenceSkeleton = () => {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', pt: 2 }}>
      {/* Tokens skeleton chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 8 }}>
        <Skeleton animation="wave" variant="rounded" width={80} height={46} sx={{ borderRadius: '6px' }} />
        <Skeleton animation="wave" variant="rounded" width={40} height={46} sx={{ borderRadius: '6px' }} />
        <Skeleton animation="wave" variant="rounded" width={90} height={46} sx={{ borderRadius: '6px' }} />
        <Skeleton animation="wave" variant="rounded" width={40} height={46} sx={{ borderRadius: '6px' }} />
        <Skeleton animation="wave" variant="rounded" width={100} height={46} sx={{ borderRadius: '6px' }} />
        <Skeleton animation="wave" variant="rounded" width={70} height={46} sx={{ borderRadius: '6px' }} />
      </Box>

      {/* Translation skeleton */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Skeleton animation="wave" variant="text" width={100} height={28} />
        <Skeleton animation="wave" variant="text" width="90%" height={24} />
        <Skeleton animation="wave" variant="text" width="70%" height={20} />
      </Box>
    </Box>
  );
};
