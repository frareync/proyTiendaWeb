import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from '../modules/dashboard/Dashboard';
import Categoria from '../modules/categoria/Categoria';
import Cliente from '../modules/cliente/Cliente';
import Proveedor from '../modules/proveedor/Proveedor';
import Vendedor from '../modules/vendedor/Vendedor';
import Producto from '../modules/producto/Producto';
import Compra from '../modules/compra/Compra';
import Provee from '../modules/provee/Provee';
import Reporte from '../modules/reporte/Reporte';
import Login from '../modules/auth/Login';
import Usuario from '../modules/usuario/Usuario';
import Layout from '../components/layout/Layout';

const AppRoutes = () => {

  // --- COMPONENTE DE RUTA PRIVADA ---
  // Este componente actúa como un guardián.
  // Si no hay token, redirige al Login.
  // Si hay token, renderiza los hijos (children).
  const RutaPrivada = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  // --- WRAPPER DEL LAYOUT ---
  // Este componente envuelve las rutas internas con el Layout (Sidebar + Header).
  // Usamos <Outlet /> para indicar dónde se renderizará el componente de la ruta hija.
  const LayoutWrapper = () => (
    <Layout>
      <Outlet />
    </Layout>
  );

  return (
    <Routes>
      {/* 1. RUTA PÚBLICA: LOGIN */}
      {/* Esta ruta NO tiene Layout (Sidebar/Header), se ve a pantalla completa */}
      <Route path="/login" element={<Login />} />

      {/* 2. REDIRECCIÓN INICIAL */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 3. RUTAS PROTEGIDAS (PRIVADAS) */}
      {/*
          Aquí usamos un anidamiento:
          - Primero, RutaPrivada verifica el token.
          - Segundo, LayoutWrapper pone el Sidebar y Header.
          - Tercero, Outlet renderiza el componente específico (Dashboard, Cliente, etc.)
      */}
      <Route element={<RutaPrivada><LayoutWrapper /></RutaPrivada>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categoria" element={<Categoria />} />
        <Route path="/cliente" element={<Cliente />} />
        <Route path="/proveedor" element={<Proveedor />} />
        <Route path="/vendedor" element={<Vendedor />} />
        <Route path="/producto" element={<Producto />} />
        <Route path="/compra" element={<Compra />} />
        <Route path="/provee" element={<Provee />} />
        <Route path="/reporte" element={<Reporte />} />
        <Route path="/usuario" element={<Usuario />} />
      </Route>

      {/* 4. RUTA 404 / CUALQUIER OTRA */}
      {/* Si escriben algo raro, los mandamos al dashboard (que validará login) */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
