import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RED_COLOR } from '../../../shared';
import { LoginForm } from '../../../features';

export const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: RED_COLOR,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <LoginForm onSuccess={() => navigate('/')} />
    </Box>
  );
};
