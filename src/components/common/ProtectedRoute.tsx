import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { ROUTES } from '../../constants'
import { useAuth } from '../../hooks/authContext'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
    )
  }

  return <Outlet />
}

export function GuestRoute() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <Outlet />
}
