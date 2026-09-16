import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/store";
import PropertyCard from "../components/property/PropertyCard";

function Favorites() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favoriteIds = useSelector((state) => state.properties.favorites);
  const properties = useSelector((state) => state.properties.items);

  const favoriteProperties = useMemo(() => {
    const set = new Set(favoriteIds.map(String));
    return properties.filter((p) => set.has(String(p?._id || p?.id)));
  }, [favoriteIds, properties]);

  return (
    <>
      <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: "800", margin: 0 }}>Shortlisted Properties</h1>
            <p style={{ margin: "6px 0 0 0", color: "#64748b" }}>
              {favoriteIds.length} saved
            </p>
          </div>
          <button
            onClick={() => navigate("/properties")}
            style={{
              backgroundColor: "#0054a6",
              color: "#fff",
              border: "none",
              padding: "10px 14px",
              borderRadius: "8px",
              fontWeight: "800",
              cursor: "pointer",
            }}
          >
            Browse more
          </button>
        </div>

        {favoriteProperties.length === 0 ? (
          <div style={{ marginTop: "24px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "22px" }}>
            <h2 style={{ margin: 0 }}>No shortlisted properties yet</h2>
            <p style={{ margin: "8px 0 0 0", color: "#64748b" }}>Tap the heart icon on any listing to save it here.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px", marginTop: "22px" }}>
            {favoriteProperties.map((p) => (
              <div key={p._id || p.id} style={{ position: "relative" }}>
                <button
                  onClick={() => dispatch(toggleFavorite(String(p._id || p.id)))}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    zIndex: 2,
                    backgroundColor: "#ffffff",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                  title="Remove from shortlist"
                >
                  ❌
                </button>
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Favorites;