const KEYS = {
  recentSearches: "recentSearches",
  recentlyViewed: "recentlyViewed",
  contactedLeads: "contactedLeads",
};

function safeParse(json) {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function saveRecentlySearched(query) {
  const q = String(query || "").trim();
  if (!q) return;
  const cur = safeParse(localStorage.getItem(KEYS.recentSearches));
  const next = [q, ...cur.filter((x) => String(x).toLowerCase() !== q.toLowerCase())].slice(0, 10);
  localStorage.setItem(KEYS.recentSearches, JSON.stringify(next));
}

export function getRecentlySearched() {
  return safeParse(localStorage.getItem(KEYS.recentSearches));
}

export function saveRecentlyViewed(propertyId) {
  const id = String(propertyId || "");
  if (!id) return;
  const cur = safeParse(localStorage.getItem(KEYS.recentlyViewed));
  const next = [id, ...cur.filter((x) => String(x) !== id)].slice(0, 12);
  localStorage.setItem(KEYS.recentlyViewed, JSON.stringify(next));
}

export function getRecentlyViewed() {
  return safeParse(localStorage.getItem(KEYS.recentlyViewed));
}

export function saveContactedLead(lead) {
  if (!lead?._id) return;
  const cur = safeParse(localStorage.getItem(KEYS.contactedLeads));
  const cleaned = cur.filter((x) => x?._id && x._id !== lead._id);
  const next = [lead, ...cleaned].slice(0, 20);
  localStorage.setItem(KEYS.contactedLeads, JSON.stringify(next));
}

export function getContactedLeads() {
  const raw = localStorage.getItem(KEYS.contactedLeads);
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

