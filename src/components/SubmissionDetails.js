import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { getCurrentUser } from '../services/authenticationService';
import DashboardDrawer from './DashboardDrawer';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { Paper, Divider, TextField, Button, Card, CardContent, IconButton } from '@mui/material';
import { grey } from '@mui/material/colors';
import { userInfo, assembleUserName } from '../services/userService';

const defaultTheme = createTheme();

const decodeBase64ToHTML = (base64String) => {
    const decodedHTML = atob(base64String);
    return decodedHTML;
};

function SubmissionDetails() {
    const token = getCurrentUser();
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [assignment, setAssignment] = useState({});
    const [submission, setSubmission] = useState({});
    const [feedbacks, setFeedbacks] = useState([]);
    const [newFeedback, setNewFeedback] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [feedbacksPerPage, setFeedbacksPerPage] = useState(5);

    const sortedFeedbacks = [...feedbacks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const indexOfLastFeedback = currentPage * feedbacksPerPage;
    const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
    const currentFeedbacks = sortedFeedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/submission/${parseInt(id)}`,
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
                return response.json()
            })
            .then(data => {
                setSubmission(data);
            })
            .catch(error => {
                console.error('Error fetching assignments:', error);
            });
    }, []);

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

    // useEffect(() => {
    //     if (!submission.assignmentId) return;

    //     fetch(`http://localhost:8080/api/v1/assignment/${submission.assignmentId}`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`
    //         }
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             setAssignment(data);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching assignment:', error);
    //         });
    // }, [submission.assignmentId]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/submission/${parseInt(id)}/feedbacks`,
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
                setFeedbacks(data);
            })
            .catch(error => {
                console.error('Error fetching assignments:', error);
            });
    }, []);

    const handleFeedbackChange = (e) => {
        setNewFeedback(e.target.value);
    };

    const handleFeedbackSubmit = () => {
        const feedback =
        {
            "studentSubmissionId": parseInt(id),
            "comment": newFeedback,
            "commenter": assembleUserName(user)
        }

        fetch('http://localhost:8080/api/v1/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`

            },
            body: JSON.stringify(feedback)
        }).then(response => {
            if (response.status === 401) {
                navigate("/login")
            }
            return response.json();
        }).catch(error => {
            console.error('Error fetching feedbacks:', error);
        });;


        setFeedbacks(currentFeedbacks => [feedback, ...currentFeedbacks]);
        setNewFeedback('');
    };

    const handleRemoveFeedback = async (feedbackId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/feedback/${feedbackId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
            }

            const responseData = await response.json();
        } catch (error) {
            console.error("Problem with deleting feedback");
        }
    }

    const canOperateFeedback = (user) => {
        if (user.role === 'ADMIN' || user.role === 'PROFESSOR') return true;

        return false;
    };

    const shouldDisplayDeleteButton = (user, feedbacks) => {
        for (let i = 0; i < feedbacks.length; i++) {
            if (canOperateFeedback(user)) {
                return true;
            }
        }
        return false;
    };

    const formattedDate = (date) => {
        if (date === undefined) {
            return getCurrentTime();
        } else {
            const createdAt = new Date(date);
            return `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`;
        }
    }

    const getCurrentTime = () => {
        const now = new Date();

        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

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
                    <div style={{ padding: '16px' }}>
                        <Typography variant="h5" gutterBottom style={{ marginBottom: '24px' }}>
                            Детайли за предадената задача:
                        </Typography>

                        <Card variant="outlined" style={{ marginBottom: '16px' }}>
                            <CardContent>
                                <Typography variant="h6">
                                    Заглавие: {submission.assignment ? submission.assignment.title : ' '}
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
                            style={{ backgroundColor: 'white', border: '1px solid #ccc', padding: '16px', borderRadius: '8px', pointerEvents: 'none' }}
                            dangerouslySetInnerHTML={{
                                __html: submission.problems
                                    ? decodeBase64ToHTML(submission.problems)
                                    : '',
                            }}
                        />
                        <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
                            <Typography variant="h5" gutterBottom>
                                Обратна връзка
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            {currentFeedbacks.map((feedback, index) => (
                                <Box key={index} sx={{ marginBottom: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography fontSize={25} variant="commenter" color="textPrimary">
                                                {feedback.commenter}
                                            </Typography>
                                            <Typography variant="caption" color={grey[600]} sx={{ marginLeft: 1 }}>
                                                {formattedDate(feedback.createdAt)}
                                            </Typography>
                                        </Box>

                                        {shouldDisplayDeleteButton(user, feedbacks) && (
                                            <IconButton
                                                aria-label="delete"
                                                onClick={() => handleRemoveFeedback(feedback.id)}
                                                size="small">
                                                <DeleteIcon fontSize="inherit" />
                                            </IconButton>
                                        )}
                                    </Box>

                                    <Typography variant="body1" sx={{ marginTop: 1 }}>
                                        {feedback.comment}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                </Box>
                            ))}

                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Напишете обратна връзка"
                                value={newFeedback}
                                onChange={handleFeedbackChange}
                                sx={{ marginBottom: 2 }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleFeedbackSubmit}
                                disabled={!newFeedback.trim()}
                            >
                                Изпращане
                            </Button>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                                <Button
                                    ariant="contained"
                                    color="primary"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Предишна
                                </Button>

                                <Typography variant="body1" sx={{ flexGrow: 1, textAlign: 'center' }}>
                                    Страница {feedbacks.length > 0 ? currentPage : 0} от {Math.ceil(feedbacks.length / feedbacksPerPage)}
                                </Typography>

                                <Button
                                    ariant="contained"
                                    color="primary"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(feedbacks.length / feedbacksPerPage)}
                                >
                                    Следваща
                                </Button>
                            </Box>
                        </Paper>
                    </div>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default SubmissionDetails;