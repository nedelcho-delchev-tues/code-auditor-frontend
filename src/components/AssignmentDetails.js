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
import { timestampToDate } from '../utils/Utils';
import { Card, CardContent } from '@mui/material';


const defaultTheme = createTheme();

const token = getCurrentUser();

function AssignmentDetails() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState({});
  const [alert, setAlert] = useState({
    open: false,
    type: 'info',
    message: ''
  });

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
          <Box
            sx={{
              paddingRight: '45px'
            }}
          >
            <Paper elevation={3} style={{ padding: '30px' }}>
              <Typography variant="h5" align="center">
                {assignment.title}
              </Typography>
              <Divider style={{ margin: '16px 0' }} />
              <Typography variant="h5" align="center">
                {assignment.description}
              </Typography>
              <Divider style={{ margin: '16px 0' }} />
              <Card variant="outlined" style={{ marginTop: '24px', marginBottom: '24px' }}>
                <CardContent>
                  <Typography variant="h8" align="center" gutterBottom>
                    Файлове, които трябва да присъстват в проекта:
                  </Typography>
                  <Divider style={{ margin: '16px 0' }} />

                  <List>
                    {assignment.specialFiles &&
                      assignment.specialFiles.map((string, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={<span style={{ marginLeft: '8px' }}>- {string}</span>}
                          />
                        </ListItem>
                      ))}
                  </List>
                </CardContent>
              </Card>
              <DragDrop />
            </Paper>
            <Box display="flex" justifyContent="space-between">
              <Typography>Създадено на: {timestampToDate(assignment.createdAt)}</Typography>
              <Typography>Редактирано на: {timestampToDate(assignment.modifiedAt)}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const decodeBase64ToHTML = (base64String) => {
  const decodedHTML = atob(base64String);
  return decodedHTML;
};

export default AssignmentDetails;