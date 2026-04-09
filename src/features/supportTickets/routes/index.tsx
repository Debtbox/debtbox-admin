import { Navigate, Route, Routes } from 'react-router-dom';
import {SupportTickets} from '../views/SupportTickets';
import { SupportTicketDetails } from '../views/SupportTicketDetails';
import { CreateSupportTicket } from '../views/CreateSupportTicket';

export const SupportTicketsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SupportTickets />} />
      <Route path="/create" element={<CreateSupportTicket />} />
      <Route path="/:id" element={<SupportTicketDetails />} />
      <Route path="*" element={<Navigate to="/support-tickets" replace />} />
    </Routes>
  );
};
