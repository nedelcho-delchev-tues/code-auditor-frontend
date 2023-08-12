import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authenticationService'

export const ProtectedRoute = () => {
    const auth = isAuthenticated();

    return auth ? <Outlet /> : <Navigate to="/login" />;
};