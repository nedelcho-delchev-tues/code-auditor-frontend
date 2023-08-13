import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { getCurrentUser } from '../services/authenticationService';
import DashboardDrawer from './DashboardDrawer';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DragDrop from './DragDrop';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { timestampToDate } from '../utils/Utils';
import { isSubmissionPresent } from '../services/studentSubmissionService';


const defaultTheme = createTheme();

const token = getCurrentUser();

function AssignmentDetails() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState({});
  const [submission, setSubmission] = useState({});

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/assignment/${id}`,
      {
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
        console.error('Error fetching assignments:', error);
      });
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/assignment/${id}/get_submission`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        setSubmission(data);
      })
      .catch(error => {
        console.error('Error fetching submission:', error);
      });
  }, [id])

  const submissionPresent = isSubmissionPresent(submission);
  return (
    <div>
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
            }}
          >
            <Box
              sx={{
                paddingRight: '45px'
              }}
            >
              <Paper elevation={3} style={{ padding: '120px' }}>
                <Typography variant="h5" align="center">
                  {assignment.title}
                </Typography>
                <Divider style={{ margin: '16px 0' }} />
                <Typography variant="h5" align="center">
                  {assignment.description}
                </Typography>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Създадено на: {timestampToDate(assignment.createdAt)}</Typography>
                  <Typography>Редактирано на: {timestampToDate(assignment.modifiedAt)}</Typography>
                </Box>
                <Divider style={{ margin: '16px 0' }} />
                <Typography variant="h7" align="center">
                  Файлове, които трябва да присъстват в проекта:
                </Typography>
                <List>
                  {assignment.specialFiles &&
                    assignment.specialFiles.map((string, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={string} />
                      </ListItem>
                    ))}
                </List>
                <DragDrop />
                {submissionPresent && (
                  <React.Fragment>
                    <Typography variant="h5" gutterBottom>
                      Детайли за предадената задача:
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Присъстват ли всички файлове ? : {submission.filesPresent ? <CheckIcon style={{
                        color: "#34b233",
                      }} /> : <CloseIcon style={{
                        color: "#cf1020",
                      }} />}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Компилира ли се проекта ? : {submission.buildPassing ? <CheckIcon style={{
                        color: "#34b233",
                      }} /> : <CloseIcon style={{
                        color: "#cf1020",
                      }} />}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Тук може да видите дали кодът има някакви проблеми:
                    </Typography>
                    <Box dangerouslySetInnerHTML={{
                      __html: submission.problems
                        ? decodeBase64ToHTML(submission.problems)
                        : '',
                    }} />
                  </React.Fragment>
                )}
              </Paper>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </div>
  );
};

const decodeBase64ToHTML = (base64String) => {
  const decodedHTML = atob(base64String);
  return decodedHTML;
};

export default AssignmentDetails;