import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "buyers";
  const activeTool = searchParams.get("tool") || "emi";

  // Tab State Setter
  const setTabAndTool = (tab, tool) => {
    setSearchParams({ tab, tool });
  };

  // EMI Calculator States
  const [loanAmount, setLoanAmount] = useState(5000000); // 50 Lakhs
  const [interestRate, setInterestRate] = useState(8.5); // 8.5%
  const [loanTenure, setLoanTenure] = useState(20); // 20 years
  const [selectedCity, setSelectedCity] = useState("Visakhapatnam");

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = loanTenure * 12;

    const emiCalc = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPay = emiCalc * n;
    const totalInt = totalPay - P;

    setEmi(Math.round(emiCalc) || 0);
    setTotalPayment(Math.round(totalPay) || 0);
    setTotalInterest(Math.round(totalInt) || 0);
  }, [loanAmount, interestRate, loanTenure]);

  // Rent Receipt Generator States
  const [tenantName, setTenantName] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [rentAmount, setRentAmount] = useState(15000);
  const [propertyAddress, setPropertyAddress] = useState("");
  const [rentPeriod, setRentPeriod] = useState("June 2026");
  const [receiptNumber, setReceiptNumber] = useState("REC-1002");
  const [isGenerated, setIsGenerated] = useState(false);

  const handlePrint = () => {
    const printEl = document.getElementById("rent-receipt-print-area");
    if (!printEl) return;

    const printContent = printEl.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Quick restore
  };

  const RATES_DATA = {
    Visakhapatnam: [
      { locality: "Madhurawada", rate: "₹ 4,500/sqft", trend: "+6.2% YoY" },
      { locality: "Yendada", rate: "₹ 5,200/sqft", trend: "+4.1% YoY" },
      { locality: "Seethammadhara", rate: "₹ 4,900/sqft", trend: "+3.8% YoY" },
      { locality: "MVP Colony", rate: "₹ 6,100/sqft", trend: "+5.4% YoY" }
    ],
    Hyderabad: [
      { locality: "Kukatpally", rate: "₹ 6,800/sqft", trend: "+7.1% YoY" },
      { locality: "Hitech City", rate: "₹ 7,500/sqft", trend: "+4.6% YoY" },
      { locality: "Gachibowli", rate: "₹ 8,200/sqft", trend: "+6.0% YoY" },
      { locality: "Kondapur", rate: "₹ 6,950/sqft", trend: "+5.2% YoY" }
    ],
    Mumbai: [
      { locality: "Andheri West", rate: "₹ 14,500/sqft", trend: "+3.2% YoY" },
      { locality: "Bandra", rate: "₹ 18,000/sqft", trend: "+2.4% YoY" },
      { locality: "Powai", rate: "₹ 12,900/sqft", trend: "+4.1% YoY" },
      { locality: "Thane", rate: "₹ 10,800/sqft", trend: "+5.8% YoY" }
    ]
  };

  return (
    <div>
      {/* Removed top Property Rates & Trends split layout to keep only the lower single UI section */}


      {/* Main Tab Controller Bar */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          padding: "8px",
          marginBottom: "28px",
          flexWrap: "wrap",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)"
        }}
      >
        {[
          { key: "buyers", label: "For Buyers", defaultTool: "emi" },
          { key: "tenants", label: "For Tenants", defaultTool: "rent" },
          { key: "owners", label: "For Owners", defaultTool: "guide" },
          { key: "dealers", label: "For Dealers / Builders", defaultTool: "analytics" }
        ].map((tabOpt) => (
          <button
            key={tabOpt.key}
            onClick={() => setTabAndTool(tabOpt.key, tabOpt.defaultTool)}
            style={{
              flex: 1,
              minWidth: "150px",
              padding: "12px 20px",
              borderRadius: "12px",
              border: "none",
              background: activeTab === tabOpt.key ? "#0054a6" : "transparent",
              color: activeTab === tabOpt.key ? "#ffffff" : "#475569",
              fontWeight: "800",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {tabOpt.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "32px", alignItems: "start" }}>
        {/* Sidebar Tool Navigation */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          {activeTab === "buyers" && (
            <>
              <button onClick={() => setTabAndTool("buyers", "emi")} style={sidebarBtnStyle(activeTool === "emi")}>
                Home Loan EMI Calculator
              </button>
              <button
                onClick={() => setTabAndTool("buyers", "rates")}
                style={sidebarBtnStyle(activeTool === "rates")}
              >
                Property Rates & Trends
              </button>
              <button
                onClick={() => setTabAndTool("buyers", "policy")}
                style={sidebarBtnStyle(activeTool === "policy")}
              >
                GST & RERA Policies
              </button>
            </>
          )}
          {activeTab === "tenants" && (
            <>
              <button onClick={() => setTabAndTool("tenants", "rent")} style={sidebarBtnStyle(activeTool === "rent")}>
                Rent Receipt Generator
              </button>
              <button
                onClick={() => setTabAndTool("tenants", "guide")}
                style={sidebarBtnStyle(activeTool === "guide")}
              >
                Renting Checklists
              </button>
            </>
          )}
          {activeTab === "owners" && (
            <>
              <button onClick={() => setTabAndTool("owners", "guide")} style={sidebarBtnStyle(activeTool === "guide")}
              >
                Selling / Posting Guide
              </button>
              <button
                onClick={() => setTabAndTool("owners", "valuation")}
                style={sidebarBtnStyle(activeTool === "valuation")}
              >
                Property Valuation Est.
              </button>
            </>
          )}
          {activeTab === "dealers" && (
            <>
              <button
                onClick={() => setTabAndTool("dealers", "analytics")}
                style={sidebarBtnStyle(activeTool === "analytics")}
              >
                Marketing & Leads Dashboard
              </button>
            </>
          )}
        </div>

        {/* Content Display Window */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            padding: "24px",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.04)"
          }}
        >
          {/* BUYERS: EMI Calculator */}
          {activeTab === "buyers" && activeTool === "emi" && (
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "900", margin: "0 0 8px 0", color: "#0f172a" }}>
                Home Loan EMI Calculator
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
                Adjust sliders below to view your monthly installments, total interest, and payout breakdowns.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {/* Sliders */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: "800",
                        fontSize: "14px",
                        marginBottom: "6px"
                      }}
                    >
                      <span>Loan Amount</span>
                      <span style={{ color: "#0054a6" }}>₹{(loanAmount / 100000).toFixed(1)} Lakhs</span>
                    </div>
                    <input
                      type="range"
                      min="500000"
                      max="20000000"
                      step="100000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      style={{ width: "100%", height: "6px", accentColor: "#0054a6" }}
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: "800",
                        fontSize: "14px",
                        marginBottom: "6px"
                      }}
                    >
                      <span>Interest Rate</span>
                      <span style={{ color: "#0054a6" }}>{interestRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="15"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      style={{ width: "100%", height: "6px", accentColor: "#0054a6" }}
                    />
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: "800",
                        fontSize: "14px",
                        marginBottom: "6px"
                      }}
                    >
                      <span>Tenure (Years)</span>
                      <span style={{ color: "#0054a6" }}>{loanTenure} Years</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(Number(e.target.value))}
                      style={{ width: "100%", height: "6px", accentColor: "#0054a6" }}
                    />
                  </div>
                </div>

                {/* Calculation Cards */}
                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div
                    style={{
                      borderBottom: "1px solid #e2e8f0",
                      paddingBottom: "14px",
                      marginBottom: "14px",
                      textAlign: "center"
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "800",
                        color: "#64748b",
                        textTransform: "uppercase"
                      }}
                    >
                      Monthly Loan EMI
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "900", color: "#0054a6", marginTop: "4px" }}>
                      ₹{emi.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div style={{ display: "grid", gap: "10px", fontSize: "13px", fontWeight: "750" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748b" }}>Principal Amount</span>
                      <span style={{ color: "#0f172a" }}>₹{loanAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748b" }}>Interest Payable</span>
                      <span style={{ color: "#0f172a" }}>₹{totalInterest.toLocaleString("en-IN")}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderTop: "1px solid #cbd5e1",
                        paddingTop: "8px",
                        fontWeight: "900"
                      }}
                    >
                      <span style={{ color: "#0f172a" }}>Total Payment</span>
                      <span style={{ color: "#0f172a" }}>₹{totalPayment.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BUYERS: Property Rates */}
          {activeTab === "buyers" && activeTool === "rates" && (
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "900", margin: "0 0 8px 0", color: "#0f172a" }}>
                Property Rates & Trends
              </h2>

              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "16px" }}>
                Search city and view locality-wise rates instantly.
              </p>

              {/* CITY SEARCH */}
              <input
                type="text"
                placeholder="Search City (e.g. Mumbai, Hyderabad...)"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  marginBottom: "16px"
                }}
              />

              {/* SHOW ONLY SELECTED CITY */}
              {RATES_DATA[selectedCity] ? (
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "850", marginBottom: "10px" }}>{selectedCity}</h3>

                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f1f5f9" }}>
                        <th style={{ padding: "10px", textAlign: "left" }}>Locality</th>
                        <th style={{ padding: "10px", textAlign: "left" }}>Rate</th>
                        <th style={{ padding: "10px", textAlign: "left" }}>YoY</th>
                      </tr>
                    </thead>

                    <tbody>
                      {RATES_DATA[selectedCity].map((r) => (
                        <tr key={r.locality} style={{ borderBottom: "1px solid #e2e8f0" }}>
                          <td style={{ padding: "10px" }}>{r.locality}</td>
                          <td style={{ padding: "10px" }}>{r.rate}</td>
                          <td style={{ padding: "10px", color: "#10b981" }}>{r.trend}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: "#64748b" }}>
                  Please search a valid city (Visakhapatnam, Hyderabad, Mumbai, etc.)
                </p>
              )}
            </div>
          )}

          {/* BUYERS: Policies FAQ */}
          {activeTab === "buyers" && activeTool === "policy" && (
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "900", margin: "0 0 8px 0", color: "#0f172a" }}>
                GST & RERA Policies
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
                Learn about RERA and GST rules in Indian real estate buying.
              </p>

              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  {
                    q: "What is RERA?",
                    a: "RERA stands for Real Estate Regulatory Authority. Introduced to protect home buyers and boost investments, it mandates builders to register all projects, provide timelines, and guarantee quality construction. Registered builders are given a unique RERA ID."
                  },
                  {
                    q: "How much GST applies to under-construction properties?",
                    a: "Affordable housing under-construction projects attract 1% GST, while non-affordable housing projects attract 5% GST (without Input Tax Credit). Fully finished projects with Occupancy Certificate (OC) attract 0% GST."
                  },
                  {
                    q: "Why is a RERA-certified property preferred?",
                    a: "RERA properties ensure project transparency, clear land titles, adherence to building plans, and refund policies if delivery is delayed. It heavily safeguards buyers from builder defaults."
                  }
                ].map((item, idx) => (
                  <details
                    key={idx}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "12px 16px"
                    }}
                  >
                    <summary style={{ fontWeight: "800", cursor: "pointer", color: "#0f172a" }}>{item.q}</summary>
                    <p
                      style={{
                        marginTop: "10px",
                        color: "#475569",
                        fontSize: "13px",
                        lineHeight: "1.6",
                        fontWeight: "600"
                      }}
                    >
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* TENANTS: Rent Receipt Generator */}
          {activeTab === "tenants" && activeTool === "rent" && (
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "900", margin: "0 0 8px 0", color: "#0f172a" }}>
                Rent Receipt Generator
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
                Generate, preview, and print rent receipts for HRA tax exemption claims instantly.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {/* Form fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "800", marginBottom: "4px" }}>
                      Tenant Name
                    </label>
                    <input
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      placeholder="Enter tenant name"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "800", marginBottom: "4px" }}>
                      Landlord Name
                    </label>
                    <input
                      value={landlordName}
                      onChange={(e) => setLandlordName(e.target.value)}
                      placeholder="Enter landlord name"
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "800", marginBottom: "4px" }}>
                        Monthly Rent (₹)
                      </label>
                      <input
                        type="number"
                        value={rentAmount}
                        onChange={(e) => setRentAmount(Number(e.target.value))}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "800", marginBottom: "4px" }}>
                        Rent Period
                      </label>
                      <input
                        value={rentPeriod}
                        onChange={(e) => setRentPeriod(e.target.value)}
                        placeholder="e.g. June 2026"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "800", marginBottom: "4px" }}>
                      Property Address
                    </label>
                    <textarea
                      value={propertyAddress}
                      onChange={(e) => setPropertyAddress(e.target.value)}
                      placeholder="Enter house address"
                      style={{ ...inputStyle, height: "60px", resize: "none" }}
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (tenantName && landlordName && propertyAddress) {
                        setIsGenerated(true);
                      } else {
                        alert("Please fill in Tenant, Landlord, and Address details.");
                      }
                    }}
                    style={{
                      background: "#0054a6",
                      color: "#ffffff",
                      border: "none",
                      padding: "12px",
                      borderRadius: "10px",
                      fontWeight: "900",
                      cursor: "pointer",
                      marginTop: "8px"
                    }}
                  >
                    Generate Receipt
                  </button>
                </div>

                {/* Live Preview Card */}
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", fontWeight: "800", color: "#64748b" }}>Live Receipt Preview</span>
                    {isGenerated && (
                      <button
                        onClick={handlePrint}
                        style={{
                          background: "#16a34a",
                          color: "#ffffff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontWeight: "800",
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        Print Receipt
                      </button>
                    )}
                  </div>

                  {/* Stamp receipt preview */}
                  <div
                    id="rent-receipt-print-area"
                    style={{
                      background: "#fffbeb",
                      border: "2px dashed #d97706",
                      borderRadius: "14px",
                      padding: "24px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                      fontFamily: "monospace",
                      fontSize: "13px",
                      lineHeight: "1.6",
                      color: "#1e293b",
                      position: "relative"
                    }}
                  >
                    {/* Revenue stamp mock */}
                    <div
                      style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        width: "65px",
                        height: "65px",
                        border: "1px solid #d97706",
                        background: "#fef3c7",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "9px",
                        fontWeight: "900",
                        color: "#b45309",
                        borderRadius: "4px"
                      }}
                    >
                      <div>REVENUE</div>
                      <div>STAMP</div>
                      <div style={{ borderTop: "1px solid #b45309", marginTop: "2px", width: "100%", textAlign: "center" }}>
                        ₹ 1
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: "900",
                        borderBottom: "2px solid #d97706",
                        pb: "6px",
                        mb: "12px",
                        color: "#b45309"
                      }}
                    >
                      RENT RECEIPT
                    </div>
                    <div>
                      <strong>Receipt No:</strong> {receiptNumber}
                    </div>
                    <div>
                      <strong>Date:</strong> {new Date().toLocaleDateString()}
                    </div>
                    <div style={{ borderBottom: "1px solid #fcd34d", margin: "10px 0" }}></div>
                    <div>
                      Received a sum of <strong>₹{(rentAmount || 0).toLocaleString("en-IN")}</strong> from{" "}
                      <strong>{tenantName || "_________________"}</strong> towards house rent for the month/period of{" "}
                      <strong>{rentPeriod || "_________________"}</strong>.
                    </div>
                    <div style={{ marginTop: "12px" }}>
                      <strong>For House Address:</strong>
                      <br />
                      {propertyAddress || "_____________________________________"}
                    </div>
                    <div style={{ borderBottom: "1px solid #fcd34d", margin: "14px 0" }}></div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", fontWeight: "900" }}>
                      <div>
                        <div>Landlord Signature:</div>
                        <div style={{ fontStyle: "italic", color: "#475569", marginTop: "16px" }}>
                          {landlordName || "_________________"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TENANTS: Checklist */}
          {activeTab === "tenants" && activeTool === "guide" && (
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "900", margin: "0 0 8px 0", color: "#0f172a" }}>
                Renting Checklists
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
                Critical things to inspect before signing a rental agreement.
              </p>

              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  {
                    t: "1. Inspect Water & Electric Fittings",
                    d: "Turn on all taps, showers, and check flush mechanisms. Verify power points, geysers, and make sure electrical appliances provided are in working condition."
                  },
                  {
                    t: "2. Verify Lock-in Period & Deposit Details",
                    d: "Typically, rental agreements have an 11-month tenure with a 1-3 month lock-in period. Confirm deposit refund terms and paint/cleaning charges deductions."
                  },
                  {
                    t: "3. Check Maintenance and Utility Bills",
                    d: "Confirm if society maintenance fees, water charges, and parking charges are included in the monthly rent or billed separately."
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "14px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0"
                    }}
                  >
                    <div style={{ fontWeight: "800", color: "#0f172a", fontSize: "14px", marginBottom: "4px" }}>
                      {item.t}
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5", fontWeight: "600" }}>
                      {item.d}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OWNERS: Seller Guide */}
          {activeTab === "owners" && activeTool === "guide" && (
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "900", margin: "0 0 8px 0", color: "#0f172a" }}>
                Selling & Posting Guide
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
                How to post your property successfully and close deals faster.
              </p>

              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  {
                    title: "Take Premium Real Photos",
                    desc: "Properties with clear, well-lit photos (living room, bedrooms, kitchen, view) get 5x more clicks. Avoid using dark or blurry images."
                  },
                  {
                    title: "Describe Key Selling Points",
                    desc: "Highlight RERA verification, nearby IT parks, beach access (if in Vizag), gated security, and water supply availability in your listing descriptions."
                  },
                  {
                    title: "Price it Right",
                    desc: "Check the 'Property Rates' tool to understand average prices in your locality before naming a price. Overpricing leads to fewer leads."
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "14px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0"
                    }}
                  >
                    <div style={{ fontWeight: "800", color: "#0f172a", fontSize: "14px", marginBottom: "4px" }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5", fontWeight: "600" }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OWNERS: Property Valuation Estimate */}
          {activeTab === "owners" && activeTool === "valuation" && (
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "900", margin: "0 0 8px 0", color: "#0f172a" }}>
                Property Valuation Estimate
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
                Calculate a quick valuation estimate for your property based on size and location.
              </p>

              <ValuationCalculator />
            </div>
          )}

          {/* BUILDERS / DEALERS: Marketing & Leads Dashboard */}
          {activeTab === "dealers" && activeTool === "analytics" && (
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "900", margin: "0 0 4px 0", color: "#0f172a" }}>Dealer Marketing & Leads</h2>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
                Real-time analytics mockup for active builders and registered dealers.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "16px",
                  marginBottom: "28px"
                }}
              >
                {[
                  { label: "Active Listings", val: "14", color: "#0054a6" },
                  { label: "Leads Generated", val: "124", color: "#16a34a" },
                  { label: "Impressions", val: "8.4k", color: "#8b5cf6" },
                  { label: "Avg response", val: "2 hrs", color: "#eab308" }
                ].map((card) => (
                  <div
                    key={card.label}
                    style={{
                      padding: "16px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0"
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        fontWeight: "800",
                        textTransform: "uppercase"
                      }}
                    >
                      {card.label}
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: "900", color: card.color, marginTop: "4px" }}>{card.val}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontWeight: "800", color: "#0f172a", fontSize: "14px", marginBottom: "12px" }}>Leads Over Time (Weekly)</div>
                {/* Horizontal simple bars */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { week: "Week 1", count: 20, pct: "30%" },
                    { week: "Week 2", count: 32, pct: "50%" },
                    { week: "Week 3", count: 48, pct: "75%" },
                    { week: "Week 4", count: 64, pct: "100%" }
                  ].map((w) => (
                    <div
                      key={w.week}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontSize: "13px",
                        fontWeight: "750"
                      }}
                    >
                      <span style={{ width: "60px", color: "#475569" }}>{w.week}</span>
                      <div style={{ flex: 1, height: "16px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                        <div
                          style={{
                            width: w.pct,
                            height: "100%",
                            background: "#0054a6",
                            transition: "width 0.3s"
                          }}
                        ></div>
                      </div>
                      <span style={{ width: "80px", color: "#0f172a", textAlign: "right" }}>{w.count} Leads</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Side bar buttons helper
const sidebarBtnStyle = (active) => ({
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid " + (active ? "#e2e8f0" : "transparent"),
  background: active ? "#f8fafc" : "transparent",
  color: active ? "#0054a6" : "#475569",
  fontWeight: "800",
  fontSize: "13px",
  textAlign: "left",
  cursor: "pointer",
  transition: "all 0.2s"
});

// Form inputs style
const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: "13px",
  fontWeight: "650",
  boxSizing: "border-box"
};

function ValuationCalculator() {
  const LOCALITY_MULTIPLIERS = {
    Etcherla: 1500,
    Arasavilli: 3200
  };

  const [valCity, setValCity] = useState("Visakhapatnam");
  const [valLocality, setValLocality] = useState("Madhurawada");
  const [valArea, setValArea] = useState(1200);
  const [estimatedVal, setEstimatedVal] = useState(0);

  useEffect(() => {
    const rate = LOCALITY_MULTIPLIERS[valLocality] || 3500;
    setEstimatedVal(valArea * rate);
  }, [valCity, valLocality, valArea]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "800", marginBottom: "4px" }}>Select City</label>
          <select
            value={valCity}
            onChange={(e) => {
              setValCity(e.target.value);
              setValLocality(e.target.value === "Visakhapatnam" ? "Madhurawada" : "Balaga");
            }}
            style={inputStyle}
          >
            <option value="Visakhapatnam">Visakhapatnam (Vizag)</option>
            <option value="Srikakulam">Srikakulam</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "800", marginBottom: "4px" }}>Select Locality</label>
          <select value={valLocality} onChange={(e) => setValLocality(e.target.value)} style={inputStyle}>
            {valCity === "Visakhapatnam" ? (
              <>
                <option value="Madhurawada">Madhurawada</option>
                <option value="Yendada">Yendada</option>
                <option value="Seethammadhara">Seethammadhara</option>
                <option value="MVP Colony">MVP Colony</option>
                <option value="Gajuwaka">Gajuwaka</option>
              </>
            ) : (
              <>
                <option value="Balaga">Balaga</option>
                <option value="Etcherla">Etcherla</option>
                <option value="Arasavilli">Arasavilli</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "800", marginBottom: "4px" }}>Super Builtup Area (sqft)</label>
          <input type="number" value={valArea} onChange={(e) => setValArea(Number(e.target.value))} style={inputStyle} />
        </div>
      </div>

      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div style={{ fontSize: "13px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>Estimated Market Value</div>
        <div style={{ fontSize: "24px", fontWeight: "950", color: "#16a34a", marginTop: "6px" }}>₹{estimatedVal.toLocaleString("en-IN")}</div>
        <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "700", marginTop: "8px", textAlign: "center" }}>
          Note: This is an estimated market price calculated using current market averages of {valLocality}.
        </div>
      </div>
    </div>
  );
}

