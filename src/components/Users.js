import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { getCurrentUser } from '../services/authenticationService';
import { userInfo } from '../services/userService';
import DashboardDrawer from './DashboardDrawer';
import { assembleUserName } from '../services/userService';

const defaultTheme = createTheme();

const canOperateUsers = (user) => {
    if (user.role !== 'ADMIN') return false;
    return true;
};

function Users() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [users, setUsers] = useState([])
    const [dialogType, setDialogType] = useState('create');
    const [editingUser, setEditingUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState([])
    const [alert, setAlert] = useState({
        open: false,
        type: 'info',
        message: ''
    });

    const navigate = useNavigate();
    const token = getCurrentUser();

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = () => {
        fetch('http://localhost:8080/api/v1/admin/all_users',
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
                setUsers(data);
            })
            .catch(error => {
                console.error('Error fetching assignments:', error);
            });
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    async function fetchUserData() {
        try {
            const data = await userInfo();
            setCurrentUser(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const handleRowClick = (id) => {
        navigate(`/users/${id}`);
    };

    const handleEditClick = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                setAlert({
                    open: true,
                    type: 'error',
                    message: response.message
                });
            }

            const responseData = await response.json();
            console.log(responseData)
            setFirstName(responseData.firstName);
            setLastName(responseData.lastName);
            setEmail(responseData.email);
            setRole(responseData.role);
            setEditingUser(responseData);
            setDialogType('update');
            setOpen(true);
        } catch (error) {
            setAlert({
                open: true,
                type: 'info',
                message: error
            });
        }
    }

    const handleDeleteClick = () => {

    }

    const handleOpen = () => {
        setDialogType('create');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const gatherData = () => {
        // const data = {
        //     title,
        //     description,
        //     specialFiles: fileFields.map(file => file.value)
        // };

        // return data;
    };

    const handleSubmit = async (data) => {
        // try {
        //     const response = await fetch('http://localhost:8080/api/v1/assignment', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${token}`

        //         },
        //         body: JSON.stringify(data)
        //     });
        //     const responseData = await response.json();
        //     setAlert({
        //         open: true,
        //         type: 'info',
        //         message: responseData.message
        //     });
        // } catch (error) {
        //     setAlert({
        //         open: true,
        //         type: 'error',
        //         message: error.message
        //     });
        // }
        // handleClose();
        // setTitle("");
        // setDescription("");
        // setFileFields([{ value: '' }]);
    }

    const handleUpdate = async (data) => {
        // try {
        //     const response = await fetch(`http://localhost:8080/api/v1/assignment/${parseInt(editingAssignment.id)}`, {
        //         method: 'PUT',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${token}`

        //         },
        //         body: JSON.stringify(data)
        //     });
        //     const responseData = await response.json();
        //     if (!response.ok) {
        //         setAlert({
        //             open: true,
        //             type: 'error',
        //             message: response.message
        //         });
        //     }
        //     setAlert({
        //         open: true,
        //         type: 'info',
        //         message: responseData.message
        //     });
        // } catch (error) {
        //     setAlert({
        //         open: true,
        //         type: 'error',
        //         message: error
        //     });
        // }
        // handleClose();
        // setTitle("");
        // setDescription("");
        // setFileFields([{ value: '' }]);
    }
    console.log(users);
    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <DashboardDrawer></DashboardDrawer>
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
                    {alert.open && (
                        <Alert severity={alert.type} onClose={() => setAlert(prev => ({ ...prev, open: false }))}>
                            {alert.message}
                        </Alert>
                    )}
                    <Typography variant="h5" align="center" marginBottom={1}>
                        Потребители
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Име</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Статус на потребителя</TableCell>
                                    {canOperateUsers(currentUser) && (
                                        <TableCell sx={{ fontWeight: 'bold' }}
                                        >
                                        </TableCell>
                                    )}
                                    {canOperateUsers(currentUser) && (
                                        <TableCell sx={{ fontWeight: 'bold' }}
                                        >
                                        </TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map(user => (
                                    <TableRow
                                        key={user.id}
                                        onClick={() => handleRowClick(user.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>{assembleUserName(user)}</TableCell>
                                        <TableCell >{user.enabled ? "Активен" : "Неактивен"}</TableCell>
                                        {canOperateUsers(currentUser) && (
                                            <TableCell>
                                                <Button variant="contained" onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(user.id)
                                                }}>Актуализация
                                                </Button>
                                            </TableCell>
                                        )}
                                        {canOperateUsers(currentUser) && (
                                            <TableCell>
                                                <Button variant="contained" color="error" onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(user.id);
                                                }}>
                                                    Изтрий
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 2 }}>
                        {canOperateUsers(currentUser) && (<Button
                            variant="contained"
                            color="primary"
                            sx={{
                                boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)'
                            }}
                            onClick={handleOpen}
                        >
                            Създай персонал
                        </Button>
                        )}

                        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                            {dialogType === 'create' ? (
                                <DialogTitle>Създаване на персонал</DialogTitle>
                            ) : (
                                <DialogTitle>Промяна на потребител</DialogTitle>
                            )}
                            <DialogContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="firstName"
                                            label="Първо име"
                                            type="text"
                                            fullWidth
                                            defaultValue={dialogType === 'create' ? firstName : editingUser.firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            margin="dense"
                                            id="description"
                                            label="Второ име"
                                            type="text"
                                            fullWidth
                                            rows={4}
                                            defaultValue={dialogType === 'create' ? lastName : editingUser.lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            margin="dense"
                                            id="description"
                                            label="Мейл"
                                            type="text"
                                            fullWidth
                                            rows={4}
                                            defaultValue={dialogType === 'create' ? email : editingUser.email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Select
                                            margin="dense"
                                            labelId="role-label"
                                            id="role"
                                            rows={4}
                                            fullWidth
                                            value={dialogType === 'create' ? role : editingUser.role}
                                            label="Роля"
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <MenuItem value={"STUDENT"}>STUDENT</MenuItem>
                                            <MenuItem value={"PROFESSOR"}>PROFESSOR</MenuItem>
                                            <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
                                        </Select>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Отказ
                                </Button>
                                <Button onClick={() => {
                                    const data = gatherData();
                                    if (dialogType === 'create') {
                                        handleSubmit(data);
                                    } else if (dialogType === 'update') {
                                        handleUpdate(data);
                                    }
                                }} variant="contained" color="primary">
                                    {dialogType === 'create' ? 'Създай' : 'Актуализация'}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default Users;