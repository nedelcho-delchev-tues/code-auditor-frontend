import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import DashboardDrawer from './DashboardDrawer';
import {
    Typography, Divider, Grid, Paper, Button, Alert,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { userInfo } from '../services/userService';
import { getCurrentUser } from '../services/authenticationService';
import { isAdmin, isProfessor } from '../services/userService';

const defaultTheme = createTheme();

function Profile() {
    const [user, setUser] = useState([])
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [isPasswordLongEnough, setIsPasswordLongEnough] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const token = getCurrentUser();
    const [alert, setAlert] = useState({
        openAlert: false,
        type: 'info',
        message: ''
    });


    useEffect(() => {
        fetchUserData();
    }, []);

    async function fetchUserData() {
        try {
            const data = await userInfo();
            setUser(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setPassword('');
        setNewPassword('');
        setNewPasswordRepeat('');
        setIsFormSubmitted(false)
        setOpen(false);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
        setPasswordsMatch(e.target.value === newPasswordRepeat);
        setIsPasswordLongEnough(newPassword.length >= 6);
    };

    const handleNewPasswordRepeatChange = (e) => {
        setNewPasswordRepeat(e.target.value);
        setPasswordsMatch(newPassword === e.target.value);
    };

    const handleChangePassword = async () => {
        console.log("password " + password);
        console.log("newPassword " + newPassword);
        console.log("newPasswordRepeat " + newPasswordRepeat);
        try {
            const response = await fetch(`http://localhost:8080/api/v1/user/${parseInt(user.id)}/change_password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
                body: JSON.stringify({
                    "password": password,
                    "newPassword": newPassword,
                    "newPasswordRepeat": newPasswordRepeat
                })
            });
            const responseData = await response.json();
            setAlert({
                openAlert: true,
                type: 'info',
                message: responseData.message
            });
            if (!response.ok) {
                setAlert({
                    openAlert: true,
                    type: 'error',
                    message: response.message
                });
            }
            if (response.status === 400) {
                setAlert({
                    openAlert: true,
                    type: 'error',
                    message: responseData.message
                });
            }

        } catch (error) {
            setAlert({
                openAlert: true,
                type: 'error',
                message: error.message
            });
        }
        handleClose();
    }

    const handleSubmit = () => {
        setIsFormSubmitted(true);

        if (passwordsMatch && isPasswordLongEnough) {
            handleChangePassword();
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <DashboardDrawer />
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                        pt: 10,
                        px: 3
                    }}
                >
                    {alert.openAlert && (
                        <Alert severity={alert.type} onClose={() => setAlert(prev => ({ ...prev, openAlert: false }))}>
                            {alert.message}
                        </Alert>
                    )}
                    <Paper elevation={3} sx={{ padding: 4 }}>
                        <Typography variant="h4" gutterBottom sx={{ marginBottom: 4 }}>
                            Профил
                        </Typography>

                        <Divider sx={{ my: 4 }} />

                        {user && (isAdmin(user) || isProfessor(user)) ? (
                            <Grid container spacing={5}>
                                <Grid item xs={6}>
                                    <Typography variant="h6">Първо име</Typography>
                                    <Typography gutterBottom>{user.firstName}</Typography>
                                    <Divider sx={{ marginY: 2 }} />

                                    <Typography variant="h6">Титлa</Typography>
                                    <Typography gutterBottom>{user.title}</Typography>
                                    <Divider sx={{ marginY: 2 }} />

                                    <Typography variant="h6">Активен ли е потребителя?</Typography>
                                    <Typography gutterBottom>{user.enabled ? "Активен" : "Неактивен"}</Typography>
                                    <Divider sx={{ marginY: 2 }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h6" >Фамилно име</Typography>
                                    <Typography gutterBottom>{user.lastName}</Typography>
                                    <Divider sx={{ marginY: 2 }} />

                                    <Typography variant="h6">Мейл</Typography>
                                    <Typography gutterBottom>{user.email}</Typography>
                                    <Divider sx={{ marginY: 2 }} />

                                    <Typography variant="h6">Роля</Typography>
                                    <Typography gutterBottom>{user.role}</Typography>
                                    <Divider sx={{ marginY: 2 }} />
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid container spacing={4}>
                                <Grid item xs={6}>
                                    <Typography variant="h6">Първо име</Typography>
                                    <Typography gutterBottom>{user.firstName}</Typography>
                                    <Divider sx={{ marginY: 2 }} />

                                    <Typography variant="h6">Мейл</Typography>
                                    <Typography gutterBottom>{user.email}</Typography>
                                    <Divider sx={{ marginY: 2 }} />

                                    <Typography variant="h6">Факултетен номер</Typography>
                                    <Typography gutterBottom>{user.facultyNumber}</Typography>
                                    <Divider sx={{ marginY: 2 }} />

                                    <Typography variant="h6">Група</Typography>
                                    <Typography gutterBottom>{user.group}</Typography>
                                    <Divider sx={{ marginY: 2 }} />

                                    <Typography variant="h6">Роля</Typography>
                                    <Typography gutterBottom>{user.role}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="h6">Фамилно име</Typography>
                                    <Typography gutterBottom>{user.lastName}</Typography>
                                    <Divider sx={{ marginY: 2 }} />

                                    <Typography variant="h6">Факултет</Typography>
                                    <Typography gutterBottom>{user.faculty}</Typography>
                                    <Divider sx={{ marginY: 2 }} />

                                    <Typography variant="h6">Специалност</Typography>
                                    <Typography gutterBottom>{user.specialization}</Typography>
                                    <Divider sx={{ marginY: 2 }} />

                                    <Typography variant="h6">Поток</Typography>
                                    <Typography gutterBottom>{user.stream}</Typography>
                                    <Divider sx={{ marginY: 2 }} />

                                    <Typography variant="h6">Активен ли е потребителя?</Typography>
                                    <Typography gutterBottom>{user.enabled ? "Активен" : "Неактивен"}</Typography>
                                </Grid>
                            </Grid>
                        )}
                    </Paper>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 2
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                handleOpen();
                            }}
                        >
                            Промяна на парола
                        </Button>
                        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                            <DialogTitle>Промяна на парола</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="oldPassword"
                                    label="Стара парола"
                                    type="password"
                                    fullWidth
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <TextField
                                    error={isFormSubmitted && (!passwordsMatch || !isPasswordLongEnough)}
                                    helperText={isFormSubmitted && (!passwordsMatch ? "Паролите не съвпадат" : (!isPasswordLongEnough ? "Паролата трябва да е повече от 6 символа" : ""))}
                                    margin="dense"
                                    id="newPassword"
                                    label="Нова парола"
                                    type="password"
                                    fullWidth
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                />
                                <TextField
                                    error={isFormSubmitted && (!passwordsMatch || !isPasswordLongEnough)}
                                    helperText={isFormSubmitted && (!passwordsMatch ? "Паролите не съвпадат" : (!isPasswordLongEnough ? "Паролата трябва да е повече от 6 символа" : ""))}
                                    margin="dense"
                                    id="newPasswordRepeat"
                                    label="Повторете новата парола"
                                    type="password"
                                    fullWidth
                                    value={newPasswordRepeat}
                                    onChange={handleNewPasswordRepeatChange}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Отказ
                                </Button>
                                <Button
                                    onClick={() => {
                                        handleSubmit();
                                    }}
                                    variant="contained"
                                    color="primary"
                                >
                                    Промяна
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default Profile;