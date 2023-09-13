import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
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
import Alert from '@mui/material/Alert';
import { Card, CardContent } from '@mui/material';


const defaultTheme = createTheme();

function AssignmentDetails() {
  const token = getCurrentUser();
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
      .then(response =>
        response.json()
      )
      .then(data => {
        setAssignment(data);
      })
      .catch(error => {
        console.error('Error fetching assignments:', error);
      });
  }, [id]);

  const createdAt = new Date(assignment.createdAt);
  const modifiedAt = new Date(assignment.modifiedAt);

  const formattedCreatedAt = `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`;
  const formattedModifiedAt = `${modifiedAt.toLocaleDateString()} ${modifiedAt.toLocaleTimeString()}`;

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
          <Box
            sx={{
              paddingRight: '45px'
            }}
          >
            {alert.open && (
              <Alert severity={alert.type} onClose={() => setAlert(prev => ({ ...prev, open: false }))}>
                {alert.message}
              </Alert>
            )}

            <Typography variant="h5" align="center" marginBottom={1}>
              Детайли за заданието
            </Typography>

            <Paper elevation={3} sx={{ padding: '30px' }}>
              <Typography variant="h5" align="center">
                {assignment.title}
              </Typography>
              <Divider sx={{ margin: '16px 0' }} />
              <Typography variant="h8" align="left" sx={{
                maxWidth: '100%',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}
              >
                {assignment.description}
              </Typography>
              <Divider sx={{ margin: '16px 0' }} />
              <Card variant="outlined" sx={{ marginTop: '24px', marginBottom: '24px' }}>
                <CardContent>
                  <Typography variant="h8" align="center" gutterBottom>
                    Файлове, които трябва да присъстват в проекта:
                  </Typography>
                  <Divider sx={{ margin: '16px 0' }} />

                  <List>
                    {assignment.specialFiles &&
                      assignment.specialFiles.map((string, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={<span sx={{ marginLeft: '8px' }}>- {string}</span>}
                          />
                        </ListItem>
                      ))}
                  </List>
                </CardContent>
              </Card>
              <Typography variant="h6" align="center" marginBottom={1}>
                Предай решение тук:
              </Typography>
              <DragDrop />
              <Box display="flex" justifyContent="space-between" sx={{ marginTop: '24px' }}>
                <Typography>Създадено на: {formattedCreatedAt} </Typography>
                <Typography>Последно редактирано на: {formattedModifiedAt}</Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AssignmentDetails;