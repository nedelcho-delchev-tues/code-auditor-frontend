import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { getCurrentUser } from '../services/authenticationService';
import DashboardDrawer from './DashboardDrawer';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Card, CardContent } from '@mui/material';


const defaultTheme = createTheme();

const token = getCurrentUser();

function SubmissionDetails() {
    const { id } = useParams();
    const [assignment, setAssignment] = useState({});
    const [submission, setSubmission] = useState({});

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/submission/${parseInt(id)}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                setSubmission(data);
            })
            .catch(error => {
                console.error('Error fetching assignments:', error);
            });
    }, [id]);

    useEffect(() => {
        if (!submission.assignmentId) return;  // guard clause
    
        fetch(`http://localhost:8080/api/v1/assignment/${submission.assignmentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setAssignment(data);
        })
        .catch(error => {
            console.error('Error fetching assignment:', error);
        });
    }, [submission.assignmentId]);

    console.log(assignment)

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
                        pt: 10, // Adjust this padding to account for the header's height
                        px: 3
                    }}
                >
                    <div style={{ padding: '16px' }}>
                        <Typography variant="h5" gutterBottom style={{ marginBottom: '24px' }}>
                            Детайли за предадената задача:
                        </Typography>

                        <Card variant="outlined" style={{ marginBottom: '16px' }}>
                            <CardContent>
                                <Typography variant="h6">
                                    Задача: {assignment.title}
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card variant="outlined" style={{ marginBottom: '16px' }}>
                            <CardContent>
                                <Typography variant="h6">
                                    Присъстват ли всички файлове ?
                                </Typography>
                                {submission.filesPresent
                                    ? <CheckIcon style={{ color: "#34b233", fontSize: '2em' }} />
                                    : <CloseIcon style={{ color: "#cf1020", fontSize: '2em' }} />}
                            </CardContent>
                        </Card>

                        <Card variant="outlined" style={{ marginBottom: '16px' }}>
                            <CardContent>
                                <Typography variant="h6">
                                    Компилира ли се проекта ?
                                </Typography>
                                {submission.buildPassing
                                    ? <CheckIcon style={{ color: "#34b233", fontSize: '2em' }} />
                                    : <CloseIcon style={{ color: "#cf1020", fontSize: '2em' }} />}
                            </CardContent>
                        </Card>

                        <Typography variant="h6" gutterBottom style={{ marginBottom: '16px' }}>
                            Тук може да видите дали кодът има някакви проблеми:
                        </Typography>
                        <Box
                            style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}
                            dangerouslySetInnerHTML={{
                                __html: submission.problems
                                    ? decodeBase64ToHTML(submission.problems)
                                    : '',
                            }}
                        />
                    </div>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

const decodeBase64ToHTML = (base64String) => {
    const decodedHTML = atob(base64String);
    return decodedHTML;
};

export default SubmissionDetails;