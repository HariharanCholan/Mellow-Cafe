const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

export default API_BASE_URL;

/**
 * Authenticated fetch — automatically attaches the JWT token from localStorage.
 * Use this for all /api/admin/* requests.
 */
export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('mellowCafeToken');
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

