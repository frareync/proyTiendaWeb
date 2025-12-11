import { Box, Grid, Paper, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" gutterBottom component="div" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>

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
