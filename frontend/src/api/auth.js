const API = import.meta.env.VITE_API_BASE ?? '';

export async function login(email, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'omit',
  });
  if (!res.ok) {
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      throw new Error(data.error || data.message || 'Login failed');
    } catch (e) {
      if (e instanceof SyntaxError) throw new Error(text || 'Login failed');
      throw e;
    }
  }
  return res.json();
}

export async function register(name, email, password) {
  const res = await fetch(`${API}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
    credentials: 'omit',
  });
  if (!res.ok) {
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      throw new Error(data.error || data.message || 'Registration failed');
    } catch (e) {
      if (e instanceof SyntaxError) throw new Error(text || 'Registration failed');
      throw e;
    }
  }
  return res.text();
}
