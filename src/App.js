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
import NotFoundPage from './components/NotFound';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<ProtectedRoute/>}>
            <Route  path='/dashboard' element={<Dashboard/>}/>
          </Route>
          <Route path='/' element={<ProtectedRoute/>}>
            <Route  path='/assignments' element={<Assignments/>}/>
          </Route>
          <Route path='/' element={<ProtectedRoute/>}>
            <Route  path='/assignments/:id' element={<AssignmentDetails/>}/>
          </Route>
          <Route path='/' element={<ProtectedRoute/>}>
            <Route  path='/submissions' element={<Submissions/>}/>
          </Route>
          <Route path='/' element={<ProtectedRoute/>}>
            <Route  path='/submissions/:id' element={<SubmissionDetails/>}/>
          </Route>
          <Route path='/' element={<ProtectedRoute/>}>
            <Route  path='/profile' element={<Profile/>}/>
          </Route>
          {/* fix admin router below */}
          <Route path='/' element={<ProtectedRoute/>}> 
            <Route  path='/users' element={<Users/>}/>
          </Route>
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
