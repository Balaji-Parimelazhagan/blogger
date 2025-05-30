const API_BASE = 'http://localhost:3000'; // Adjust if needed

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
  const res = await fetch(`${API_BASE}/users`, {
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

export async function updateUser(id: number, data: { name?: string; avatarUrl?: string; bio?: string }) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return await res.json();
}

export async function getPostById(id: number) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error('Failed to fetch post');
  return await res.json();
}

export async function getCommentsByPost(postId: number) {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return await res.json();
}

export async function getRelatedPosts(postId: number) {
  const res = await fetch(`${API_BASE}/posts/${postId}/related`);
  if (!res.ok) throw new Error('Failed to fetch related posts');
  return await res.json();
}

export async function createPost(data: { title: string; content: string; excerpt?: string }) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return await res.json();
}

export async function updatePost(id: number, data: { title: string; content: string; excerpt?: string }) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update post');
  return await res.json();
}

export async function deletePost(id: number) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error('Failed to delete post');
  return true;
}

export async function addComment(postId: number, content: string) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return await res.json();
}

export async function addRelatedPost(postId: number, relatedPostId: number) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/posts/${postId}/related`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ related_post_id: relatedPostId }),
  });
  if (!res.ok) throw new Error('Failed to add related post');
  return await res.json();
}

export async function removeRelatedPost(postId: number, relatedPostId: number) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/posts/${postId}/related/${relatedPostId}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error('Failed to remove related post');
  return true;
} 