import { Menu, Search, ChevronDown } from 'lucide-react';
import { colors } from '../../styles/colors';

const Topbar = ({ setIsOpen }) => {
  return (
    <header
      className="fixed top-0 right-0 left-0 lg:left-72 h-16 z-30 border-b backdrop-blur-md"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: colors.gray200
      }}
    >
      <div className="h-full flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-4 flex-1">
          
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-opacity-80 transition-all"
            onClick={() => setIsOpen(true)}
            style={{ backgroundColor: colors.gray100 }}
          >
            <Menu size={20} style={{ color: colors.gray900 }} />
          </button>

          <div className="hidden md:flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                size={18} 
                style={{ color: colors.gray600 }} 
              />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border outline-none transition-all text-sm focus:ring-2"
                style={{ 
                  backgroundColor: colors.white,
                  borderColor: colors.gray200,
                  color: colors.dark
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          
          <button 
            className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-opacity-80 transition-all" 
            style={{ backgroundColor: colors.gray100 }}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{ backgroundColor: colors.primary }}
            >
              AD
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold" style={{ color: colors.dark }}>Admin</p>
              <p className="text-xs" style={{ color: colors.gray600 }}>En línea</p>
            </div>
            <ChevronDown 
              size={14} 
              style={{ color: colors.gray600 }} 
              className="hidden sm:block" 
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
