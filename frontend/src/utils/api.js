import { MOCK_PROPERTIES, MOCK_STATS } from "./mockData.js";

const DEFAULT_API_URL = "http://localhost:5000";
const DEFAULT_API_URL_ALT = "http://127.0.0.1:5000";

// In dev, prefer Vite proxy (relative /api) to avoid CORS/network issues.
export const API_URL = import.meta?.env?.DEV
  ? ""
  : import.meta?.env?.VITE_API_URL || DEFAULT_API_URL;

async function doGet(url) {
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

async function doJson(method, url, body, token) {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

// Intercept connection failure and serve mock data
function handleMockFallback(path) {
  console.warn(`Falling back to Mock Data for API path: ${path}`);

  // 1. Single property by ID: /api/properties/:id
  const singleMatch = path.match(/^\/api\/properties\/([a-zA-Z0-9_-]+)$/);
  if (singleMatch && !path.includes("stats") && !path.includes("locality-trends")) {
    const id = singleMatch[1];
    const found = MOCK_PROPERTIES.find(p => p._id === id || p.id === id);
    return found || { message: "Not found" };
  }

  // 2. Locality Trends: /api/properties/locality-trends
  if (path.includes("/api/properties/locality-trends")) {
    const urlObj = new URL(path, "http://local.mock");
    const city = urlObj.searchParams.get("city") || "Visakhapatnam";
    const category = urlObj.searchParams.get("category") || "";

    const lCity = city.toLowerCase();

    // Locality Trends database for mock mode
    let items = [];

    if (lCity === "visakhapatnam" || lCity === "vizag") {
      if (category === "apartment") {
        items = [
          { locality: "Madhurawada", count: 9, percent: 9 },
          { locality: "Yendada", count: 4, percent: 4 },
          { locality: "Seethammadhara", count: 3, percent: 3 },
          { locality: "MVP Colony", count: 3, percent: 3 },
          { locality: "Pendurthi", count: 3, percent: 3 }
        ];
      } else if (category === "plot") {
        items = [
          { locality: "Madhurawada", count: 8, percent: 8 },
          { locality: "Bhogapuram", count: 6, percent: 6 },
          { locality: "Anandapuram", count: 4, percent: 4 },
          { locality: "Pendurthi", count: 4, percent: 4 },
          { locality: "Bheemili", count: 3, percent: 3 }
        ];
      } else {
        items = [
          { locality: "Madhurawada", count: 11, percent: 11 },
          { locality: "Pendurthi", count: 5, percent: 5 },
          { locality: "Gajuwaka", count: 5, percent: 5 },
          { locality: "Bhogapuram", count: 3, percent: 3 },
          { locality: "Seethammadhara", count: 3, percent: 3 }
        ];
      }
    } else if (lCity === "hyderabad") {
      if (category === "apartment") {
        items = [
          { locality: "Nagole", count: 15, percent: 15 },
          { locality: "Uppal", count: 12, percent: 12 },
          { locality: "Miyapur", count: 10, percent: 10 },
          { locality: "Gachibowli", count: 8, percent: 8 },
          { locality: "Kondapur", count: 6, percent: 6 }
        ];
      } else if (category === "plot") {
        items = [
          { locality: "Dammaiguda", count: 18, percent: 18 },
          { locality: "Rampally", count: 15, percent: 15 },
          { locality: "ECIL", count: 12, percent: 12 },
          { locality: "Nagole", count: 8, percent: 8 }
        ];
      } else {
        items = [
          { locality: "Uppal", count: 10, percent: 10 },
          { locality: "Miyapur", count: 8, percent: 8 },
          { locality: "Nagole", count: 6, percent: 6 }
        ];
      }
    } else if (lCity === "srikakulam") {
      if (category === "apartment") {
        items = [
          { locality: "Balaga", count: 8, percent: 20 },
          { locality: "Arasavilli", count: 4, percent: 10 }
        ];
      } else if (category === "plot") {
        items = [
          { locality: "Etcherla", count: 15, percent: 35 },
          { locality: "Ragolu", count: 8, percent: 18 }
        ];
      } else {
        items = [
          { locality: "Balaga", count: 5, percent: 15 },
          { locality: "Arasavilli", count: 3, percent: 9 }
        ];
      }
    } else if (lCity === "bangalore") {
      if (category === "apartment") {
        items = [
          { locality: "Whitefield", count: 22, percent: 22 },
          { locality: "HSR Layout", count: 18, percent: 18 },
          { locality: "Electronic City", count: 14, percent: 14 }
        ];
      } else {
        items = [
          { locality: "Whitefield", count: 12, percent: 15 },
          { locality: "HSR Layout", count: 10, percent: 12 }
        ];
      }
    } else if (lCity === "chennai") {
      if (category === "apartment") {
        items = [
          { locality: "OMR", count: 16, percent: 20 },
          { locality: "Velachery", count: 12, percent: 15 },
          { locality: "Anna Nagar", count: 8, percent: 10 }
        ];
      } else {
        items = [
          { locality: "Tambaram", count: 10, percent: 22 },
          { locality: "OMR", count: 6, percent: 14 }
        ];
      }
    } else {
      // Fallback details for Delhi, Mumbai, Pune
      items = [
        { locality: "Main Center", count: 12, percent: 25 },
        { locality: "Suburbs", count: 8, percent: 18 }
      ];
    }

    return { city, category: category || "all", total: 100, items };
  }

  // 3. Stats: /api/properties/stats
  if (path.includes("/api/properties/stats")) {
    const urlObj = new URL(path, "http://local.mock");
    let city = urlObj.searchParams.get("city") || "Visakhapatnam";
    if (city.toLowerCase() === "vizag") city = "Visakhapatnam";
    return MOCK_STATS[city] || MOCK_STATS.Visakhapatnam;
  }

  // 4. Properties Search/Listing: /api/properties
  if (path.includes("/api/properties")) {
    const urlObj = new URL(path, "http://local.mock");
    const cityQuery = urlObj.searchParams.get("city");
    const categoryQuery = urlObj.searchParams.get("category");
    const listingTypeQuery = urlObj.searchParams.get("listingType");
    const qQuery = urlObj.searchParams.get("q") || "";
    const verifiedQuery = urlObj.searchParams.get("verified");
    const sortQuery = urlObj.searchParams.get("sort") || "featured";

    let list = [...MOCK_PROPERTIES];

    if (cityQuery) {
      const cq = cityQuery.toLowerCase();
      list = list.filter(p => p.city.toLowerCase() === cq || (cq === "vizag" && p.city.toLowerCase() === "visakhapatnam"));
    }
    if (categoryQuery) {
      list = list.filter(p => p.category === categoryQuery);
    }
    if (listingTypeQuery) {
      list = list.filter(p => p.listingType === listingTypeQuery);
    }
    if (qQuery) {
      const rx = qQuery.toLowerCase().trim();
      if (rx === "vizag") {
        list = list.filter(p => p.city.toLowerCase() === "visakhapatnam");
      } else {
        list = list.filter(p =>
          p.title.toLowerCase().includes(rx) ||
          p.location.toLowerCase().includes(rx) ||
          p.city.toLowerCase().includes(rx) ||
          p.locality.toLowerCase().includes(rx)
        );
      }
    }
    if (verifiedQuery === "true") {
      list = list.filter(p => p.verified === true);
    }

    // Sort
    if (sortQuery === "priceLow") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortQuery === "priceHigh") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortQuery === "areaHigh") {
      list.sort((a, b) => b.areaSqft - a.areaSqft);
    } else {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return {
      items: list,
      total: list.length,
      page: 1,
      pages: 1,
      limit: 24
    };
  }

  return [];
}

export async function apiGet(path) {
  const primaryUrl = `${API_URL}${path}`; // usually "/api/..." in dev
  try {
    return await doGet(primaryUrl);
  } catch (e) {
    const err1 = e;
    // If proxy/relative request fails for any reason, try direct backend.
    const fallbackUrl = `${DEFAULT_API_URL}${path}`;
    try {
      if (primaryUrl !== fallbackUrl) return await doGet(fallbackUrl);
    } catch (e2) {
      const fallbackUrlAlt = `${DEFAULT_API_URL_ALT}${path}`;
      try {
        if (primaryUrl !== fallbackUrlAlt) return await doGet(fallbackUrlAlt);
      } catch (e3) {
        // All backend attempts failed. Use mock data fallback!
        try {
          return handleMockFallback(path);
        } catch (eMock) {
          throw new Error(
            `Failed to reach API. Tried: ${primaryUrl}, ${fallbackUrl}, ${fallbackUrlAlt}. ` +
            `Errors: ${err1?.message || err1}; ${e2?.message || e2}; ${e3?.message || e3}`
          );
        }
      }
    }
    throw err1;
  }
}

export async function apiPost(path, body, token) {
  const primaryUrl = `${API_URL}${path}`;
  try {
    return await doJson("POST", primaryUrl, body, token);
  } catch (e) {
    const err1 = e;
    const fallbackUrl = `${DEFAULT_API_URL}${path}`;
    try {
      if (primaryUrl !== fallbackUrl) return await doJson("POST", fallbackUrl, body, token);
    } catch (e2) {
      const fallbackUrlAlt = `${DEFAULT_API_URL_ALT}${path}`;
      try {
        if (primaryUrl !== fallbackUrlAlt) return await doJson("POST", fallbackUrlAlt, body, token);
      } catch (e3) {
        // Fallback for post operations (e.g. leads)
        console.warn(`Post failed to reach server. Mocking success response.`);
        return { message: "Saved successfully (offline mock mode)", id: "mock-id-" + Math.random() };
      }
    }
    throw err1;
  }
}


