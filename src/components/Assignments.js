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
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import { Typography } from '@mui/material';
import { getCurrentUser } from '../services/authenticationService';
import { userInfo } from '../services/userService';
import { timestampToDate } from '../utils/Utils';
import DashboardDrawer from './DashboardDrawer';

const defaultTheme = createTheme();

const canOperateAssignments = (user) => {
    if (user.role !== 'ADMIN' && user.role !== 'PROFESSOR') return false;

    // const permissionList = user.authorities && Array.isArray(user.authorities)
    //     ? user.authorities.map(authority => authority.authority)
    //     : [];

    //if (!permissionList.includes('admin:create') && !permissionList.includes('professor:create')) return false;

    return true;
};

function Assignments() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fileFields, setFileFields] = useState([{ value: '' }]);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState([])
    const [alert, setAlert] = useState({
        open: false,
        type: 'info',
        message: ''
    });
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [dialogType, setDialogType] = useState('create');

    const token = getCurrentUser();

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

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = () => {
        fetch('http://localhost:8080/api/v1/assignment',
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
                setAssignments(data);
            })
            .catch(error => {
                console.error('Error fetching assignments:', error);
            });
    }

    const handleOpen = () => {
        setDialogType('create');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const addFileField = () => {
        setFileFields([...fileFields, {}]);
    };

    const removeFileField = (index) => {
        const newFiles = [...fileFields];
        newFiles.splice(index, 1);
        if (newFiles.length === 0) {
            newFiles.push({});
        }
        setFileFields(newFiles);
    };

    const handleFileChange = (event, index) => {
        const newFiles = [...fileFields];
        newFiles[index].value = event.target.value;
        setFileFields(newFiles);
    };

    const navigate = useNavigate();

    const handleRowClick = (id) => {
        navigate(`/assignments/${id}`);
    };

    const [assignments, setAssignments] = useState([]);

    const gatherData = () => {
        const data = {
            title,
            description,
            specialFiles: fileFields.map(file => file.value)
        };

        return data;
    };

    const handleSubmit = async (data) => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/assignment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
                body: JSON.stringify(data)
            });
            const responseData = await response.json();
            setAlert({
                open: true,
                type: 'info',
                message: responseData.message
            });
        } catch (error) {
            setAlert({
                open: true,
                type: 'error',
                message: error.message
            });
        }
        handleClose();
        setTitle("");
        setDescription("");
        setFileFields([{ value: '' }]);
    }

    const handleUpdate = async (data) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/assignment/${parseInt(editingAssignment.id)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
                body: JSON.stringify(data)
            });
            const responseData = await response.json();

            setAlert({
                open: true,
                type: 'info',
                message: responseData.message
            });

            if (!response.ok) {
                setAlert({
                    open: true,
                    type: 'error',
                    message: response.message
                });
            }
        } catch (error) {
            setAlert({
                open: true,
                type: 'error',
                message: error
            });
        }
        handleClose();
        // setTitle("");
        // setDescription("");
        // setFileFields([{ value: '' }]);
    }

    async function handleEditClick(assignmentId) {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/assignment/${assignmentId}`, {
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
            const updatedFileFields = responseData.specialFiles.map(file => ({ value: file }));

            setTitle(responseData.title);
            setDescription(responseData.description);
            setFileFields(updatedFileFields.length ? updatedFileFields : [{ value: '' }]);
            setEditingAssignment(responseData);
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

    async function handleDeleteClick(assignmentId) {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/assignment/${assignmentId}`, {
                method: 'DELETE',
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

            setAlert({
                open: true,
                type: 'info',
                message: responseData.message
            });

        } catch (error) {
            setAlert({
                open: true,
                type: 'info',
                message: error
            });
        }
    }

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
                        Задания
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Заглавие</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Създадено от</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Създадено на</TableCell>
                                    {canOperateAssignments(user) && (
                                        <TableCell sx={{ fontWeight: 'bold' }}
                                        >
                                        </TableCell>
                                    )}
                                    {canOperateAssignments(user) && (
                                        <TableCell sx={{ fontWeight: 'bold' }}
                                        >
                                        </TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {[...assignments].reverse().map(assignment => (
                                    <TableRow
                                        key={assignment.id}
                                        onClick={() => handleRowClick(assignment.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>{assignment.title}</TableCell>
                                        <TableCell>{assignment.user.firstName} {assignment.user.lastName}</TableCell>
                                        <TableCell>{timestampToDate(assignment.createAt)}</TableCell>
                                        {canOperateAssignments(user) && (
                                            <TableCell>
                                                <Button variant="contained" onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(assignment.id)
                                                }}>
                                                    Промяна
                                                </Button>
                                            </TableCell>
                                        )}
                                        {canOperateAssignments(user) && (
                                            <TableCell>
                                                <Button variant="contained" color="error" onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(assignment.id);
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
                        {canOperateAssignments(user) && (<Button
                            variant="contained"
                            color="primary"
                            sx={{
                                boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)'
                            }}
                            onClick={handleOpen}
                        >
                            Ново задание
                        </Button>
                        )}

                        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                            {dialogType === 'create' ? (
                                <DialogTitle>Създаване на задание</DialogTitle>
                            ) : (
                                <DialogTitle>Промяна на задание</DialogTitle>
                            )}
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="title"
                                    label="Заглавие на заданието"
                                    type="text"
                                    fullWidth
                                    defaultValue={dialogType === 'create' ? title : editingAssignment.title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <TextField
                                    margin="dense"
                                    id="description"
                                    label="Подробно описание"
                                    type="text"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    defaultValue={dialogType === 'create' ? description : editingAssignment.description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                {fileFields.map((file, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                        <TextField
                                            margin="dense"
                                            id={`file-${index}`}
                                            label="Специален файл"
                                            type="text"
                                            value={dialogType === 'create' ? file.value || '' : editingAssignment.specialFiles[index]}
                                            onChange={(e) => handleFileChange(e, index)}
                                        />
                                        <IconButton onClick={() => removeFileField(index)} style={{ marginLeft: '5px' }}>
                                            <RemoveIcon />
                                        </IconButton>
                                        {index === fileFields.length - 1 && (
                                            <IconButton onClick={addFileField} style={{ marginLeft: '5px' }}>
                                                <AddIcon />
                                            </IconButton>
                                        )}
                                    </div>
                                ))}
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
                                    {dialogType === 'create' ? 'Създай' : 'Промяна'}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Assignments;