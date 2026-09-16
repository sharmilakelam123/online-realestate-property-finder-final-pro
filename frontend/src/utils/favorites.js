// Favorites Utility Helper Functions
export const getFavorites = () => {
  try {
    const favs = localStorage.getItem('favorites');
    return favs ? JSON.parse(favs) : [];
  } catch (error) {
    return [];
  }
};

export const addFavorite = (id) => {
  try {
    const favs = getFavorites();
    if (!favs.includes(id)) {
      favs.push(id);
      localStorage.setItem('favorites', JSON.stringify(favs));
    }
  } catch (error) {
    console.error(error);
  }
};

export const removeFavorite = (id) => {
  try {
    const favs = getFavorites();
    const updated = favs.filter(favId => favId !== id);
    localStorage.setItem('favorites', JSON.stringify(updated));
  } catch (error) {
    console.error(error);
  }
};
