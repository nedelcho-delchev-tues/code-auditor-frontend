import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import {ProtectedRoute} from './security/ProtectedRouter';
import Assignments from './components/Assignments';
import AssignmentDetails from './components/AssignmentDetails';
import Submissions from './components/Submissions';
import SubmissionDetails from './components/SubmissionDetails';
import Profile from './components/Profile';


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
            <Route  path='/user' element={<Profile/>}/>
          </Route>
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </Router>
  );
}

export default App;
