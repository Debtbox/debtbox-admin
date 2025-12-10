// Public routes for authentication pages
// Will be implemented when backend is integrated
export const publicRoutes = [
  {
    path: '/auth/login',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Login</h1>
          <p className="text-gray-600">
            Authentication will be integrated with the backend.
          </p>
        </div>
      </div>
    ),
  },
];
