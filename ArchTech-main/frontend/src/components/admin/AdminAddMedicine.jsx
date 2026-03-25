import { useState } from 'react';
import { addMedicine } from '../../api/medicines';

function AdminAddMedicine({ token, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    dosage: '',
    packaging: '',
    requiresPrescription: false,
  });
  const [addSuccess, setAddSuccess] = useState(null);
  const [addError, setAddError] = useState(null);
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(null);
    setAdding(true);
    try {
      await addMedicine(token, {
        name: form.name,
        category: form.category || null,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        dosage: form.dosage || null,
        packaging: form.packaging || null,
        requiresPrescription: form.requiresPrescription,
      });
      setAddSuccess('Medicine added successfully.');
      setForm({
        name: '',
        category: '',
        price: '',
        stock: '',
        dosage: '',
        packaging: '',
        requiresPrescription: false,
      });
      onSuccess?.();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <section className="admin-section">
      <h2 className="admin-section-title">Add Medicine</h2>
      <p className="admin-section-desc">Add a new medicine to the catalog.</p>
      {addSuccess && <p className="admin-success">{addSuccess}</p>}
      {addError && <p className="admin-error">{addError}</p>}
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-row">
          <label>Name *</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div className="admin-form-row">
          <label>Category</label>
          <input
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            placeholder="e.g. Pain Relief"
          />
        </div>
        <div className="admin-form-row admin-form-row-inline">
          <div>
            <label>Price *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              required
            />
          </div>
          <div>
            <label>Stock *</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
              required
            />
          </div>
        </div>
        <div className="admin-form-row">
          <label>Dosage</label>
          <input
            value={form.dosage}
            onChange={(e) => setForm((f) => ({ ...f, dosage: e.target.value }))}
            placeholder="e.g. 500mg"
          />
        </div>
        <div className="admin-form-row">
          <label>Packaging</label>
          <input
            value={form.packaging}
            onChange={(e) => setForm((f) => ({ ...f, packaging: e.target.value }))}
            placeholder="e.g. Strip of 10"
          />
        </div>
        <div className="admin-form-row">
          <label className="admin-check-label">
            <input
              type="checkbox"
              checked={form.requiresPrescription}
              onChange={(e) => setForm((f) => ({ ...f, requiresPrescription: e.target.checked }))}
            />
            Requires prescription
          </label>
        </div>
        <button type="submit" className="admin-submit" disabled={adding}>
          {adding ? 'Adding…' : 'Add medicine'}
        </button>
      </form>
    </section>
  );
}

export default AdminAddMedicine;
