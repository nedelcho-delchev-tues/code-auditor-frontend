import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authenticationService'
import { userInfo } from '../services/userService';

function isAdmin(user) {
    console.log("isADMIN " + (user && user.role === 'ADMIN'));
    return user && user.role === 'ADMIN';
}

function isProfessor(user) {
    console.log("isProfessor " + (user && user.role === 'PROFESSOR'));
    return user && user.role === 'PROFESSOR';
}

export const AdminRoute = () => {
    const [user, setUser] = useState({});
    useEffect(() => {
        async function fetchUserData() {
            try {
                const data = await userInfo();
                console.log(data)
                setUser(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchUserData();
    }, []);


    console.log("USER" + JSON.stringify(user))
    const permission = isAuthenticated() && (isAdmin(user) || isProfessor(user));
    console.log("PERMISSIONS " + permission)
    return permission ? <Outlet /> : <Navigate to="/dashboard" />;
};