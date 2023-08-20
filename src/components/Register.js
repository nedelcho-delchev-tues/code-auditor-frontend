import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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

export default function Register() {
  const navigate = useNavigate()
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [alert, setAlert] = useState({
    open: false,
    type: 'info',
    message: ''
  });

  const onSubmit = data => {
    console.log(data);
    // Now use the data to make your API call
    register(data);
  };

  const register = async (data) => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();
      if (response.ok) {
        const token = responseData.access_token

        localStorage.setItem("token", token);

        navigate("/dashboard");
        console.log('Data submitted successfully:', responseData);
      } else {
        setAlert({
          openAlert: true,
          type: 'error',
          message: responseData.message
        });
        console.error('Server error:', responseData);
      }
    } catch (error) {
      setAlert({
        openAlert: true,
        type: 'error',
        message: error.message
      });
      console.error('API call failed:', error);
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
            Регистрация
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="firstName"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Първото име е задължително" }}
                  render={({ field }) => <TextField required fullWidth label="Първо име" {...field} error={!!errors.firstName} helperText={errors.firstName?.message} />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="lastName"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Фамилното име е задължително" }}
                  render={({ field }) => <TextField required fullWidth label="Фамилно име" {...field} error={!!errors.firstName} helperText={errors.lastName?.message} />}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Мейлът е задължителен",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Невалиден мейл"
                    }
                  }}
                  render={({ field }) => <TextField required autoComplete='new-email' fullWidth label="Мейл" {...field} error={!!errors.email} helperText={errors.email?.message} />}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Паролата е задължителна",
                    minLength: {
                      value: 6,
                      message: "Паролата трябва да бъде поне 6 символа"
                    }
                  }}
                  render={({ field }) =>
                    <TextField
                      required
                      autoComplete='new-password'
                      fullWidth
                      label="Парола"
                      type="password"
                      {...field}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="facultyNumber"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Факултетният номер е задължителен" }}
                  render={({ field }) => <TextField required fullWidth label="Факултетен номер" {...field} error={!!errors.firstName} helperText={errors.facultyNumber?.message} />}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="faculty"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Факултетът е задължително" }}
                  render={({ field }) => <TextField required fullWidth label="Факултет" {...field} error={!!errors.firstName} helperText={errors.faculty?.message} />}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="specialization"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Специалността е задължителна" }}
                  render={({ field }) => <TextField required fullWidth label="Специалност" {...field} error={!!errors.firstName} helperText={errors.specialization?.message} />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="group"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Групата е задължителна" }}
                  render={({ field }) => <TextField required fullWidth label="Групата" {...field} error={!!errors.firstName} helperText={errors.group?.message} />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="stream"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Потокът е задължителен" }}
                  render={({ field }) => <TextField required fullWidth label="Поток" {...field} error={!!errors.firstName} helperText={errors.stream?.message} />}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Регистрация
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Вече имате акаунт? Вход
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}