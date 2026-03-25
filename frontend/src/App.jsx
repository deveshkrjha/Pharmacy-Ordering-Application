import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import ManagerDashboard from './pages/ManagerDashboard';
import './App.css';

function AdminRoute() {
  return <Admin />;
}

function ManagerRoute() {
  return <ManagerDashboard />;
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminRoute />} />
            <Route path="/manager" element={<ManagerRoute />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
