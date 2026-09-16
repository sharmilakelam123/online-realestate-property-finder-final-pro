import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveRecentlySearched } from "../../utils/activity";

function SearchBar() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [budget, setBudget] = useState("all");

  const navigate = useNavigate();

  const handleSearch = () => {
    saveRecentlySearched(search);

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (type !== "all") {
      params.set("type", type);
    }

    if (budget !== "all") {
      params.set("budget", budget);
    }

    navigate(`/search-results?${params.toString()}`);
  };

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "12px",
        borderRadius: "12px",
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr auto",
        gap: "10px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      {/* LOCATION / SEARCH */}
      <input
        type="text"
        placeholder="Search city or property..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        style={{
          padding: "13px",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          outline: "none",
          color: "#0f172a",
          fontSize: "14px",
        }}
      />

      {/* PROPERTY TYPE */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{
          padding: "13px",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          color: "#334155",
          background: "#ffffff",
          outline: "none",
        }}
      >
        <option value="all">All Properties</option>
        <option value="Apartment">Apartment</option>
        <option value="Villa">Villa</option>
        <option value="Independent House">
          Independent House
        </option>
        <option value="Plot">Plot</option>
        <option value="Office">Office</option>
        <option value="Shop">Shop</option>
      </select>

      {/* BUDGET */}
      <select
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        style={{
          padding: "13px",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          color: "#334155",
          background: "#ffffff",
          outline: "none",
        }}
      >
        <option value="all">Any Budget</option>
        <option value="under50">Under ₹50 L</option>
        <option value="50to100">₹50 L - ₹1 Cr</option>
        <option value="100to200">₹1 Cr - ₹2 Cr</option>
        <option value="above200">Above ₹2 Cr</option>
      </select>

      {/* SEARCH BUTTON */}
      <button
        onClick={handleSearch}
        style={{
          background: "#2563eb",
          color: "#ffffff",
          border: "none",
          padding: "0 24px",
          borderRadius: "8px",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        🔍 Search
      </button>
    </div>
  );
}

export default SearchBar;