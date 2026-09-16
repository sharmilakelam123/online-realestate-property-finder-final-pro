import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getRecentlySearched } from "../utils/activity";

export default function RecentlySearched() {
  const navigate = useNavigate();
  const searches = useMemo(() => getRecentlySearched(), []);

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
      <h2 style={{ fontSize: "26px", fontWeight: 900, margin: 0 }}>My Activity</h2>
      <p style={{ margin: "6px 0 0 0", color: "#64748b" }}>Recently Searched</p>

      {searches.length === 0 ? (
        <div style={{ marginTop: "20px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "22px" }}>
          <h3 style={{ margin: 0 }}>No recent searches</h3>
          <p style={{ margin: "10px 0 0 0", color: "#64748b" }}>Use the search bar to start saving your recent searches.</p>
        </div>
      ) : (
        <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {searches.map((s, idx) => (
            <button
              key={`${s}-${idx}`}
              onClick={() => navigate(`/search-results?search=${encodeURIComponent(String(s))}`)}
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                padding: "10px 12px",
                borderRadius: "999px",
                fontWeight: 900,
                cursor: "pointer",
                color: "#0f172a",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

