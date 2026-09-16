import React, { useMemo } from "react";
import PropertyCard from "../components/property/PropertyCard";
import { getContactedLeads } from "../utils/activity";

function statusLabel(status) {
  const map = {
    new: "Enquiry",
    contacted: "Contacted",
    site_visit_scheduled: "Visit Scheduled",
    site_visit_done: "Visit Done",
    negotiation: "Negotiation",
    token_paid: "Token/Booking",
    closed_won: "Closed (Won)",
    closed_lost: "Closed (Lost)",
  };
  return map[status] || status;
}

export default function Contacted() {
  const leads = useMemo(() => getContactedLeads(), []);

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
      <h2 style={{ fontSize: "26px", fontWeight: 900, margin: 0 }}>My Activity</h2>
      <p style={{ margin: "6px 0 0 0", color: "#64748b" }}>Contacted</p>

      {leads.length === 0 ? (
        <div style={{ marginTop: "20px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "22px" }}>
          <h3 style={{ margin: 0 }}>No contacted enquiries yet</h3>
          <p style={{ margin: "10px 0 0 0", color: "#64748b" }}>Submit “Request Call Back” from a property page.</p>
        </div>
      ) : (
        <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {leads.map((lead) => (
            <div key={lead._id} style={{ position: "relative" }}>
              {lead.property ? (
                <>
                  <div style={{ position: "absolute", top: "12px", left: "12px", zIndex: 3, background: "#0f172a", color: "#fff", padding: "3px 8px", borderRadius: "999px", fontWeight: 900, fontSize: "11px" }}>
                    {statusLabel(lead.status)}
                  </div>
                  <PropertyCard property={lead.property} />
                </>
              ) : (
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "18px" }}>
                  <div style={{ fontWeight: 900 }}>{lead.name}</div>
                  <div style={{ color: "#64748b", marginTop: "6px" }}>{lead.phone}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

