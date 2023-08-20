import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import DashboardDrawer from './DashboardDrawer';
import {
    Typography, Divider, Grid, Paper, Button, Dialog, DialogTitle,
    DialogContent, TextField, InputLabel, Select, FormControl,
    MenuItem, DialogActions, Alert
} from '@mui/material';
import { isAdmin, isProfessor, userInfo } from '../services/userService';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser } from '../services/authenticationService';

const defaultTheme = createTheme();

function UserDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const token = getCurrentUser();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [title, setTitle] = useState('');
    const [faculty, setFaculty] = useState('');
    const [facultyNumber, setFacultyNumber] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [group, setGroup] = useState('');
    const [stream, setStream] = useState('');
    const [open, setOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({})
    const [user, setUser] = useState({})
    const [alert, setAlert] = useState({
        openAlert: false,
        type: 'info',
        message: ''
    });

    useEffect(() => {
        async function fetchUserData() {
            try {
                const data = await userInfo();
                setCurrentUser(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchUser = () => {
            fetch(`http://localhost:8080/api/v1/admin/user/${parseInt(id)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => {
                    if (response.status === 401) {
                        navigate("/login")
                    }
                    return response.json();
                })
                .then(data => {
                    setFirstName(data.firstName);
                    setLastName(data.lastName);
                    setRole(data.role);
                    setTitle(data.title);
                    setFaculty(data.faculty);
                    setFacultyNumber(data.facultyNumber);
                    setSpecialization(data.specialization);
                    setGroup(data.group);
                    setStream(data.stream);
                    setUser(data);
                })
                .catch(error => {
                    console.error('Error fetching assignments:', error);
                });
        }

        fetchUser();
    }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setRole('')
        setOpen(false);
    };

    const handleUpdate = async (data) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/update-user/${parseInt(id)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
                body: JSON.stringify(data)
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
        } catch (error) {
            setAlert({
                openAlert: true,
                type: 'error',
                message: error
            });
        }
        handleClose();
    }

    const handleDisable = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/disable-user/${parseInt(id)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                }
            });
            const responseData = await response.json();
            if (!response.ok) {
                setAlert({
                    openAlert: true,
                    type: 'error',
                    message: response.message
                });
            }
            setAlert({
                openAlert: true,
                type: 'info',
                message: responseData.message
            });
        } catch (error) {
            setAlert({
                openAlert: true,
                type: 'error',
                message: error
            });
        }
        handleClose();
    }

    const handleEnable = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/enable-user/${parseInt(id)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                }
            });
            const responseData = await response.json();
            if (!response.ok) {
                setAlert({
                    openAlert: true,
                    type: 'error',
                    message: response.message
                });
            }
            setAlert({
                openAlert: true,
                type: 'info',
                message: responseData.message
            });
        } catch (error) {
            setAlert({
                openAlert: true,
                type: 'error',
                message: error
            });
        }
        handleClose();
    }

    const gatherData = () => {
        const data = {
            firstName,
            lastName,
            email,
            role,
            title,
            faculty,
            facultyNumber,
            specialization,
            group,
            stream
        };

        return data;
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
                            Информация за потребителя
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
                        {isAdmin(currentUser) && (<Button
                            variant="contained"
                            color="primary"
                            sx={{ mr: 2 }}
                            onClick={handleOpen}
                        >
                            Промяна
                        </Button>
                        )}

                        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                            <DialogTitle>Промяна на потребител</DialogTitle>
                            <DialogContent>
                                {user && (isAdmin(user) || isProfessor(user)) ? (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                id="firstName"
                                                label="Първо име"
                                                type="text"
                                                fullWidth
                                                defaultValue={user.firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                margin="dense"
                                                id="lastName"
                                                label="Второ име"
                                                type="text"
                                                fullWidth
                                                rows={4}
                                                defaultValue={user.lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                margin="dense"
                                                id="email"
                                                label="Мейл"
                                                type="text"
                                                fullWidth
                                                rows={4}
                                                defaultValue={user.email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                margin="dense"
                                                id="email"
                                                label="Титла"
                                                type="text"
                                                fullWidth
                                                rows={4}
                                                defaultValue={user.title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth margin="dense">
                                                <InputLabel id="role-label">Роля</InputLabel>
                                                <Select
                                                    labelId="role-label"
                                                    id="role"
                                                    defaultValue={user.role}
                                                    onChange={(e) => setRole(e.target.value)}
                                                    label="Роля"
                                                >
                                                    <MenuItem value={"STUDENT"}>STUDENT</MenuItem>
                                                    <MenuItem value={"PROFESSOR"}>PROFESSOR</MenuItem>
                                                    <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>) : (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                id="firstName"
                                                label="Първо име"
                                                type="text"
                                                fullWidth
                                                defaultValue={user.firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                margin="dense"
                                                id="lastName"
                                                label="Второ име"
                                                type="text"
                                                fullWidth
                                                rows={4}
                                                defaultValue={user.lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                margin="dense"
                                                id="faculty"
                                                label="Факултет"
                                                type="text"
                                                fullWidth
                                                rows={4}
                                                defaultValue={user.faculty}
                                                onChange={(e) => setFaculty(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                margin="dense"
                                                id="faculty"
                                                label="Факултетен номер"
                                                type="text"
                                                fullWidth
                                                rows={4}
                                                defaultValue={user.facultyNumber}
                                                onChange={(e) => setFacultyNumber(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                margin="dense"
                                                id="faculty"
                                                label="Специалност"
                                                type="text"
                                                fullWidth
                                                rows={4}
                                                defaultValue={user.specialization}
                                                onChange={(e) => setSpecialization(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                margin="dense"
                                                id="faculty"
                                                label="Група"
                                                type="text"
                                                fullWidth
                                                rows={4}
                                                defaultValue={user.group}
                                                onChange={(e) => setGroup(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                margin="dense"
                                                id="faculty"
                                                label="Поток"
                                                type="text"
                                                fullWidth
                                                rows={4}
                                                defaultValue={user.stream}
                                                onChange={(e) => setStream(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth margin="dense">
                                                <InputLabel id="role-label">Роля</InputLabel>
                                                <Select
                                                    labelId="role-label"
                                                    id="role"
                                                    defaultValue={user.role}
                                                    onChange={(e) => setRole(e.target.value)}
                                                    label="Роля"
                                                >
                                                    <MenuItem value={"STUDENT"}>STUDENT</MenuItem>
                                                    <MenuItem value={"PROFESSOR"}>PROFESSOR</MenuItem>
                                                    <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Отказ
                                </Button>
                                <Button onClick={() => {
                                    const data = gatherData();
                                    console.log("BUTTON CLICK " + JSON.stringify(data));
                                    handleUpdate(data);
                                }} variant="contained" color="primary">
                                    Промяна
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {user && user.enabled === true ? (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    handleDisable();
                                }}
                            >
                                Деактивиране
                            </Button>) : (
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => {
                                    handleEnable();
                                }}
                            >
                                Активиране
                            </Button>)}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default UserDetails;