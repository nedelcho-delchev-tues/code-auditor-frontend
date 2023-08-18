import { getCurrentUser } from "./authenticationService";

const baseUrl = 'http://localhost:8080/api/v1';

export async function userInfo() {
    const token = getCurrentUser();
    const response = await fetch(`${baseUrl}/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })

    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error('Проблем при взимане на потребител.');
    }
}

export const assembleUserName = (user) => {
    if (user.title !== null) {
        return user.title + " " + user.firstName + " " + user.lastName;
    }
    return user.firstName + " " + user.lastName;
}

export function isAdmin(user) {
    return user && user.role === 'ADMIN';
}

export function isProfessor(user) {
    return user && user.role === 'PROFESSOR';
}