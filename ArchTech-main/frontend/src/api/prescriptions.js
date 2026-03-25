const API = import.meta.env.VITE_API_BASE ?? '';

function headers(token) {
  const h = { 'Content-Type': 'application/json' };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

function url(path) {
  return `${API}/api${path}`;
}

export async function getPrescriptions(token) {
  const res = await fetch(url('/prescriptions'), {
    headers: headers(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.message || data.error || (res.status === 401 ? 'Not authenticated' : res.status === 403 ? 'Not authorized (admin only)' : `Failed to load prescriptions (${res.status})`);
    throw new Error(msg);
  }
  return data;
}

export async function approvePrescription(token, id) {
  const res = await fetch(url(`/prescriptions/${id}/approve`), {
    method: 'PUT',
    headers: headers(token),
  });
  if (!res.ok) throw new Error('Failed to approve');
  return res.json();
}

export async function rejectPrescription(token, id) {
  const res = await fetch(url(`/prescriptions/${id}/reject`), {
    method: 'PUT',
    headers: headers(token),
  });
  if (!res.ok) throw new Error('Failed to reject');
  return res.json();
}

/** Upload a prescription for a medicine (user must be logged in). Backend sets userId from JWT. fileUrl is the Cloudinary URL of the uploaded PDF/image. */
export async function uploadPrescription(token, medicineId, fileUrl) {
  const res = await fetch(url('/prescriptions'), {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ medicineId, fileUrl }),
  });
  if (!res.ok) throw new Error('Failed to upload prescription');
  return res.json();
}
