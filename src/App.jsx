import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import PromoCodeList from "./pages/PromoCodeList";
import PromoCodeCreate from "./pages/PromoCodeCreate";
import UpdatePromoCode from "./pages/UpdatePromoCode.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div style={{ padding: "24px" }}>
        <Routes>
          <Route path="/" element={<PromoCodeList />} />
          <Route path="/create" element={<PromoCodeCreate />} />
                  <Route
          path="/updatepromoCode/:promoCode"
          element={<  UpdatePromoCode />}
        />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
