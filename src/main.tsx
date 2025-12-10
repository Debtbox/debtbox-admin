import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import './tailwind.css';
import './i18n';
import App from './App.tsx';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={5000}
        theme="light"
        expand
        visibleToasts={3}
        offset={24}
      />
    </QueryClientProvider>
  </StrictMode>,
);
