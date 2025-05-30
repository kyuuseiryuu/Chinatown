import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter as createRouter, RouterProvider } from 'react-router';
import './index.css'
import Index from './pages/Index.tsx'
import Login from './pages/login.tsx'
import Layout from './components/Layout.tsx'
import RoomList from './pages/RoomList.tsx'
import Room from './pages/Room.tsx'
import LogToCallback from './pages/LogToCallback.tsx'

const router = createRouter([
  { path: '/', element: <Index />, index: true },
  { path: '/callback', element: <LogToCallback /> },
  { path: '/login', element: <Login /> },
  { path: '/rooms', element: <RoomList /> },
  { path: '/rooms/:id', element: <Room /> },
]);

import { LogtoProvider, LogtoConfig } from '@logto/react';

const config: LogtoConfig = {
  endpoint: 'https://logto.ksr.la/',
  appId: 'u0wcs2oyzaj3j38s4bsy8',
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LogtoProvider config={config}>
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </LogtoProvider>
  </StrictMode>,
)
