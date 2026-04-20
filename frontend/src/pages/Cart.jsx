import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectCartItems, removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { selectToken, selectIsAuthenticated } from '../store/slices/authSlice';
import { placeOrder as placeOrderApi } from '../api/orders';
import { uploadPrescription } from '../api/prescriptions';
import { uploadPrescriptionFile } from '../api/cloudinary';
import './Cart.css';

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14H7L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const itemsRequiringPrescription = items.filter((i) => i.requiresPrescription);
  const needsPrescription = itemsRequiringPrescription.length > 0;
  const canPlaceOrder = !needsPrescription || prescriptionFile != null;

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !token) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    if (items.length === 0) {
      setOrderError('Cart is empty.');
      return;
    }
    if (needsPrescription && !prescriptionFile) {
      setOrderError('Please upload a prescription file before placing your order.');
      return;
    }
    setOrderError(null);
    setPlacing(true);
    try {
      if (needsPrescription) {
        const fileUrl = await uploadPrescriptionFile(prescriptionFile);
        for (const item of itemsRequiringPrescription) {
          await uploadPrescription(token, item.medicineId, fileUrl);
        }
      }
      await placeOrderApi(token, items, needsPrescription);
      setOrderSuccess(true);
      dispatch(clearCart());
    } catch (err) {
      setOrderError(err.message || 'Order failed');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="cart-page">
        <div className="cart-empty-state">
          <div className="cart-empty-icon"><ShoppingBagIcon /></div>
          <h1 className="cart-empty-title">Your cart is empty</h1>
          <p className="cart-empty-desc">Looks like you haven't added any medicines yet.</p>
          <Link to="/" className="cart-empty-cta">Browse medicines</Link>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="cart-page">
        <div className="cart-success-state">
          <div className="cart-success-icon"><CheckCircleIcon /></div>
          <h1 className="cart-success-title">Order Placed!</h1>
          <p className="cart-success-desc">Your order was placed successfully. We'll begin processing it shortly.</p>
          <Link to="/" className="cart-empty-cta">Continue shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <button type="button" className="cart-clear" onClick={() => dispatch(clearCart())}>
            <TrashIcon /> Clear all
          </button>
        </div>

        {orderError && <p className="cart-order-error">{orderError}</p>}

        {needsPrescription && (
          <section className="cart-prescription-section">
            <h2 className="cart-prescription-title">⚕️ Prescription Required</h2>
            <p className="cart-prescription-desc">
              The following medicine(s) require a prescription. Upload before placing the order.
            </p>
            <ul className="cart-prescription-list">
              {itemsRequiringPrescription.map((item) => (
                <li key={item.medicineId}>{item.name}</li>
              ))}
            </ul>
            <label className="cart-prescription-upload">
              <UploadIcon />
              <span className="cart-prescription-upload-label">
                {prescriptionFile ? prescriptionFile.name : 'Choose prescription file (PDF or image)'}
              </span>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setPrescriptionFile(e.target.files?.[0] ?? null)}
                className="cart-prescription-input"
              />
            </label>
          </section>
        )}

        <ul className="cart-list">
          {items.map((item, i) => (
            <li key={item.medicineId} className="cart-item" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="cart-item-info">
                <span className="cart-item-name">{item.name}</span>
                {item.requiresPrescription && <span className="cart-item-rx">Requires prescription</span>}
                <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
              <div className="cart-item-actions">
                <div className="cart-qty-stepper">
                  <button
                    type="button"
                    className="cart-qty-btn"
                    onClick={() => dispatch(updateQuantity({ medicineId: item.medicineId, quantity: Math.max(1, item.quantity - 1) }))}
                    aria-label="Decrease quantity"
                  >−</button>
                  <span className="cart-qty-value">{item.quantity}</span>
                  <button
                    type="button"
                    className="cart-qty-btn"
                    onClick={() => dispatch(updateQuantity({ medicineId: item.medicineId, quantity: item.quantity + 1 }))}
                    aria-label="Increase quantity"
                  >+</button>
                </div>
                <button
                  type="button"
                  className="cart-item-remove"
                  onClick={() => dispatch(removeFromCart(item.medicineId))}
                  aria-label={`Remove ${item.name}`}
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="cart-footer">
          <div className="cart-total-row">
            <span className="cart-total-label">Total</span>
            <span className="cart-total-value">${total.toFixed(2)}</span>
          </div>
          {!isAuthenticated && (
            <p className="cart-login-hint">
              <Link to="/login">Log in</Link> to place an order.
            </p>
          )}
          <button
            type="button"
            className="cart-place-btn"
            onClick={handlePlaceOrder}
            disabled={placing || items.length === 0 || (isAuthenticated && !canPlaceOrder)}
          >
            {placing ? (
              <><span className="cart-btn-spinner" /> Placing order…</>
            ) : (
              'Place order'
            )}
          </button>
          <Link to="/" className="cart-continue-link">← Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
