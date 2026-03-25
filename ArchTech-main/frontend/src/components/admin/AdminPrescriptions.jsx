function AdminPrescriptions({ prescriptions, loading, error, onApprove, onReject }) {
  return (
    <section className="admin-section">
      <h2 className="admin-section-title">Prescriptions</h2>
      <p className="admin-section-desc">Review uploaded prescriptions and approve or reject.</p>
      <p className="admin-section-hint">
        If a PDF won’t open: in Cloudinary go to <strong>Settings → Security</strong> and enable{' '}
        <strong>Allow delivery of PDF and ZIP files</strong>.
      </p>
      {loading && <p className="admin-loading">Loading prescriptions…</p>}
      {error && <p className="admin-error">{error}</p>}
      {!loading && !error && (
        <div className="admin-table-wrap">
          {prescriptions.length === 0 ? (
            <p className="admin-empty">No prescriptions uploaded yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Medicine ID</th>
                  <th>Status</th>
                  <th>Prescription file</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.userId}</td>
                    <td>{p.medicineId}</td>
                    <td>
                      <span className={`admin-status admin-status-${(p.status || '').toLowerCase()}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      {p.fileUrl ? (
                        <span className="admin-file-links">
                          <a href={p.fileUrl} target="_blank" rel="noopener noreferrer" className="admin-link">
                            Open in new tab
                          </a>
                          <span className="admin-file-links-sep">·</span>
                          <a
                            href={p.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-link"
                            download
                          >
                            Download
                          </a>
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      {p.status === 'PENDING' && (
                        <>
                          <button
                            type="button"
                            className="admin-btn admin-btn-approve"
                            onClick={() => onApprove(p.id)}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn-reject"
                            onClick={() => onReject(p.id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
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

export default AdminPrescriptions;
