import { Outlet } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

const ProtectedRoutes = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default ProtectedRoutes;
