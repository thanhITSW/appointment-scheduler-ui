import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useSnackbar } from '../components/common/snackbarContext'
import { ROUTES } from '../constants'
import { useAuth } from '../hooks/authContext'
import { t } from '../i18n'
import { loginSchema, type LoginFormValues } from '../schemas/appointment.schema'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { showSnackbar } = useSnackbar()
  const from =
    (location.state as { from?: string } | null)?.from || ROUTES.dashboard

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'advisor@dealership.com',
      password: 'password',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values)
      showSnackbar(t('login.success'), 'success')
      void navigate(from, { replace: true })
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : t('login.error'),
        'error',
      )
    }
  })

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: 2,
        background:
          'radial-gradient(circle at top left, rgba(46, 134, 171, 0.18), transparent 42%), radial-gradient(circle at bottom right, rgba(217, 119, 6, 0.14), transparent 40%), #F0F4F8',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: { xs: 3, sm: 4 },
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack spacing={2.5} component="form" onSubmit={(e) => void onSubmit(e)}>
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                mx: 'auto',
                mb: 1.5,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <LockOutlinedIcon />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {t('login.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('app.name')} — {t('login.subtitle')}
            </Typography>
          </Box>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('login.email')}
                type="email"
                autoComplete="email"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('login.password')}
                type="password"
                autoComplete="current-password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                fullWidth
              />
            )}
          />

          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {t('login.submit')}
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
            {t('login.hint')}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  )
}
