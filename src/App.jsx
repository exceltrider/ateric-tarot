import { HashRouter, Routes, Route } from "react-router-dom";
import OrderForm from "./components/OrderForm";
import AdminPage from "./components/AdminPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<OrderForm />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </HashRouter>
  );
}