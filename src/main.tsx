import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter as createRouter, RouterProvider } from 'react-router';
import './index.css'
import Index from './pages/Index.tsx'
import Login from './pages/login.tsx'
import Layout from './components/Layout.tsx'
import RoomList from './pages/RoomList.tsx'
import Room from './pages/Room.tsx'

const router = createRouter([
  { path: '/', element: <Index />, index: true },
  { path: '/login', element: <Login /> },
  { path: '/rooms', element: <RoomList /> },
  { path: '/rooms/:id', element: <Room /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  </StrictMode>,
)
