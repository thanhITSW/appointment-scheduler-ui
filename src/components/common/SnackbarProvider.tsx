import { useCallback, useMemo, useState, type ReactNode } from 'react'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

import { SnackbarContext } from './snackbarContext'

type Severity = 'success' | 'error' | 'info' | 'warning'

interface SnackbarState {
  open: boolean
  message: string
  severity: Severity
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info',
  })

  const showSnackbar = useCallback((message: string, severity: Severity = 'info') => {
    setState({ open: true, message, severity })
  }, [])

  const value = useMemo(() => ({ showSnackbar }), [showSnackbar])

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={4000}
        onClose={() => setState((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={state.severity}
          variant="filled"
          onClose={() => setState((prev) => ({ ...prev, open: false }))}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
