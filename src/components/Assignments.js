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
import { getCurrentUser } from '../services/authenticationService';
import { timestampToDate } from '../utils/Utils';
import DashboardDrawer from './DashboardDrawer';

const defaultTheme = createTheme();

function Assignments() {

    const navigate = useNavigate();

    const handleRowClick = (id) => {
        navigate(`/assignment/${id}`);
    };

    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        const token = getCurrentUser();
        fetch('http://localhost:8080/api/v1/assignment',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                setAssignments(data);
            })
            .catch(error => {
                console.error('Error fetching assignments:', error);
            });
    }, []);

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
                    }}
                >
                    <TableContainer component={Paper}
                        sx={{
                            marginTop: '64px', // Adjust this value according to your header's height
                        }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Заглавие</TableCell>
                                    <TableCell>Създадено от</TableCell>
                                    <TableCell>Създадено на</TableCell>
                                    {/* Add more header cells here */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {assignments.map(assignment => (
                                    <TableRow
                                        key={assignment.id}
                                        onClick={() => handleRowClick(assignment.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>{assignment.title}</TableCell>
                                        <TableCell>{assignment.user.firstName} {assignment.user.lastName}</TableCell>
                                        <TableCell>{timestampToDate(assignment.createAt)}</TableCell>
                                        {/* Add more cells for other properties */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Assignments;