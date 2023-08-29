import { useEffect, useState } from "react";
import DashboardDrawer from "./DashboardDrawer";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Typography, Grid, Paper } from "@mui/material";
import { assembleUserName } from "../services/userService";
import { userInfo } from "../services/userService";
import { useNavigate } from "react-router-dom";


const defaultTheme = createTheme();

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState([])
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [assignmentCount, setAssignmentCount] = useState(0);

  useEffect(() => {
    if (localStorage.getItem('firstLogin') === null) {
      setIsFirstLogin(true);
      localStorage.setItem('firstLogin', 'false');
    }
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

  useEffect(() => {
    fetchSubmissionCount();
    fetchAssignmentCount();
  }, []);

  const fetchSubmissionCount = () => {
    fetch('http://localhost:8080/api/v1/user/count_submissions',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        setSubmissionCount(data);
      })
      .catch(error => {
        console.error('Error fetching submissionCount:', error);
      });
  }

  const fetchAssignmentCount = () => {
    fetch('http://localhost:8080/api/v1/assignment/count_assignments',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        setAssignmentCount(data);
      })
      .catch(error => {
        console.error('Error fetching submissionCount:', error);
      });
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
            padding: '20px',
            pt: 10,
            px: 3
          }}
        >

          {isFirstLogin && (
            <Typography variant="h4" gutterBottom sx={{ marginBottom: '20px' }}>
              Добре дошли, {assembleUserName(user)}!
            </Typography>
          )}

          <Grid container spacing={3} sx={{ marginTop: '20px' }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{
                padding: '20px',
                borderRadius: '15px',
                cursor: 'pointer',
                transition: 'background-color 0.3s, transform 0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  transform: 'scale(1.02)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => { navigate('/submissions') }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">Предадени задачи</Typography>
                    <Typography variant="h2" sx={{ color: '#4caf50' }}>{submissionCount}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{
                padding: '20px',
                borderRadius: '15px',
                cursor: 'pointer',
                transition: 'background-color 0.3s, transform 0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  transform: 'scale(1.02)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => { navigate('/assignments') }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">Текущи задания</Typography>
                    <Typography variant="h2" sx={{ color: '#4caf50' }}>{assignmentCount}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <br />

          {/* Upcoming Deadlines Section */}
          {/* <Paper elevation={3} sx={{ padding: '20px', borderRadius: '15px', marginTop: '20px' }}>
            <Typography variant="h5" gutterBottom>
              Upcoming Deadlines
            </Typography>
          </Paper> */}

        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard