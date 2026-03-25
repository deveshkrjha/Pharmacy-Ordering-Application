import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartCount } from '../store/slices/cartSlice';
import { selectIsAuthenticated, selectUser, logout } from '../store/slices/authSlice';
import './Header.css';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useSelector(selectCartCount);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isAdminPage = location.pathname === '/admin';
  const isManagerPage = location.pathname === '/manager';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-brand">
          MedixCare Pharmacy
        </Link>
        <nav className="site-nav">
          {!isAdminPage && !isManagerPage && (
            <>
              <Link to="/" className="site-nav-link">Medicines</Link>
              <Link to="/cart" className="site-nav-link">
                Cart{cartCount > 0 ? ` (${cartCount})` : ''}
              </Link>
            </>
          )}
          {isAuthenticated ? (
            <>
              {user?.role === 'ADMIN' && <Link to="/admin" className="site-nav-link">Admin</Link>}
              {user?.role === 'MANAGER' && <Link to="/manager" className="site-nav-link">Dashboard</Link>}
              {user?.role && <span className="site-nav-role">{user.role}</span>}
              <button type="button" className="site-nav-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="site-nav-link">Login</Link>
              <Link to="/register" className="site-nav-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
