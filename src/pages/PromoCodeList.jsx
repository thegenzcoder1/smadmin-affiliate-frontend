import { useEffect, useState } from "react";
import {
  getPromoCodes,
  searchPromoCodes,
  deleteEmailFromPromoCode,
  updateDiscount,
  deletePromoCode, // ✅ make sure this exists in promoCode.api.js
} from "../api/promoCode.api";
import { useNavigate } from "react-router-dom";


export default function PromoCodeList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* ===============================
     INITIAL LOAD + AUTO CLEANUP
  =============================== */
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const res = await getPromoCodes(0, 20);
        const promoCodes = res.data || [];

        // 🧹 Find invalid promoCodes (no affiliates)
        const invalidPromoCodes = promoCodes.filter(
          (p) => !p.details || p.details.length === 0
        );

        // 🗑️ Delete invalid promoCodes from backend
        await Promise.all(
          invalidPromoCodes.map((p) =>
            deletePromoCode({ promoCode: p.promoCode })
          )
        );

        // ✅ Keep only valid promoCodes in UI
        const validPromoCodes = promoCodes.filter(
          (p) => p.details && p.details.length > 0
        );

        setData(validPromoCodes);
      } catch (error) {
  console.error(error);
  alert(error.message);
} finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  /* ===============================
     SEARCH HANDLER (NO AUTO DELETE)
  =============================== */
  const handleSearch = async (value) => {
    setSearch(value);

    try {
      setLoading(true);

      if (!value.trim()) {
        const res = await getPromoCodes(0, 20);
        setData(res.data || []);
        return;
      }

      const res = await searchPromoCodes(value);
      setData(res.data || res || []);
    } catch (error) {
      console.error(error);
      alert(error.message);
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     DELETE EMAIL
  =============================== */
  const handleDelete = async (promoCode, email) => {
    try {
      await deleteEmailFromPromoCode({ promoCode, email });

      setData((prev) =>
        prev
          .map((p) =>
            p.promoCode === promoCode
              ? {
                  ...p,
                  details: p.details.filter(
                    (d) => d.email !== email
                  ),
                }
              : p
          )
          // 🧹 If promoCode becomes empty after deletion → remove from UI
          .filter((p) => p.details.length > 0)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete email");
    }
  };

  /* ===============================
     UPDATE DISCOUNT
  =============================== */
  const handleUpdate = async (
    promoCode,
    email,
    discountPercentage
  ) => {
    try {
      await updateDiscount({
        promoCode,
        email,
        discountPercentage,
      });

      setData((prev) =>
        prev.map((p) =>
          p.promoCode === promoCode
            ? {
                ...p,
                details: p.details.map((d) =>
                  d.email === email
                    ? { ...d, discountPercentage }
                    : d
                ),
              }
            : p
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update discount");
    }
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="page">
      <h2>Promo Codes</h2>

      <input
        placeholder="Search PromoCode"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading &&
        data.map((p) => (
          <div key={p.promoCode} className="promo-card">
            <h3>{p.promoCode}</h3>

            {p.details.map((d) => (
              <div key={d.email} className="row">
                <span>{d.email}</span>

                <input
                  type="number"
                  value={d.discountPercentage}
                  onChange={(e) =>
                    handleUpdate(
                      p.promoCode,
                      d.email,
                      e.target.value
                    )
                  }
                />

                <button
                  onClick={() =>
                    handleDelete(p.promoCode, d.email)
                  }
                >
                  Delete
                </button>
                <button
  style={{ marginTop: "10px" }}
  onClick={() => navigate(`/updatepromoCode/${p.promoCode}`)}
>
  ➕ Add New Email
</button>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}