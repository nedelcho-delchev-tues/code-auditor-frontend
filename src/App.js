import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import {ProtectedRoute} from './security/ProtectedRoute';
import Assignments from './components/Assignments';
import AssignmentDetails from './components/AssignmentDetails';
import Submissions from './components/Submissions';
import SubmissionDetails from './components/SubmissionDetails';
import Users from './components/Users';
import Profile from './components/Profile';
import { AdminRoute } from './security/AdminRoute';
import NotFound from './components/NotFound';
import UserDetails from './components/UserDetails';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<ProtectedRoute/>}>
            <Route  path='/dashboard' element={<Dashboard/>}/>
            <Route  path='/assignments' element={<Assignments/>}/>
            <Route  path='/assignments/:id' element={<AssignmentDetails/>}/>
            <Route  path='/submissions' element={<Submissions/>}/>
            <Route  path='/submissions/:id' element={<SubmissionDetails/>}/>
            <Route  path='/profile' element={<Profile/>}/>
          </Route>
          <Route path='/' element={<AdminRoute/>}>
            <Route  path='/users/:id' element={<UserDetails/>}/>
            <Route  path='/users' element={<Users/>}/>
          </Route>
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </Router>
  );
}

export default App;
