import { configureStore, createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");

// Authentication Slice
const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null,
    isAuthenticated: !!savedToken,
    loading: false,
    error: null,
  },

  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

// Property Database Slice
const propertySlice = createSlice({
  name: "properties",

  initialState: {
    items: [],
    favorites: [],
    loading: false,
    error: null,

    filters: {
      type: "all",
      bhk: "",
      maxPrice: 50000000,
      search: "",
    },
  },

  reducers: {
    setProperties: (state, action) => {
      state.items = action.payload;
    },

    toggleFavorite: (state, action) => {
      const id = String(action.payload);

      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter(
          (favId) => favId !== id
        );
      } else {
        state.favorites.push(id);
      }
    },

    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    resetFilters: (state) => {
      state.filters = {
        type: "all",
        bhk: "",
        maxPrice: 50000000,
        search: "",
      };
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} = authSlice.actions;

export const {
  setProperties,
  toggleFavorite,
  updateFilters,
  resetFilters,
} = propertySlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    properties: propertySlice.reducer,
  },
});