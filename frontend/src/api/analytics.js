const API = import.meta.env.VITE_ORDER_API_BASE ?? '';

function url(path) {
  return `${API}${path}`;
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
