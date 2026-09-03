import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { LodgeDataProvider } from './context/LodgeDataProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LodgeDataProvider>
          <App />
          <Toaster richColors position="top-right" />
        </LodgeDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
