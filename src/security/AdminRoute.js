import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authenticationService'
import { userInfo } from '../services/userService';
import { isAdmin, isProfessor } from '../services/userService';

export const AdminRoute = () => {
    const [user, setUser] = useState({});
    useEffect(() => {
        async function fetchUserData() {
            try {
                const data = await userInfo();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchUserData();
    }, []);

    const permission = isAuthenticated() && (isAdmin(user) || isProfessor(user));

    return permission ? <Outlet /> : <Navigate to="/dashboard" />;
};