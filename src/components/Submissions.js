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
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';
import DashboardDrawer from './DashboardDrawer';
import { getCurrentUser } from '../services/authenticationService';
import { userInfo } from '../services/userService';
import Alert from '@mui/material/Alert';
import { assembleUserName } from '../services/userService';


const defaultTheme = createTheme();

const Submissions = () => {
    const navigate = useNavigate();
    const token = getCurrentUser();
    const [user, setUser] = useState([])
    const [submissions, setSubmissions] = useState([]);
    const [alert, setAlert] = useState({
        open: false,
        type: 'info',
        message: ''
    });

    const canOperateSubmissions = (user, submissionUser) => {
        if (user.role === 'ADMIN' || user.role === 'PROFESSOR') return true;

        if (user.id === submissionUser) return true;

        return false;
    };

    const shouldDisplayDeleteColumn = (user, submissions) => {
        for (let i = 0; i < submissions.length; i++) {
            if (canOperateSubmissions(user, submissions[i].user.id)) {
                return true;
            }
        }
        return false;
    };


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
        fetchSubmissions();
    }, // eslint-disable-next-line 
        []);

    const fetchSubmissions = () => {
        fetch('http://localhost:8080/api/v1/submission',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (response.status === 401) {
                    navigate("/login");
                }
                return response.json()
            })
            .then(data => {
                setSubmissions(data);
            })
            .catch(error => {
                console.error('Error fetching submissions:', error);
            });
    }

    const handleRowClick = (id) => {
        navigate(`/submissions/${id}`);
    };

    async function handleDeleteClick(submissionId) {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/submission/${parseInt(submissionId)}`, {
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

            if (response.status === 401) {
                navigate("/login");
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

    const base64ToUint8Array = (base64) => {
        const raw = atob(base64);
        const uint8Array = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) {
            uint8Array[i] = raw.charCodeAt(i);
        }
        return uint8Array;
    };

    const handleDownload = (base64Content, fileName = "download.zip") => {
        const byteContent = base64ToUint8Array(base64Content);
        const blob = new Blob([byteContent], { type: 'application/zip' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
                        pt: 10, // Adjust this padding to account for the header's height
                        px: 3
                    }}
                >
                    {alert.open && (
                        <Alert severity={alert.type} onClose={() => setAlert(prev => ({ ...prev, open: false }))}>
                            {alert.message}
                        </Alert>
                    )}
                    <Typography variant="h5" align="center" marginBottom={1}>
                        Предадени решения
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Потребител</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Задание</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Присъстват ли всички файлове ?</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Компилира ли се ?</TableCell>
                                    {shouldDisplayDeleteColumn(user, submissions) && (
                                        <TableCell sx={{ fontWeight: 'bold' }}
                                        >
                                        </TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {submissions.map(submission => (
                                    <TableRow
                                        key={submission.id}
                                        onClick={() => handleRowClick(submission.id)}
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s, transform 0.3s',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            }
                                        }}
                                    >
                                        <TableCell>{assembleUserName(submission.user)}</TableCell>
                                        <TableCell>{submission.assignment.title}</TableCell>
                                        <TableCell>
                                            {submission.filesPresent ? <CheckIcon style={{ color: "#34b233" }} /> : <CloseIcon style={{ color: "#cf1020" }} />}
                                        </TableCell>
                                        <TableCell>{submission.buildPassing ?
                                            <CheckIcon style={{ color: "#34b233" }} /> : <CloseIcon style={{ color: "#cf1020" }} />}
                                        </TableCell>
                                        {canOperateSubmissions(user, submission.user.id) && (
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDownload(submission.content, submission.fileName);  // Adjust file name if needed
                                                    }}
                                                >
                                                    Свали проект
                                                </Button>
                                            </TableCell>
                                        )}
                                        {canOperateSubmissions(user, submission.user.id) && (
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick(submission.id);
                                                    }}
                                                >
                                                    Изтрий
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </ThemeProvider>
    )

}

export default Submissions;