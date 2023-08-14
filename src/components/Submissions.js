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
import DashboardDrawer from './DashboardDrawer';
import { getCurrentUser } from '../services/authenticationService';
import { userInfo } from '../services/userService';


const defaultTheme = createTheme();

const Submissions = () => {
    const navigate = useNavigate();
    const token = getCurrentUser();
    const [user, setUser] = useState([])
    const [submissions, setSubmissions] = useState([]);
    
    const canOperateSubmissions = (user, submissionUser) => {
        console.log(user, submissionUser);
        if (user.role === 'ADMIN' || user.role === 'PROFESSOR') return true;

        if (user.id === submissionUser) return true;

        return false;
    };

    const shouldDisplayDeleteColumn = (user, submissions) => {
        for (let i = 0; i < submissions.length; i++) {
            if (canOperateSubmissions(user, submissions[i].userId)) {
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
            .then(response => response.json())
            .then(data => {
                setSubmissions(data);
            })
            .catch(error => {
                console.error('Error fetching submissions:', error);
            });
    }
    console.log(submissions)
    console.log(user)
    const handleRowClick = (id) => {
        navigate(`/assignment/${id}`);
    };

    async function handleDeleteClick(submission) {
        // try {
        //     const response = await fetch(`http://localhost:8080/api/v1/assignment/${assignmentId}`, {
        //         method: 'DELETE',
        //         headers: {
        //             'Authorization': `Bearer ${token}`
        //         }
        //     });

        //     if (!response.ok) {
        //         setAlert({
        //             open: true,
        //             type: 'error',
        //             message: response.message
        //         });
        //     }

        //     const responseData = await response.json();

        //     setAlert({
        //         open: true,
        //         type: 'info',
        //         message: responseData.message
        //     });

        // } catch (error) {
        //     setAlert({
        //         open: true,
        //         type: 'info',
        //         message: error
        //     });
        // }
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
                        pt: 10, // Adjust this padding to account for the header's height
                        px: 3
                    }}
                >
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
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>{submission.userId}</TableCell>
                                        <TableCell>{submission.assignmentId}</TableCell>
                                        <TableCell>{submission.filesPresent ? <CheckIcon style={{
                                            color: "#34b233",
                                        }} /> : <CloseIcon style={{
                                            color: "#cf1020",
                                        }} />}</TableCell>
                                        <TableCell>{submission.buildPassing ? <CheckIcon style={{
                                            color: "#34b233",
                                        }} /> : <CloseIcon style={{
                                            color: "#cf1020",
                                        }} />}</TableCell>
                                        {canOperateSubmissions(user, submission.userId) && (
                                            <TableCell>
                                                <Button variant="contained" color="error" onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(submission.id);
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
                </Box>
            </Box>
        </ThemeProvider>
    )

}

export default Submissions;