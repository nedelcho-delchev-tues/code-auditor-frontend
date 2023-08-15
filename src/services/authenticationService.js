import { isExpired} from "react-jwt";

const authUrl = 'http://localhost:8080/api/v1/auth';

export async function login(email, password) {
  const response = await fetch(`${authUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();
    return data.access_token;
  } else {
    throw new Error("Проблем при опита за вход в системата ");
  }
}

export async function logout() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${authUrl}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    localStorage.removeItem("token");
    promptToRelogin();
  } else {
    throw new Error('Проблем при опита за излизане от системата.');
  }
}

export async function register(data) {
  const response = await fetch(`${authUrl}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const responseData = await response.json();
    return responseData.access_token;
  } else {
    throw new Error('Проблем при регистрацията');
  }
}

export function getCurrentUser() {
  return localStorage.getItem('token');
}

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      if (!isExpired(token)) {
        return true;
      }
    } catch (error) {
      promptToRelogin();
      return false;
    }
  }

  return false; // Token is not valid or expired
};

export const promptToRelogin = () => {
  window.location.href = '/login';
};