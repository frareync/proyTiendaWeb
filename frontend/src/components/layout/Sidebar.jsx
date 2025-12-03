import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, LogOut, Store, Users, Truck, Briefcase, Package } from 'lucide-react';
import { colors } from '../../styles/colors';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', icon: Home, label: 'Dashboard' },
    { id: 'categoria', path: '/categoria', icon: User, label: 'Categorias' },
    { id: 'cliente', path: '/cliente', icon: Users, label: 'Clientes' },
    { id: 'proveedor', path: '/proveedor', icon: Truck, label: 'Proveedores' },
    { id: 'vendedor', path: '/vendedor', icon: Briefcase, label: 'Vendedores' },
    { id: 'producto', path: '/producto', icon: Package, label: 'Gestionar Productos' },
    { id: 'compra', path: '/store', icon: Store, label: 'Tienda' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 w-72 border-r`}
        style={{
          backgroundColor: colors.white,
          borderColor: colors.gray200
        }}
      >
        <div className="h-20 px-6 flex items-center border-b" style={{ borderColor: colors.gray200 }}>
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-sm"
              style={{ backgroundColor: colors.primary }}
            >
              MS
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ color: colors.dark }}>MiSistema</h1>
              <p className="text-xs" style={{ color: colors.gray600 }}>Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: colors.gray600 }}>
            Menú Principal
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive ? '' : 'hover:bg-gray-100'
                  }`}
                style={{
                  backgroundColor: isActive ? colors.primary : 'transparent',
                  color: isActive ? colors.white : colors.gray900
                }}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={20} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>

              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            className="w-full mt-2 flex items-center justify-center space-x-2 px-4 py-2.5
                      rounded-lg transition-all font-medium text-sm
                      bg-gray-300 text-gray-900 hover:bg-[#004445] hover:text-white"
          >

            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
