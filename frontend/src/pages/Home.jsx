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

/* ── Inline SVG Icons ── */
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const HeartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ThermometerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  </svg>
);

const ZapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const LeafIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 1c1 2 2 4.5 2 8 0 5.5-4.78 11-10 11z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const CartPlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="10" y1="11" x2="14" y2="11" />
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const FEATURED_CATEGORIES = [
  { title: 'Chronic Care', description: 'Diabetes, cardiac, renal', icon: HeartIcon, color: '#ef4444' },
  { title: 'Acute & Fever', description: 'Cold, flu, infection', icon: ThermometerIcon, color: '#f59e0b' },
  { title: 'Emergency', description: 'Rescue inhalers, Epi', icon: ZapIcon, color: '#3b82f6' },
  { title: 'Wellness & OTC', description: 'Vitamins, skin, baby', icon: LeafIcon, color: '#10b981' },
];

/* ── Skeleton Loader ── */
function MedicineSkeleton() {
  return (
    <div className="medicine-card medicine-skeleton">
      <div className="skeleton skeleton-header" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-desc" />
      <div className="skeleton skeleton-footer" />
    </div>
  );
}

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
        <div className="home-hero-layout">
          <section className="home-hero">
            <h1 className="home-hero-title">Medical-Grade Pharmacy, Delivered Safely.</h1>
            <p className="home-hero-subtitle">End-to-end verified prescriptions, pharmacist-reviewed orders, and real-time risk checks for every medicine.</p>
          </section>
        </div>
        <section className="home-medicines">
          <h2 className="home-medicines-title">Medicines</h2>
          <div className="home-grid" aria-label="Loading medicines">
            {Array.from({ length: 8 }).map((_, i) => (
              <MedicineSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <div className="home-error-container">
          <div className="home-error-icon">
            <AlertIcon />
          </div>
          <h2 className="home-error-title">Unable to Load Medicines</h2>
          <p className="home-error-msg">{error}</p>
          <p className="home-error-hint">Ensure medicine-service is running on port 8082.</p>
          <button
            type="button"
            className="home-error-retry"
            onClick={() => dispatch(fetchMedicines())}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="home-hero-layout">
        <section className="home-hero">
          <div className="home-hero-badge">🏥 Trusted by 10,000+ patients</div>
          <h1 className="home-hero-title">
            Medical-Grade Pharmacy,<br />
            <span className="home-hero-gradient">Delivered Safely.</span>
          </h1>
          <p className="home-hero-subtitle">
            End-to-end verified prescriptions, pharmacist-reviewed orders, and real-time risk checks for every medicine.
          </p>
          <div className="home-search-row">
            <div className="home-search-wrapper">
              <SearchIcon />
              <input
                type="search"
                placeholder="Search medicine, condition, or molecule..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="home-search-input"
                aria-label="Search medicines"
              />
            </div>
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
              <span className="home-toggle-label">
                <ZapIcon /> Emergency Priority
              </span>
            </label>
            <p className="home-toggle-desc">
              When enabled, life-saving medicines and critical care orders are prioritized.
            </p>
          </div>
        </section>

        <aside className="home-categories">
          <h2 className="home-categories-title">Featured Categories</h2>
          <div className="home-categories-grid">
            {FEATURED_CATEGORIES.map((cat, i) => (
              <div
                key={cat.title}
                className="category-card"
                style={{ '--cat-color': cat.color, animationDelay: `${i * 0.08}s` }}
              >
                <div className="category-card-icon" style={{ color: cat.color }}>
                  <cat.icon />
                </div>
                <h3 className="category-card-title">{cat.title}</h3>
                <p className="category-card-desc">{cat.description}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <section className="home-medicines">
        <h2 className="home-medicines-title">
          Medicines
          <span className="home-medicines-count">{filtered.length} available</span>
        </h2>
        <div className="home-grid" aria-label="Medicine list">
          {filtered.length === 0 ? (
            <p className="home-empty">No medicines match your search.</p>
          ) : (
            filtered.map((m, i) => (
              <article
                key={m.id}
                className="medicine-card"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="medicine-card-header">
                  <span className="medicine-category">{m.category || 'General'}</span>
                  {m.stock !== undefined && (
                    <span className={`medicine-stock ${m.stock < 20 ? 'low' : ''}`}>
                      {m.stock < 20 && '⚠ '}{m.stock} in stock
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
                    <CartPlusIcon /> Add to cart
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
