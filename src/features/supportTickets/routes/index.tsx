import { Navigate, Route, Routes } from 'react-router-dom';
import {SupportTickets} from '../views/SupportTickets';
import { SupportTicketDetails } from '../views/SupportTicketDetails';
import { CreateSupportTicket } from '../views/CreateSupportTicket';
import { PERMISSIONS } from '@/auth/permissions';
import { RequirePermission } from '@/routes/protected/RequirePermission';

export const SupportTicketsRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequirePermission permissions={[PERMISSIONS.TICKET_READ]}>
            <SupportTickets />
          </RequirePermission>
        }
      />
      <Route
        path="/create"
        element={
          <RequirePermission permissions={[PERMISSIONS.TICKET_CREATE]}>
            <CreateSupportTicket />
          </RequirePermission>
        }
      />
      <Route
        path="/:id"
        element={
          <RequirePermission permissions={[PERMISSIONS.TICKET_READ]}>
            <SupportTicketDetails />
          </RequirePermission>
        }
      />
      <Route path="*" element={<Navigate to="/support-tickets" replace />} />
    </Routes>
  );
};
