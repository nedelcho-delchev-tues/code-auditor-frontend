import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PeopleIcon from '@mui/icons-material/People';
import { Link } from 'react-router-dom';

export const mainListItems = (user) => (
  <React.Fragment>
    <ListItemButton component={Link} to="/dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Контролно Табло" />
    </ListItemButton>
    <ListItemButton component={Link} to="/assignments">
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Задания" />
    </ListItemButton>
    <ListItemButton component={Link} to="/submissions">
      <ListItemIcon>
        <AssignmentTurnedInIcon />
      </ListItemIcon>
      <ListItemText primary="Предадени" />
    </ListItemButton>
    {user && (user.role === 'ADMIN' || user.role === 'PROFESSOR') && (
      <ListItemButton component={Link} to="/users">
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Потребители" />
      </ListItemButton>
      )}
  </React.Fragment>
);