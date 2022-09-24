import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import AccountPage from "./pages/AccountPage";
import HomePage from "./pages/HomePage";
import InventoryPage from "./pages/InventoryPage";
import ManageOrdersPage from "./pages/ManageOrdersPage";
import PayrollPage from "./pages/PayrollPage";
import Nav from './pages/Navigation';
import PlaceOrderPage from "./pages/PlaceOrderPage";

import './App.css';

export default function App() {
  return (
    <>
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="place_order" element={<PlaceOrderPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="manage_orders" element={<ManageOrdersPage />} />
        <Route path="payroll" element={<PayrollPage />} />
        <Route path="inventory" element={<InventoryPage />} />
      </Routes>
    </Router>
    </>
  );
}

