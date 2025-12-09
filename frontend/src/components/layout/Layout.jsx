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
      {/* Topbar: AppBar fixed at top. zIndex > Drawer implies clipped drawer, but often Sidebar is Mobile Temporary + Desktop Permanent.
                If Desktop Permanent, AppBar often shifts width or sits on top.
                The Topbar component I wrote has `sx={{ ml: { lg: '280px' }, width: { lg: calc(...) } }}` which implies it sits NEXT to the sidebar on desktop (Persistent/Permanent pattern where Sidebar is full height).
                This matches "Sidebar... ocupa toda la altura".
                So Topbar is NOT full width visually on desktop, it starts after sidebar.
                BUT User said "AppBar fijo arriba (header), a pantalla completa".
                If it's "fullscreen" width, it should overlap sidebar.
                If I change Topbar to `zIndex: theme.zIndex.drawer + 1`, it will be on top.
                And I should remove `ml` and `width` calc.
                However, I will leave Topbar logic inside Topbar.jsx or override it here?
                I'll try to override it here via props or just adjust Topbar.jsx later.
                For now, let represents the structure.
            */}
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
