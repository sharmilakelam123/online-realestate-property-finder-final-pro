import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setProperties } from "../redux/store";
import PropertyCard from "../components/property/PropertyCard";
import { apiGet } from "../utils/api";
import { motion } from "framer-motion";

const CATEGORY_OPTIONS = [
  { key: "", label: "All" },
  { key: "apartment", label: "Apartment" },
  { key: "villa", label: "Villa" },
  { key: "independent-house", label: "House" },
  { key: "plot", label: "Plots/Land" },
  { key: "office", label: "Commercial" },
  { key: "shop", label: "Shop" },
  { key: "builder-floor", label: "Builder Floor" },
];

const SORT_OPTIONS = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "priceLow", label: "Price: Low to High" },
  { key: "priceHigh", label: "Price: High to Low" },
  { key: "areaHigh", label: "Area: High to Low" },
];

const CITY_BUILDERS = {
  Visakhapatnam: [
    { name: "MVV Builders", total: 42, cityProj: 41, rating: "4.8" },
    { name: "Vaisakhi Developers", total: 11, cityProj: 11, rating: "4.7" },
    { name: "Shriram Properties", total: 76, cityProj: 4, rating: "4.9" },
    { name: "MK Builders Vishakhapatnam", total: 23, cityProj: 22, rating: "4.6" },
    { name: "Lansum Enpoint Developers", total: 15, cityProj: 5, rating: "4.8" }
  ],
  Hyderabad: [
    { name: "My Home Group", total: 35, cityProj: 35, rating: "4.9" },
    { name: "Aparna Constructions", total: 54, cityProj: 50, rating: "4.8" },
    { name: "Rajapushpa Properties", total: 20, cityProj: 20, rating: "4.8" },
    { name: "Anuhar Homes", total: 15, cityProj: 15, rating: "4.6" },
    { name: "Candeur Homes", total: 12, cityProj: 10, rating: "4.7" }
  ],
  Bangalore: [
    { name: "Prestige Group", total: 120, cityProj: 80, rating: "4.9" },
    { name: "Sobha Limited", total: 85, cityProj: 60, rating: "4.8" },
    { name: "Brigade Group", total: 95, cityProj: 70, rating: "4.8" },
    { name: "Puravankara", total: 60, cityProj: 45, rating: "4.7" }
  ],
  Chennai: [
    { name: "Casagrand Builder", total: 110, cityProj: 90, rating: "4.8" },
    { name: "Akshaya Homes", total: 40, cityProj: 38, rating: "4.6" },
    { name: "Appaswamy Real Estates", total: 35, cityProj: 35, rating: "4.7" },
    { name: "Alliance Group", total: 25, cityProj: 15, rating: "4.5" }
  ],
  Srikakulam: [
    { name: "Bhoomatha Estates", total: 33, cityProj: 27, rating: "4.5" },
    { name: "Subhagruha Projects", total: 42, cityProj: 15, rating: "4.6" },
    { name: "Peram Group", total: 34, cityProj: 10, rating: "4.4" }
  ],
  Delhi: [
    { name: "DLF Limited", total: 150, cityProj: 120, rating: "4.9" },
    { name: "Godrej Properties", total: 80, cityProj: 30, rating: "4.8" },
    { name: "Supertech", total: 45, cityProj: 40, rating: "4.1" }
  ],
  Mumbai: [
    { name: "Lodha Group", total: 105, cityProj: 95, rating: "4.8" },
    { name: "Godrej Properties", total: 80, cityProj: 35, rating: "4.8" },
    { name: "Hiranandani", total: 50, cityProj: 45, rating: "4.9" }
  ],
  Pune: [
    { name: "Kolte-Patil", total: 60, cityProj: 55, rating: "4.7" },
    { name: "Godrej Properties", total: 80, cityProj: 25, rating: "4.8" },
    { name: "Kumar Properties", total: 40, cityProj: 40, rating: "4.6" }
  ]
};

const CITY_DEMAND = {
  Visakhapatnam: {
    apartment: [
      { name: "Madhurawada", pct: 9 },
      { name: "Yendada", pct: 4 },
      { name: "Seethammadhara", pct: 3 },
      { name: "MVP Colony", pct: 3 },
      { name: "Pendurthi", pct: 3 }
    ],
    plot: [
      { name: "Madhurawada", pct: 8 },
      { name: "Bhogapuram", pct: 6 },
      { name: "Anandapuram", pct: 4 },
      { name: "Pendurthi", pct: 4 },
      { name: "Bheemili", pct: 3 }
    ],
    "builder-floor": [
      { name: "Madhurawada", pct: 11 },
      { name: "Pendurthi", pct: 5 },
      { name: "Gajuwaka", pct: 5 },
      { name: "Bhogapuram", pct: 3 },
      { name: "Seethammadhara", pct: 3 }
    ]
  },
  Hyderabad: {
    apartment: [
      { name: "Nagole", pct: 15 },
      { name: "Uppal", pct: 12 },
      { name: "Miyapur", pct: 10 },
      { name: "Gachibowli", pct: 8 },
      { name: "Kondapur", pct: 6 }
    ],
    plot: [
      { name: "Dammaiguda", pct: 18 },
      { name: "Rampally", pct: 15 },
      { name: "ECIL", pct: 12 },
      { name: "Nagole", pct: 8 }
    ],
    "builder-floor": [
      { name: "Uppal", pct: 10 },
      { name: "Miyapur", pct: 8 },
      { name: "Nagole", pct: 6 }
    ]
  },
  Srikakulam: {
    apartment: [
      { name: "Balaga", pct: 20 },
      { name: "Arasavilli", pct: 10 }
    ],
    plot: [
      { name: "Etcherla", pct: 35 },
      { name: "Ragolu", pct: 18 }
    ],
    "builder-floor": [
      { name: "Balaga", pct: 15 },
      { name: "Arasavilli", pct: 9 }
    ]
  },
  Bangalore: {
    apartment: [
      { name: "Whitefield", pct: 22 },
      { name: "HSR Layout", pct: 18 },
      { name: "Electronic City", pct: 14 }
    ],
    plot: [
      { name: "Whitefield", pct: 15 },
      { name: "HSR Layout", pct: 12 }
    ],
    "builder-floor": [
      { name: "Whitefield", pct: 10 },
      { name: "Electronic City", pct: 8 }
    ]
  },
  Chennai: {
    apartment: [
      { name: "OMR", pct: 20 },
      { name: "Velachery", pct: 15 },
      { name: "Anna Nagar", pct: 10 }
    ],
    plot: [
      { name: "Tambaram", pct: 22 },
      { name: "OMR", pct: 14 }
    ],
    "builder-floor": [
      { name: "OMR", pct: 12 },
      { name: "Velachery", pct: 8 }
    ]
  },
  Mumbai: {
    apartment: [
      { name: "Powai", pct: 25 },
      { name: "Bandra", pct: 18 },
      { name: "Thane", pct: 12 }
    ],
    plot: [
      { name: "Thane", pct: 10 }
    ],
    "builder-floor": [
      { name: "Bandra", pct: 8 }
    ]
  },
  Delhi: {
    apartment: [
      { name: "Dwarka", pct: 22 },
      { name: "Saket", pct: 15 },
      { name: "Noida", pct: 12 }
    ],
    plot: [
      { name: "Noida", pct: 14 }
    ],
    "builder-floor": [
      { name: "Vasant Kunj", pct: 18 },
      { name: "Dwarka", pct: 8 }
    ]
  },
  Pune: {
    apartment: [
      { name: "Hinjewadi", pct: 24 },
      { name: "Wakad", pct: 16 },
      { name: "Baner", pct: 12 }
    ],
    plot: [
      { name: "Wakad", pct: 10 }
    ],
    "builder-floor": [
      { name: "Baner", pct: 8 }
    ]
  }
};

const CITY_GAINERS = {
  Visakhapatnam: [
    { name: "Sheela Nagar", rate: "₹4,950", trend: "15.1% YoY" },
    { name: "Gopalapatnam Rural", rate: "₹4,950", trend: "13.8% YoY" },
    { name: "Madhurawada", rate: "₹5,350", trend: "7.0% YoY" }
  ],
  Hyderabad: [
    { name: "Dammaiguda", rate: "₹4,200", trend: "18.2% YoY" },
    { name: "Rampally", rate: "₹3,900", trend: "14.5% YoY" },
    { name: "Nagole", rate: "₹6,800", trend: "10.1% YoY" }
  ],
  Srikakulam: [
    { name: "Balaga", rate: "₹2,800", trend: "4.2% YoY" },
    { name: "Etcherla", rate: "₹1,500", trend: "3.0% YoY" },
    { name: "Arasavilli", rate: "₹3,200", trend: "5.0% YoY" }
  ],
  Bangalore: [
    { name: "Whitefield", rate: "₹7,200", trend: "12.4% YoY" },
    { name: "HSR Layout", rate: "₹8,500", trend: "9.8% YoY" },
    { name: "Electronic City", rate: "₹5,400", trend: "11.1% YoY" }
  ],
  Chennai: [
    { name: "OMR", rate: "₹5,600", trend: "8.5% YoY" },
    { name: "Velachery", rate: "₹7,200", trend: "7.0% YoY" },
    { name: "Tambaram", rate: "₹4,800", trend: "10.2% YoY" }
  ],
  Mumbai: [
    { name: "Powai", rate: "₹24,000", trend: "9.1% YoY" },
    { name: "Bandra", rate: "₹42,000", trend: "6.5% YoY" },
    { name: "Thane", rate: "₹12,500", trend: "12.0% YoY" }
  ],
  Delhi: [
    { name: "Dwarka", rate: "₹9,200", trend: "8.4% YoY" },
    { name: "Saket", rate: "₹14,500", trend: "5.5% YoY" },
    { name: "Noida", rate: "₹5,800", trend: "13.2% YoY" }
  ],
  Pune: [
    { name: "Hinjewadi", rate: "₹5,900", trend: "10.5% YoY" },
    { name: "Wakad", rate: "₹6,800", trend: "8.2% YoY" },
    { name: "Baner", rate: "₹8,200", trend: "11.0% YoY" }
  ]
};

export default function PropertyListing() {
  const dispatch = useDispatch();

  const [tab, setTab] = useState("buy"); // buy | rent
  const [city, setCity] = useState("Visakhapatnam");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [verified, setVerified] = useState(false);
  const [demandTab, setDemandTab] = useState("apartment");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const limit = 24;

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState({ apartment: null, plot: null, "independent-house": null });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    params.set("sort", sort);
    params.set("listingType", tab === "rent" ? "rent" : "sale");
    if (city) params.set("city", city);
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    if (verified) params.set("verified", "true");
    return params.toString();
  }, [page, sort, tab, city, q, category, verified]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await apiGet(`/api/properties?${queryString}`);
        if (cancelled) return;
        setItems(Array.isArray(data?.items) ? data.items : []);
        setTotal(Number(data?.total || 0));
        setPages(Number(data?.pages || 1));
        dispatch(setProperties(Array.isArray(data?.items) ? data.items : []));
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load properties");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [dispatch, queryString]);

  useEffect(() => {
    let cancelled = false;
    async function loadStats() {
      try {
        const listingType = tab === "rent" ? "rent" : "sale";
        const data = await apiGet(`/api/properties/stats?city=${encodeURIComponent(city)}&listingType=${listingType}`);
        if (!cancelled) setStats(data);
      } catch {
        if (!cancelled) setStats(null);
      }
    }
    if (city) loadStats();
    return () => {
      cancelled = true;
    };
  }, [city, tab]);

  useEffect(() => {
    let cancelled = false;
    async function loadTrends() {
      try {
        const listingType = tab === "rent" ? "rent" : "sale";
        const [a, p, h] = await Promise.all([
          apiGet(`/api/properties/locality-trends?city=${encodeURIComponent(city)}&listingType=${listingType}&category=apartment&limit=5`),
          apiGet(`/api/properties/locality-trends?city=${encodeURIComponent(city)}&listingType=${listingType}&category=plot&limit=5`),
          apiGet(`/api/properties/locality-trends?city=${encodeURIComponent(city)}&listingType=${listingType}&category=independent-house&limit=5`),
        ]);
        if (!cancelled) setTrends({ apartment: a, plot: p, "independent-house": h });
      } catch {
        if (!cancelled) setTrends({ apartment: null, plot: null, "independent-house": null });
      }
    }
    if (city) loadTrends();
    return () => { cancelled = true; };
  }, [city, tab]);

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [tab, city, q, category, verified, sort]);

  return (
    <div style={{ maxWidth: "1200px", margin: "28px auto", padding: "0 20px" }}>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <h1 style={{ fontSize: "26px", fontWeight: 900, margin: 0 }}>Buy in {city || "India"}</h1>
        <p style={{ margin: "6px 0 0 0", color: "#64748b" }}>
          Browse verified apartments, villas, plots & more — 99acres-style filters + sorting.
        </p>
      </motion.div>

      {/* Tabs + quick search */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", marginTop: "16px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setTab("buy")}
            style={{
              background: tab === "buy" ? "#0054a6" : "#fff",
              color: tab === "buy" ? "#fff" : "#0f172a",
              border: "1px solid #cbd5e1",
              padding: "10px 14px",
              borderRadius: "999px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Buy
          </button>
          <button
            onClick={() => setTab("rent")}
            style={{
              background: tab === "rent" ? "#0054a6" : "#fff",
              color: tab === "rent" ? "#fff" : "#0f172a",
              border: "1px solid #cbd5e1",
              padding: "10px 14px",
              borderRadius: "999px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Rent
          </button>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Enter Locality / Project / Landmark"
            style={{
              flex: 1,
              minWidth: "260px",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              outline: "none",
            }}
          />

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #cbd5e1", cursor: "pointer" }}
          >
            {["Srikakulam", "Visakhapatnam", "Hyderabad", "Bangalore", "Mumbai", "Delhi", "Chennai", "Pune"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ padding: "10px 12px", borderRadius: "10px", border: "1px solid #cbd5e1", cursor: "pointer" }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                Sort: {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category chips */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {CATEGORY_OPTIONS.map((opt) => {
            const active = category === opt.key;
            return (
              <button
                key={opt.key || "all"}
                onClick={() => setCategory(opt.key)}
                style={{
                  background: active ? "#0f172a" : "#fff",
                  color: active ? "#fff" : "#0f172a",
                  border: "1px solid #cbd5e1",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            );
          })}

          <label style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "6px", color: "#334155", fontWeight: 800 }}>
            <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
            Verified only
          </label>
        </div>
      </div>

      {/* Results header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "18px" }}>
        <div style={{ fontWeight: 900 }}>
          Recommended Properties <span style={{ color: "#64748b", fontWeight: 800 }}>({total})</span>
        </div>
        <div style={{ color: "#64748b", fontWeight: 800 }}>
          Page {page} / {pages}
        </div>
      </div>

      {loading && <div style={{ padding: "14px 0", fontWeight: 900, color: "#475569" }}>Loading…</div>}
      {error && <div style={{ padding: "14px 0", fontWeight: 900, color: "#b91c1c" }}>{error}</div>}

      {/* Visakhapatnam Curated Dashboard & Sections */}
      {city === "Visakhapatnam" ? (
        <div style={{ marginTop: "20px", display: "grid", gap: "24px" }}>
          
          {/* Demand in Visakhapatnam */}
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>Demand in Visakhapatnam</h3>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0" }}>Where are buyers searching in Visakhapatnam?</p>
            
            {/* Category tabs */}
            <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
              {[
                { key: "apartment", label: "Apartment" },
                { key: "plot", label: "Plots" },
                { key: "builder-floor", label: "Builder Floor" }
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setDemandTab(t.key)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    background: demandTab === t.key ? "#0054a6" : "transparent",
                    color: demandTab === t.key ? "#ffffff" : "#64748b",
                    fontWeight: "800",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* List of localities */}
            <div>
              <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "850", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                Most searched localities for {demandTab === "apartment" ? "Flat/Apartment" : demandTab === "plot" ? "Plots" : "Builder Floor"}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                {VIZAG_DEMAND[demandTab].map((loc, idx) => (
                  <div
                    key={loc.name}
                    onClick={() => { setQ(loc.name); setCategory(demandTab); }}
                    style={{
                      padding: "14px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "transform 0.2s, box-shadow 0.2s"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <span style={{ fontSize: "14px", fontWeight: "900", color: "#0054a6" }}>#{idx + 1}</span>
                      <span style={{ fontSize: "14px", fontWeight: "800", color: "#1e293b" }}>{loc.name}</span>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "900", color: "#0054a6", background: "#eff6ff", padding: "4px 10px", borderRadius: "999px" }}>
                      {loc.pct}% Searches
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => { setQ(""); setCategory(demandTab); }}
              style={{
                marginTop: "16px",
                background: "transparent",
                border: "none",
                color: "#0054a6",
                fontWeight: "900",
                cursor: "pointer",
                padding: "4px 0",
                fontSize: "13px"
              }}
            >
              View all 5 Localities &rarr;
            </button>
          </div>

          {/* Popular Builders in Visakhapatnam */}
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>Popular builders in Visakhapatnam</h3>
            
            <div style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              paddingBottom: "12px",
              scrollbarWidth: "thin"
            }}>
              {VIZAG_BUILDERS.map(b => (
                <div
                  key={b.name}
                  style={{
                    flex: "0 0 240px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        background: "#0054a6",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "900",
                        fontSize: "12px"
                      }}>
                        {b.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: "800", color: "#eab308", background: "#fef9c3", padding: "2px 6px", borderRadius: "4px" }}>
                        ★ {b.rating}
                      </span>
                    </div>
                    <div style={{ fontWeight: "800", color: "#1e293b", fontSize: "14px", marginBottom: "6px" }}>{b.name}</div>
                  </div>
                  <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "8px", marginTop: "8px", fontSize: "12px", color: "#64748b", fontWeight: "750" }}>
                    <div style={{ color: "#0f172a", marginBottom: "2px" }}>{b.total} Total Projects</div>
                    <div>{b.cityProj} in this city</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Gainers across Visakhapatnam */}
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>Top Gainers across Visakhapatnam</h3>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0" }}>with highest appreciation</p>
            
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b", fontWeight: "800" }}>
                    <th style={{ padding: "10px 8px" }}>Locality</th>
                    <th style={{ padding: "10px 8px" }}>Rate on 99acres</th>
                    <th style={{ padding: "10px 8px" }}>Price Trends</th>
                  </tr>
                </thead>
                <tbody>
                  {VIZAG_GAINERS.map((g) => (
                    <tr
                      key={g.name}
                      style={{
                        borderBottom: "1px solid #e2e8f0",
                        cursor: "pointer",
                        fontWeight: "800",
                        color: "#1e293b"
                      }}
                      onClick={() => setQ(g.name)}
                    >
                      <td style={{ padding: "12px 8px" }}>{g.name}</td>
                      <td style={{ padding: "12px 8px", color: "#475569" }}>
                        <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700" }}>Rate on 99acres</div>
                        <div>{g.rate}/ sqft</div>
                      </td>
                      <td style={{ padding: "12px 8px", color: "#10b981" }}>
                        <span style={{ marginRight: "4px" }}>▲</span>{g.trend}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 99acres-style city summary */}
          {stats?.categoryCounts?.length ? (
            <div style={{ marginTop: "10px", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "14px", background: "#ffffff" }}>
              <div style={{ fontWeight: 900, marginBottom: "10px" }}>
                Apartments, Villas and more in {city}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
                {stats.categoryCounts.slice(0, 6).map((c) => (
                  <button
                    key={c._id || "unknown"}
                    onClick={() => setCategory(c._id || "")}
                    style={{
                      textAlign: "left",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "12px",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 900, textTransform: "capitalize" }}>{String(c._id || "other").replace("-", " ")}</div>
                    <div style={{ color: "#64748b", fontWeight: 800, marginTop: "6px" }}>{c.count}+ Properties</div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* 99acres-style "Most searched localities" (inventory-share proxy) */}
          {(trends.apartment?.items?.length || trends.plot?.items?.length || trends["independent-house"]?.items?.length) ? (
            <div style={{ marginTop: "14px", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "14px", background: "#ffffff" }}>
              <div style={{ fontWeight: 900, marginBottom: "10px" }}>Demand in {city}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
                {[
                  { key: "apartment", title: "Apartment", subtitle: "Most searched localities for Flat/Apartment" },
                  { key: "plot", title: "Plots", subtitle: "Most searched societies for Plots" },
                  { key: "independent-house", title: "Independent House / Villa", subtitle: "Most searched localities for House/Villa" },
                ].map((box) => {
                  const data = trends[box.key];
                  if (!data?.items?.length) return null;
                  return (
                    <div key={box.key} style={{ border: "1px solid #e2e8f0", borderRadius: "14px", padding: "12px", background: "#f8fafc" }}>
                      <div style={{ fontWeight: 900 }}>{box.title}</div>
                      <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 800, marginTop: "4px" }}>{box.subtitle}</div>
                      <div style={{ display: "grid", gap: "8px", marginTop: "10px" }}>
                        {data.items.slice(0, 5).map((it, idx) => (
                          <button
                            key={it.locality}
                            onClick={() => { setQ(it.locality); setCategory(box.key); }}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              width: "100%",
                              textAlign: "left",
                              background: "#ffffff",
                              border: "1px solid #e2e8f0",
                              borderRadius: "12px",
                              padding: "10px",
                              cursor: "pointer",
                            }}
                          >
                            <div style={{ display: "flex", gap: "10px", alignItems: "baseline" }}>
                              <span style={{ fontWeight: 900, color: "#0f172a" }}>#{idx + 1}</span>
                              <span style={{ fontWeight: 900 }}>{it.locality}</span>
                            </div>
                            <span style={{ fontWeight: 900, color: "#0054a6" }}>{it.percent}%</span>
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => { setCategory(box.key); }}
                        style={{
                          marginTop: "10px",
                          background: "transparent",
                          border: "none",
                          color: "#0054a6",
                          fontWeight: 900,
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        View all localities
                      </button>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: "10px", fontSize: "12px", color: "#64748b", fontWeight: 700 }}>
                Note: “Most searched” is a realistic demo based on inventory share (not real user search logs yet).
              </div>
            </div>
          ) : null}
        </>
      )}

      {/* Grid */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.03 } },
        }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px",
          marginTop: "14px",
        }}
      >
        {items.map((p) => (
          <motion.div key={p._id || p.id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
            <PropertyCard property={p} />
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "22px 0 10px" }}>
        <button
          onClick={() => setPage((v) => Math.max(1, v - 1))}
          disabled={page <= 1}
          style={{
            background: "#fff",
            border: "1px solid #cbd5e1",
            padding: "10px 12px",
            borderRadius: "10px",
            fontWeight: 900,
            cursor: page <= 1 ? "not-allowed" : "pointer",
            opacity: page <= 1 ? 0.5 : 1,
          }}
        >
          Prev
        </button>
        <button
          onClick={() => setPage((v) => Math.min(pages, v + 1))}
          disabled={page >= pages}
          style={{
            background: "#0054a6",
            color: "#fff",
            border: "1px solid #0054a6",
            padding: "10px 12px",
            borderRadius: "10px",
            fontWeight: 900,
            cursor: page >= pages ? "not-allowed" : "pointer",
            opacity: page >= pages ? 0.5 : 1,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
