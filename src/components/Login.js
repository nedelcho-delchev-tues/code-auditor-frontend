import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { login } from '../services/authenticationService.js';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Code Auditor
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate()
  const [alert, setAlert] = useState({
    open: false,
    type: 'info',
    message: ''
  });
  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    try {
      const token = await login(data.get("email"), data.get("password"));

      localStorage.setItem("token", token);
      navigate("/dashboard")
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        setAlert({
          open: true,
          type: 'error',
          message: 'Няма връзка към сървъра. Моля проверете свързаността си с интернет и опитайте отново'
        });
      } else {
        setAlert({
          open: true,
          type: 'error',
          message: error.message
        });
      }
      console.error('Login error:', error.message);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {alert.open && (
            <Alert severity={alert.type} onClose={() => setAlert(prev => ({ ...prev, open: false }))}>
              {alert.message}
            </Alert>
          )}
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Вход
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Мейл"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Парола"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Вход
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Забравена парола?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Нямате акаунт? Регистрация"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}