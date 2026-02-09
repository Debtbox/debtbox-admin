import { Route, Routes } from 'react-router-dom';
import { Login } from '../views/Login';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route>
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
};
