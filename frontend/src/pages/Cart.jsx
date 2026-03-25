import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectCartItems, removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { selectToken, selectIsAuthenticated } from '../store/slices/authSlice';
import { placeOrder as placeOrderApi } from '../api/orders';
import { uploadPrescription } from '../api/prescriptions';
import { uploadPrescriptionFile } from '../api/cloudinary';
import './Cart.css';

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
        <h1 className="cart-title">Cart</h1>
        <p className="cart-empty">Your cart is empty.</p>
        <Link to="/" className="cart-link">Browse medicines</Link>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="cart-page">
        <h1 className="cart-title">Order placed</h1>
        <p className="cart-success">Your order was placed successfully.</p>
        <Link to="/" className="cart-link">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cart-title">Cart</h1>
        <button type="button" className="cart-clear" onClick={() => dispatch(clearCart())}>
          Clear cart
        </button>
      </div>
      {orderError && <p className="cart-order-error">{orderError}</p>}
      {needsPrescription && (
        <section className="cart-prescription-section">
          <h2 className="cart-prescription-title">Prescription required</h2>
          <p className="cart-prescription-desc">
            The following medicine(s) require a prescription. Please upload your prescription file before placing the order.
          </p>
          <ul className="cart-prescription-list">
            {itemsRequiringPrescription.map((item) => (
              <li key={item.medicineId}>{item.name}</li>
            ))}
          </ul>
          <label className="cart-prescription-upload">
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
        {items.map((item) => (
          <li key={item.medicineId} className="cart-item">
            <div className="cart-item-info">
              <span className="cart-item-name">{item.name}</span>
              {item.requiresPrescription && <span className="cart-item-rx">Requires prescription</span>}
              <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            <div className="cart-item-actions">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  dispatch(updateQuantity({ medicineId: item.medicineId, quantity: Number(e.target.value) || 1 }))
                }
                className="cart-item-qty"
                aria-label={`Quantity for ${item.name}`}
              />
              <button
                type="button"
                className="cart-item-remove"
                onClick={() => dispatch(removeFromCart(item.medicineId))}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="cart-footer">
        <p className="cart-total">Total: ${total.toFixed(2)}</p>
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
          {placing ? 'Placing order…' : 'Place order'}
        </button>
        <Link to="/" className="cart-link">Continue shopping</Link>
      </div>
    </div>
  );
}

export default Cart;
