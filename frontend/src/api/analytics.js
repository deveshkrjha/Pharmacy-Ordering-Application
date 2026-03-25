const API = import.meta.env.VITE_API_BASE ?? '';

function url(path) {
  return `${API}/api${path}`;
}

export async function getAnalytics(token) {
  const res = await fetch(url('/management/analytics'), {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || data.error || `Analytics failed: ${res.status}`);
  }
  return res.json();
}
