import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MuiDrawer from '@mui/material/Drawer';
import { mainListItems } from './ListItems';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { getCurrentUser } from '../services/authenticationService';
import { logout } from '../services/authenticationService';


const defaultTheme = createTheme();

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

const drawerWidth = 240;

function DashboardDrawer() {
    const token = getCurrentUser();
    const [anchorDropDown, setAnchorDropDown] = useState(null);
    const [open, setOpen] = useState(true);
    const [user, setUser] = useState([]);
    const [jwtToken, setJwtToken] = useState({});
    const openDropDown = Boolean(anchorDropDown);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorDropDown(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorDropDown(null);
    };

    const handleProfileClick = () => {
        navigate("/profile")
    }

    const toggleDrawer = () => {
        setOpen(!open);
    };


    useEffect(() => {
        setJwtToken(token);
        fetch(`http://localhost:8080/api/v1/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }).then(response => {
            if (response.status === 401) {
                navigate("/login")
            }
            return response.json();
        })
            .then(data => {
                setUser(data);
            })
            .catch(error => {
                console.error('Error fetching user:', error);
            });
    }, []);

    return (
        <div>
            <ThemeProvider theme={defaultTheme}>
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <AppBar position="absolute" open={open}>
                        <Toolbar
                            sx={{
                                pr: '24px',
                            }}
                        >
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                onClick={toggleDrawer}
                                sx={{
                                    marginRight: '36px',
                                    ...(open && { display: 'none' }),
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                component="h1"
                                variant="h6"
                                color="inherit"
                                noWrap
                                sx={{ flexGrow: 1 }}
                            >
                                Контролно Табло
                            </Typography>
                            <IconButton
                                id="icon-button"
                                aria-controls={openDropDown ? 'icon-button' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openDropDown ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                <Avatar {...stringAvatar(user.firstName + " " + user.lastName)} />
                            </IconButton>
                            <Menu
                                id="icon-button"
                                aria-labelledby="icon-button"
                                anchorEl={anchorDropDown}
                                open={openDropDown}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                <MenuItem
                                    onClick={(e) => {
                                        handleProfileClick();
                                        handleClose();
                                    }}>
                                    Моят профил
                                </MenuItem>
                                <MenuItem onClick={logout}>Изход</MenuItem>
                            </Menu>
                        </Toolbar>
                    </AppBar>
                    <Drawer variant="permanent" open={open}>
                        <Toolbar
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                px: [1],
                            }}
                        >
                            <IconButton onClick={toggleDrawer}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </Toolbar>
                        <Divider />
                        <List component="nav">
                            {mainListItems(user)}
                        </List>
                    </Drawer>
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
                        <Toolbar />
                    </Box>
                </Box>
            </ThemeProvider>
        </div>
    )
}

export default DashboardDrawer;