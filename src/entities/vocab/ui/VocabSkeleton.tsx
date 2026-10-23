import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from '@mui/material';

export const VocabSkeleton = () => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 780,
        overflowX: 'auto',
      }}
    >
      <TableContainer sx={{ backgroundColor: '#FFFFFF', boxShadow: 'none' }}>
        <Table
          sx={{
            borderCollapse: 'collapse',
            '& th, & td': {
              borderBottom: '1px solid #D0D0D0',
              borderRight: '1px solid #D0D0D0',
              padding: '12px 16px',
            },
            '& th:last-child, & td:last-child': {
              borderRight: 'none',
            },
          }}
        >
          <TableHead>
            <TableRow sx={{ borderTop: '1px solid #D0D0D0' }}>
              <TableCell align="center" sx={{ width: 80, fontWeight: 600 }}>№</TableCell>
              <TableCell align="center" sx={{ width: 200, fontWeight: 600 }}>word</TableCell>
              <TableCell align="center" sx={{ width: 220, fontWeight: 600 }}>meaning</TableCell>
              <TableCell align="center" sx={{ width: 240, fontWeight: 600 }}>notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4].map((i) => (
              <TableRow key={i} sx={{ height: 52 }}>
                <TableCell align="center">
                  <Skeleton animation="wave" variant="text" width={24} sx={{ mx: 'auto' }} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton animation="wave" variant="text" width={100} sx={{ mx: 'auto' }} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton animation="wave" variant="text" width={120} sx={{ mx: 'auto' }} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton animation="wave" variant="rectangular" height={30} sx={{ borderRadius: 1 }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
