import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="h-screen flex bg-[#FAFAFAF]">
      <div
        className={clsx(
          isSidebarCollapsed ? 'w-16' : 'w-64',
          'hidden md:block transition-all duration-300 flex-shrink-0',
        )}
      >
        <Sidebar isCollapsed={isSidebarCollapsed} />
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-30 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          onMenuToggle={toggleMobileMenu}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">{children}</div>
        </main>
      </div>
      <div
        className={clsx(
          'fixed inset-y-0 start-0 z-40 w-64 bg-white transform transition-transform duration-300 ease-in-out md:hidden',
          isMobileMenuOpen
            ? 'translate-x-0'
            : i18n.language === 'ar'
              ? 'translate-x-full'
              : '-translate-x-full',
        )}
      >
        <Sidebar
          isCollapsed={false}
          onToggle={() => {
            toggleMobileMenu();
            toggleSidebar();
          }}
        />
      </div>
    </div>
  );
};

export default MainLayout;
