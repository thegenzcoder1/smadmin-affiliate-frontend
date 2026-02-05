import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  searchPromoCodes,
  addEmailToPromoCode,
} from "../api/promoCode.api";

export default function UpdatePromoCode() {
  const { promoCode } = useParams();

  const [existingDetails, setExistingDetails] = useState([]);
  const [rows, setRows] = useState([
    { email: "", discount: "", isSubmitted: false },
  ]);
  const [loading, setLoading] = useState(false);

  /* ===============================
     LOAD EXISTING PROMO DATA
  =============================== */
  useEffect(() => {
    const loadPromo = async () => {
      try {
        setLoading(true);

        const res = await searchPromoCodes(promoCode);
        const promo = Array.isArray(res) ? res[0] : res;

        if (!promo) {
          alert("Promo code not found");
          return;
        }

        setExistingDetails(promo.details || []);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadPromo();
  }, [promoCode]);

  /* ===============================
     ADD NEW AFFILIATE
  =============================== */
  const handleAddAffiliate = async (index) => {
    const row = rows[index];

    if (!row.email || row.discount === "") {
      alert("Email and discount are required");
      return;
    }

    try {
      setLoading(true);

      await addEmailToPromoCode({
        promoCode,
        email: row.email,
        discountPercentage: Number(row.discount),
      });

      // Lock row & open next
      setRows((prev) => [
        ...prev.map((r, i) =>
          i === index ? { ...r, isSubmitted: true } : r
        ),
        { email: "", discount: "", isSubmitted: false },
      ]);

      // Also reflect in locked list
      setExistingDetails((prev) => [
        ...prev,
        {
          email: row.email,
          discountPercentage: row.discount,
        },
      ]);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     HANDLE INPUT CHANGE
  =============================== */
  const handleRowChange = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="page">
      <h2>Update Promo Code</h2>

      {/* PROMO CODE (LOCKED) */}
      <div className="row">
        <input value={promoCode} disabled />
      </div>

      <h3>Existing Affiliates</h3>

      {existingDetails.map((d, i) => (
        <div key={i} className="row">
          <input value={d.email} disabled />
          <input
            type="number"
            value={d.discountPercentage}
            disabled
          />
          <span>🔒</span>
        </div>
      ))}

      <h3>Add New Affiliate</h3>

      {rows.map((row, index) => (
        <div key={index} className="row">
          <input
            placeholder="Affiliate Email"
            value={row.email}
            disabled={row.isSubmitted}
            onChange={(e) =>
              handleRowChange(index, "email", e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Discount %"
            value={row.discount}
            disabled={row.isSubmitted}
            onChange={(e) =>
              handleRowChange(
                index,
                "discount",
                e.target.value
              )
            }
          />

          {!row.isSubmitted && (
            <button
              onClick={() => handleAddAffiliate(index)}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          )}

          {row.isSubmitted && <span>✅ Saved</span>}
        </div>
      ))}
    </div>
  );
}