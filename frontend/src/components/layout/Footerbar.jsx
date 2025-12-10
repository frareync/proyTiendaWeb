import { Box, Typography } from '@mui/material';

const Footerbar = () => {
  return (
    <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800] }}>
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        Sistema de Venta Tienda "Sarai" {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Box>
  );
};

export default Footerbar;
