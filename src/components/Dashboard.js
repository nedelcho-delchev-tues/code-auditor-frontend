import DashboardDrawer from "./DashboardDrawer";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Alert } from "@mui/material";


const defaultTheme = createTheme();

function Dashboard() {
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
                padding: '20px', // Add padding to create space for content
              }}
            >
                <br></br>
                <br></br>
              <Alert severity="info">Hello into Code Auditor</Alert>
              {/* Other content */}
            </Box>
          </Box>
        </ThemeProvider>
      </div>
    );
  }

export default Dashboard