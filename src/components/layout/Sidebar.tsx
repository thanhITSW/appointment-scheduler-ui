import { NavLink } from 'react-router-dom'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { DRAWER_WIDTH, ROUTES } from '../../constants'
import { t } from '../../i18n'

const navItems = [
  {
    label: t('nav.dashboard'),
    to: ROUTES.dashboard,
    icon: <DashboardOutlinedIcon />,
    end: true,
  },
  {
    label: t('nav.appointments'),
    to: ROUTES.appointments,
    icon: <CalendarMonthOutlinedIcon />,
    end: false,
  },
]

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ px: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} color="primary.main">
          {t('app.name')}
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.5, py: 2 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            sx={{
              mb: 0.5,
              borderRadius: 1.5,
              '&.active': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': { color: 'inherit' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <NavContent onNavigate={onClose} />
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <NavContent />
      </Drawer>
    </Box>
  )
}
