import { BrowserRouter, Routes, Route } from "react-router-dom";
import OrderForm from "./components/OrderForm";
import AdminPage from "./components/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OrderForm />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}