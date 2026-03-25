const API = import.meta.env.VITE_API_BASE ?? '';

export async function placeOrder(token, items, requiresPrescriptionApproval = false) {
  const res = await fetch(`${API}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({
      items: items.map((i) => ({ medicineId: i.medicineId, quantity: i.quantity })),
      requiresPrescriptionApproval: requiresPrescriptionApproval || false,
    }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || data.message || `Order failed: ${res.status}`);
  }
  return res.json();
}
