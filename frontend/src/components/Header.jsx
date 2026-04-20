import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartCount } from '../store/slices/cartSlice';
import { selectIsAuthenticated, selectUser, logout } from '../store/slices/authSlice';
import './Header.css';

/* ── Inline SVG Icons ── */
const PillIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.5 1.5l-8.5 8.5a4.95 4.95 0 1 0 7 7l8.5-8.5a4.95 4.95 0 0 0-7-7Z" />
    <line x1="6" y1="12" x2="12" y2="6" />
  </svg>
);

const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useSelector(selectCartCount);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isAdminPage = location.pathname === '/admin';
  const isManagerPage = location.pathname === '/manager';
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setMobileOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-brand" onClick={closeMobile}>
          <PillIcon />
          <span>MedixCare</span>
        </Link>

        {/* Mobile toggle */}
        <button
          type="button"
          className="site-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <nav className={`site-nav ${mobileOpen ? 'site-nav-open' : ''}`}>
          {!isAdminPage && !isManagerPage && (
            <>
              <Link to="/" className={`site-nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMobile}>
                <PillIcon /> Medicines
              </Link>
              <Link to="/cart" className={`site-nav-link site-nav-cart ${location.pathname === '/cart' ? 'active' : ''}`} onClick={closeMobile}>
                <CartIcon />
                Cart
                {cartCount > 0 && <span className="site-cart-badge">{cartCount}</span>}
              </Link>
            </>
          )}
          {isAuthenticated ? (
            <>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className={`site-nav-link ${location.pathname === '/admin' ? 'active' : ''}`} onClick={closeMobile}>
                  <ShieldIcon /> Admin
                </Link>
              )}
              {user?.role === 'MANAGER' && (
                <Link to="/manager" className={`site-nav-link ${location.pathname === '/manager' ? 'active' : ''}`} onClick={closeMobile}>
                  <ChartIcon /> Dashboard
                </Link>
              )}
              {user?.role && <span className="site-nav-role">{user.role}</span>}
              <button type="button" className="site-nav-btn" onClick={handleLogout}>
                <LogoutIcon /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`site-nav-link ${location.pathname === '/login' ? 'active' : ''}`} onClick={closeMobile}>
                <UserIcon /> Login
              </Link>
              <Link to="/register" className="site-nav-link site-nav-link-cta" onClick={closeMobile}>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
