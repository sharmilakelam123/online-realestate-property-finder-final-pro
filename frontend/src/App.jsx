import React from "react";
import AdminDashboard from "./pages/AdminDashboard";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import AddProperty from "./pages/AddProperty";
import PropertyDetails from "./pages/PropertyDetails";
import PropertyPhotos from "./pages/PropertyPhotos";
import PropertyOwner from "./pages/PropertyOwner";
import PropertyPreview from "./pages/PropertyPreview";
import Login from "./pages/Login";
import PropertyView from "./pages/PropertyView";
import ContactOwner from "./pages/ContactOwner";
import MyProperties from "./pages/MyProperties";

import VisitHistory from "./components/booking/VisitHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/search-results"
          element={<SearchResults />}
        />

        <Route
          path="/buy"
          element={<SearchResults defaultPurpose="Buy" />}
        />

        <Route
          path="/rent"
          element={<SearchResults defaultPurpose="Rent" />}
        />

        <Route
          path="/sell"
          element={<SearchResults defaultPurpose="Sell" />}
        />

        <Route
          path="/new-projects"
          element={
            <SearchResults defaultPurpose="New Projects" />
          }
        />

        <Route
          path="/commercial"
          element={
            <SearchResults defaultPurpose="Commercial" />
          }
        />

        <Route
          path="/plots-land"
          element={
            <SearchResults defaultPurpose="Plots & Land" />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/property/:id"
          element={<PropertyView />}
        />

        <Route
          path="/my-properties"
          element={<MyProperties />}
        />

        {/* VISIT HISTORY */}
        <Route
          path="/visit-history"
          element={<VisitHistory />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        {/* CONTACT OWNER */}
        <Route
          path="/contact-owner/:id"
          element={<ContactOwner />}
        />

        {/* ADD PROPERTY */}
        <Route
          path="/add-property"
          element={<AddProperty />}
        />

        <Route
          path="/add-property/details"
          element={<PropertyDetails />}
        />

        <Route
          path="/add-property/photos"
          element={<PropertyPhotos />}
        />

        <Route
          path="/add-property/owner"
          element={<PropertyOwner />}
        />

        <Route
          path="/add-property/preview"
          element={<PropertyPreview />}
        />

        {/* UNKNOWN ROUTES */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;