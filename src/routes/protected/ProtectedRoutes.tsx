import { Navigate, Outlet } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { getCookie, ACCESS_TOKEN_KEY } from '@/utils/storage';
import { useUserStore } from '@/stores/UserStore';

const ProfileLoadError = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center space-y-4">
      <p className="text-gray-600">Failed to load your profile. Please check your connection.</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

const ProtectedRoutes = () => {
  const profileLoadFailed = useUserStore((s) => s.profileLoadFailed);

  if (!getCookie(ACCESS_TOKEN_KEY)) {
    return <Navigate to="/auth/login" replace />;
  }

  if (profileLoadFailed) {
    return <ProfileLoadError />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default ProtectedRoutes;
