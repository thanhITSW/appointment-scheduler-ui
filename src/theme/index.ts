import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1B4F72',
      light: '#2E86AB',
      dark: '#0E2F44',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#D97706',
      light: '#F59E0B',
      dark: '#B45309',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F0F4F8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A2332',
      secondary: '#5A6A7A',
    },
    success: { main: '#15803D' },
    warning: { main: '#D97706' },
    error: { main: '#B91C1C' },
    info: { main: '#0369A1' },
  },
  typography: {
    fontFamily: '"Source Sans 3", "Segoe UI", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 650 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #D8E1EA',
          backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #F7FAFC 100%)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1A2332',
          boxShadow: 'none',
          borderBottom: '1px solid #D8E1EA',
        },
      },
    },
  },
})

export const statusColors: Record<
  string,
  'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
> = {
  scheduled: 'info',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'default',
  no_show: 'error',
}
