function AdminAllMedicines({ medicines, loading, error }) {
  return (
    <section className="admin-section">
      <h2 className="admin-section-title">All Medicines</h2>
      <p className="admin-section-desc">Catalog of all medicines in the store.</p>
      {loading && <p className="admin-loading">Loading medicines…</p>}
      {error && <p className="admin-error">{error}</p>}
      {!loading && !error && (
        <div className="admin-table-wrap">
          {medicines.length === 0 ? (
            <p className="admin-empty">No medicines in catalog yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Dosage</th>
                  <th>Packaging</th>
                  <th>Rx</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((m) => (
                  <tr key={m.id}>
                    <td>{m.id}</td>
                    <td>{m.name}</td>
                    <td>{m.category || '—'}</td>
                    <td>${typeof m.price === 'number' ? m.price.toFixed(2) : m.price}</td>
                    <td>{m.stock ?? '—'}</td>
                    <td>{m.dosage || '—'}</td>
                    <td>{m.packaging || '—'}</td>
                    <td>{m.requiresPrescription ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}

export default AdminAllMedicines;
