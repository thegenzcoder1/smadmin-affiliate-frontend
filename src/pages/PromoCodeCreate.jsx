import { useState } from "react";
import {
  createPromoCode,
  addEmailToPromoCode,
} from "../api/promoCode.api";

export default function PromoCodeCreate() {
  const [promoCode, setPromoCode] = useState("");
  const [promoCreated, setPromoCreated] = useState(false);

  // Rows for affiliate entry
  const [rows, setRows] = useState([
    { email: "", discount: "", isSubmitted: false },
  ]);

  const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

  /* ===============================
     STEP 1: CREATE PROMO CODE
  =============================== */
const handleCreatePromo = async () => {
  try {
    setLoading(true);
    const res = await createPromoCode(promoCode);

    setPromoCode(res.promo.promoCode);
    setPromoCreated(true);
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};

  /* ===============================
     STEP 2 & 3: ADD AFFILIATE ROW
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

    setRows((prev) => [
      ...prev.map((r, i) =>
        i === index ? { ...r, isSubmitted: true } : r
      ),
      { email: "", discount: "", isSubmitted: false },
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
      <h2>Create Promo Code</h2>

      {/* STEP 1 */}
      <div className="row">
        <input
          placeholder="Promo Code"
          value={promoCode}
          disabled={promoCreated}
          onChange={(e) => setPromoCode(e.target.value)}
        />

        {!promoCreated && (
          <button onClick={handleCreatePromo} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        )}
      </div>

      {/* {error && <p style={{ color: "red" }}>{error}</p>} */}

      {/* STEP 2 & 3 */}
      {promoCreated && (
        <>
          <h3>Affiliate Emails</h3>

          {rows.map((row, index) => (
            <div key={index} className="row">
              <input
                placeholder="Affiliate Email"
                value={row.email}
                disabled={row.isSubmitted}
                onChange={(e) =>
                  handleRowChange(
                    index,
                    "email",
                    e.target.value
                  )
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
        </>
      )}
    </div>
  );
}