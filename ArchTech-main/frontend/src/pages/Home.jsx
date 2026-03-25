import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMedicines,
  setSearchQuery,
  selectFilteredMedicines,
  selectMedicinesLoading,
  selectMedicinesError,
  selectSearchQuery,
} from '../store/slices/medicinesSlice';
import {
  setEmergencyPriority,
  selectEmergencyPriority,
} from '../store/slices/uiSlice';
import { addToCart } from '../store/slices/cartSlice';
import './Home.css';

const FEATURED_CATEGORIES = [
  { title: 'Chronic Care', description: 'Diabetes, cardiac, renal' },
  { title: 'Acute & Fever', description: 'Cold, flu, infection' },
  { title: 'Emergency', description: 'Rescue inhalers, Epi' },
  { title: 'Wellness & OTC', description: 'Vitamins, skin, baby' },
];

function Home() {
  const dispatch = useDispatch();
  const filtered = useSelector(selectFilteredMedicines);
  const loading = useSelector(selectMedicinesLoading);
  const error = useSelector(selectMedicinesError);
  const searchQuery = useSelector(selectSearchQuery);
  const emergencyPriority = useSelector(selectEmergencyPriority);

  useEffect(() => {
    dispatch(fetchMedicines());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="home">
        <div className="home-loading">Loading medicines…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <div className="home-error">
          <p>{error}</p>
          <p className="home-error-hint">Ensure medicine-service is running on port 8082.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="home-hero-layout">
        <section className="home-hero">
          <h1 className="home-hero-title">
            Medical-Grade Pharmacy, Delivered Safely.
          </h1>
          <p className="home-hero-subtitle">
            End-to-end verified prescriptions, pharmacist-reviewed orders, and real-time risk checks for every medicine.
          </p>
          <div className="home-search-row">
            <input
              type="search"
              placeholder="Smart Search: medicine, condition, or molecule..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="home-search-input"
              aria-label="Search medicines"
            />
            <button type="button" className="home-search-btn">Search</button>
          </div>
          <div className="home-toggle-row">
            <label className="home-toggle">
              <input
                type="checkbox"
                checked={emergencyPriority}
                onChange={(e) => dispatch(setEmergencyPriority(e.target.checked))}
                className="home-toggle-input"
              />
              <span className="home-toggle-slider" />
              <span className="home-toggle-label">Emergency Priority</span>
            </label>
            <p className="home-toggle-desc">
              When enabled, life-saving medicines and critical care orders are prioritized.
            </p>
          </div>
        </section>

        <aside className="home-categories">
          <h2 className="home-categories-title">Featured Categories</h2>
          <div className="home-categories-grid">
            {FEATURED_CATEGORIES.map((cat) => (
              <div key={cat.title} className="category-card">
                <h3 className="category-card-title">{cat.title}</h3>
                <p className="category-card-desc">{cat.description}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <section className="home-medicines">
        <h2 className="home-medicines-title">Medicines</h2>
        <div className="home-grid" aria-label="Medicine list">
          {filtered.length === 0 ? (
            <p className="home-empty">No medicines match your search.</p>
          ) : (
            filtered.map((m) => (
              <article key={m.id} className="medicine-card">
                <div className="medicine-card-header">
                  <span className="medicine-category">{m.category || 'General'}</span>
                  {m.stock !== undefined && (
                    <span className={`medicine-stock ${m.stock < 20 ? 'low' : ''}`}>
                      {m.stock} in stock
                    </span>
                  )}
                </div>
                <h3 className="medicine-name">{m.name}</h3>
                {(m.description || m.dosage || m.packaging) && (
                  <p className="medicine-desc">
                    {m.description || [m.dosage, m.packaging].filter(Boolean).join(' · ')}
                  </p>
                )}
                <div className="medicine-footer">
                  <span className="medicine-price">
                    ${typeof m.price === 'number' ? m.price.toFixed(2) : m.price}
                  </span>
                  <button
                    type="button"
                    className="medicine-add-btn"
                    onClick={() => dispatch(addToCart({
                      medicineId: m.id,
                      name: m.name,
                      price: typeof m.price === 'number' ? m.price : Number(m.price),
                      quantity: 1,
                      requiresPrescription: Boolean(m.requiresPrescription),
                    }))}
                  >
                    Add to cart
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
