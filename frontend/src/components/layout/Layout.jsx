import { useState } from 'react';
import { Box, CssBaseline, Toolbar, Container } from '@mui/material';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import Footerbar from './Footerbar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const drawerWidth = 280;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      { }
      <Topbar setIsOpen={setIsSidebarOpen} />

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}

        <Container maxWidth="xl" sx={{ flexGrow: 1, mt: 2 }}>
          {children}
        </Container>

        <Footerbar />
      </Box>
    </Box>
  );
};

export default Layout;
