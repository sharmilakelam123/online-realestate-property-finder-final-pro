import React, { useEffect, useMemo, useState } from "react";
import PropertyCard from "../components/property/PropertyCard";
import { apiGet } from "../utils/api";
import { getRecentlyViewed } from "../utils/activity";

export default function RecentlyViewed() {
  const ids = useMemo(() => getRecentlyViewed().slice(0, 8), []);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!ids.length) return;
      try {
        setLoading(true);
        const fetched = await Promise.all(
          ids.map(async (id) => {
            try {
              return await apiGet(`/api/properties/${id}`);
            } catch {
              return null;
            }
          })
        );
        if (!cancelled) setProperties(fetched.filter(Boolean));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [ids]);

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
      <h2 style={{ fontSize: "26px", fontWeight: 900, margin: 0 }}>My Activity</h2>
      <p style={{ margin: "6px 0 0 0", color: "#64748b" }}>Recently Viewed</p>

      {ids.length === 0 ? (
        <div style={{ marginTop: "20px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "22px" }}>
          <h3 style={{ margin: 0 }}>No recently viewed properties</h3>
          <p style={{ margin: "10px 0 0 0", color: "#64748b" }}>Open any property details to start tracking.</p>
        </div>
      ) : loading ? (
        <div style={{ marginTop: "20px", fontWeight: 900, color: "#475569" }}>Loading…</div>
      ) : properties.length === 0 ? (
        <div style={{ marginTop: "20px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "22px" }}>
          <h3 style={{ margin: 0 }}>Could not load viewed properties</h3>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px", marginTop: "16px" }}>
          {properties.map((p) => (
            <PropertyCard key={p._id || p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}

