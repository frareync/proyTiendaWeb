import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Store as StoreIcon,
  Group as GroupIcon,
  LocalShipping as LocalShippingIcon,
  Work as WorkIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Input as InputIcon,
  PictureAsPdf as PdfIcon,
  AdminPanelSettings as AdminPanelSettingsIcon
} from '@mui/icons-material';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Divider, Button, Toolbar
} from '@mui/material';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { id: 'categoria', path: '/categoria', icon: PersonIcon, label: 'Categorias' },
    { id: 'cliente', path: '/cliente', icon: GroupIcon, label: 'Clientes' },
    { id: 'proveedor', path: '/proveedor', icon: LocalShippingIcon, label: 'Proveedores' },
    { id: 'vendedor', path: '/vendedor', icon: WorkIcon, label: 'Vendedores' },
    { id: 'producto', path: '/producto', icon: InventoryIcon, label: 'Gestionar Productos' },
    { id: 'compra_admin', path: '/compra', icon: ShoppingCartIcon, label: 'Registro Ventas' },
    { id: 'provee', path: '/provee', icon: InputIcon, label: 'Registrar Suministros' },
    { id: 'reporte', path: '/reporte', icon: PdfIcon, label: 'Reporte de Ventas' },
    { id: 'usuario', path: '/usuario', icon: AdminPanelSettingsIcon, label: 'Gestión Usuarios' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (setIsOpen) setIsOpen(false);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            bgcolor: '#2C7873',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: 1
          }}
        >
          SrAi
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="bold" color="text.primary">Sistema de Venta Tienda "Sarai"</Typography>
          <Typography variant="caption" color="text.secondary">Panel de Administración</Typography>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block', mb: 1, pl: 1 }}>
          MENÚ PRINCIPAL
        </Typography>
        <List component="nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: '#2C7873',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#205e5a',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'white' : 'inherit' }}>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={() => {
            // Lógica para Cerrar Sesión:
            // 1. Limpiamos la "llave" de acceso (token) y el rol del almacenamiento local.
            localStorage.removeItem('token');
            localStorage.removeItem('rol');
            // 2. Redirigimos al usuario a la pantalla de Login.
            navigate('/login');
          }}
          sx={{
            bgcolor: '#e0e0e0',
            color: 'black',
            '&:hover': {
              bgcolor: '#004445',
              color: 'white'
            },
            boxShadow: 'none',
            textTransform: 'none',
            justifyContent: 'center'
          }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, borderRight: '1px solid #e0e0e0' },
          width: 280,
          flexShrink: 0,
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
