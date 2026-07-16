import { Navigate, useRoutes } from 'react-router-dom'

import {
  GuestRoute,
  ProtectedRoute,
} from '../components/common/ProtectedRoute'
import { MainLayout } from '../components/layout/MainLayout'
import { AppointmentDetailPage } from '../pages/AppointmentDetailPage'
import { AppointmentListPage } from '../pages/AppointmentListPage'
import { CreateAppointmentPage } from '../pages/CreateAppointmentPage'
import { DashboardPage } from '../pages/DashboardPage'
import { LoginPage } from '../pages/LoginPage'

export function AppRouter() {
  return useRoutes([
    {
      element: <GuestRoute />,
      children: [{ path: '/login', element: <LoginPage /> }],
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: '/',
          element: <MainLayout />,
          children: [
            { index: true, element: <DashboardPage /> },
            { path: 'appointments', element: <AppointmentListPage /> },
            { path: 'appointments/new', element: <CreateAppointmentPage /> },
            { path: 'appointments/:id', element: <AppointmentDetailPage /> },
            { path: '*', element: <Navigate to="/" replace /> },
          ],
        },
      ],
    },
  ])
}
