import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authenticationService'

const ProtectedRoute = ({ element, ...props }) => {
  if (isAuthenticated()) {
    return <Route {...props} element={element} />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;