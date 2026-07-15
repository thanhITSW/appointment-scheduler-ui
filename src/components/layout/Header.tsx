import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { DRAWER_WIDTH, ROUTES } from '../../constants'
import { useAuth } from '../../hooks/authContext'
import { t } from '../../i18n'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const initials = (user?.employeeId || 'SA').slice(0, 2).toUpperCase()

  const handleLogout = async () => {
    setAnchorEl(null)
    await logout()
    void navigate(ROUTES.login, { replace: true })
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' }, mr: 1 }}
          aria-label="Open navigation"
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {t('app.name')}
        </Typography>
        <Box sx={{ flexGrow: { xs: 1, sm: 0 } }} />
        <IconButton color="inherit" aria-label="Notifications">
          <NotificationsNoneOutlinedIcon />
        </IconButton>
        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem disabled>
            <Typography variant="body2">{user?.employeeId}</Typography>
          </MenuItem>
          <MenuItem onClick={() => void handleLogout()}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            {t('login.logout')}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
