// api.js
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
    throw new Error('Login failed');
  }
}

export async function logout() {
  const response = await fetch(`${authUrl}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (response.ok) {
    localStorage.removeItem("token");
  } else {
    throw new Error('Logout failed');
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
    throw new Error('Registration failed');
  }
}

export function getCurrentUser(){
  return localStorage.getItem('token');
}

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  // validate token
  return token !== null;
};