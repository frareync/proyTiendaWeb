import { Box, Grid, Paper, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" gutterBottom component="div" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">Ventas Hoy</Typography>
            <Typography variant="h4">$0.00</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">Clientes Nuevos</Typography>
            <Typography variant="h4">0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">Pedidos Pendientes</Typography>
            <Typography variant="h4">0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">Total Productos</Typography>
            <Typography variant="h4">0</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Actividad Reciente</Typography>
          <Typography variant="body1">Bienvenido al sistema de administración.</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
