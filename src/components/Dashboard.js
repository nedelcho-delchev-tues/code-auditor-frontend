import { useEffect, useState } from "react";
import DashboardDrawer from "./DashboardDrawer";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Typography, Grid, Paper } from "@mui/material";
import { assembleUserName } from "../services/userService";
import { userInfo } from "../services/userService";


const defaultTheme = createTheme();

function Dashboard() {
  const [user, setUser] = useState([])
  const [isFirstLogin, setIsFirstLogin] = useState(false);

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
              <Paper elevation={3} sx={{ padding: '20px', borderRadius: '15px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">Completed Assignments</Typography>
                    <Typography variant="h2" sx={{ color: '#4caf50' }}>56</Typography>
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