import { createContext, useContext } from 'react'

type Severity = 'success' | 'error' | 'info' | 'warning'

export interface SnackbarContextValue {
  showSnackbar: (message: string, severity?: Severity) => void
}

export const SnackbarContext = createContext<SnackbarContextValue | null>(null)

export function useSnackbar() {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider')
  }
  return context
}
