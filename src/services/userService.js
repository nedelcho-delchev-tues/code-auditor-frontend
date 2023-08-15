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