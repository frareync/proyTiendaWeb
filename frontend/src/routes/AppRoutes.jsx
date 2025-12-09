import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../modules/dashboard/Dashboard';
import Categoria from '../modules/categoria/Categoria';
import Cliente from '../modules/cliente/Cliente';
import Proveedor from '../modules/proveedor/Proveedor';
import Vendedor from '../modules/vendedor/Vendedor';
import Producto from '../modules/producto/Producto';
import Compra from '../modules/compra/Compra';
import Provee from '../modules/provee/Provee';
import Reporte from '../modules/reporte/Reporte';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/categoria" element={<Categoria />} />
      <Route path="/cliente" element={<Cliente />} />
      <Route path="/proveedor" element={<Proveedor />} />
      <Route path="/vendedor" element={<Vendedor />} />
      <Route path="/producto" element={<Producto />} />
      <Route path="/compra" element={<Compra />} />
      <Route path="/provee" element={<Provee />} />
      <Route path="/reporte" element={<Reporte />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
