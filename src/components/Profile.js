import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import DashboardDrawer from './DashboardDrawer';
import { Typography, Divider, Grid, Paper } from '@mui/material';
import { userInfo } from '../services/userService';

const defaultTheme = createTheme();

function Profile() {
    const [user, setUser] = useState([])

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
                        pt: 10,
                        px: 3
                    }}
                >
                    <Paper elevation={3} sx={{ padding: 4 }}>
                        <Typography variant="h4" gutterBottom sx={{ marginBottom: 4 }}>
                            Профил
                        </Typography>

                        <Divider sx={{ my: 4 }} />

                        <Grid container spacing={5}>
                            <Grid item xs={6}>
                                <Typography variant="h6" sx={{ marginBottom: 3 }}>Първо име</Typography>
                                <Typography gutterBottom sx={{ marginBottom: 5 }}>{user.firstName}</Typography>

                                <Typography variant="h6" sx={{ marginBottom: 3 }}>Мейл</Typography>
                                <Typography gutterBottom sx={{ marginBottom: 5 }}>{user.email}</Typography>

                                <Typography variant="h6" sx={{ marginBottom: 3 }}>Факултетен номер</Typography>
                                <Typography gutterBottom sx={{ marginBottom: 5 }}>{user.facultyNumber}</Typography>

                                <Typography variant="h6" sx={{ marginBottom: 3 }}>Група</Typography>
                                <Typography gutterBottom sx={{ marginBottom: 5 }}>{user.group}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" sx={{ marginBottom: 3 }}>Фамилно име</Typography>
                                <Typography gutterBottom sx={{ marginBottom: 5 }}>{user.lastName}</Typography>

                                <Typography variant="h6" sx={{ marginBottom: 3 }}>Факултет</Typography>
                                <Typography gutterBottom sx={{ marginBottom: 5 }}>{user.faculty}</Typography>

                                <Typography variant="h6" sx={{ marginBottom: 3 }}>Специалност</Typography>
                                <Typography gutterBottom sx={{ marginBottom: 5 }}>{user.specialization}</Typography>

                                <Typography variant="h6" sx={{ marginBottom: 3 }}>Поток</Typography>
                                <Typography gutterBottom sx={{ marginBottom: 5 }}>{user.stream}</Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default Profile;