const API_BASE = 'http://localhost:3000/api'; // Adjust if needed

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  if (data.token) localStorage.setItem('token', data.token);
  return data;
}

export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error('Registration failed');
  return await res.json();
}

export function getToken() {
  return localStorage.getItem('token');
}

export async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return await res.json();
}

export async function getPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return await res.json();
}

export function logout() {
  localStorage.removeItem('token');
}

export async function getUserById(id: number) {
  const res = await fetch(`${API_BASE}/users/${id}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return await res.json();
}

export async function getPostsByAuthor(authorId: number) {
  const res = await fetch(`${API_BASE}/posts?author_id=${authorId}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return await res.json();
} 