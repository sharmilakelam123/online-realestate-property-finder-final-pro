import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PropertyListing from "../pages/PropertyListing";
import PropertyDetails from "../pages/PropertyDetails";
import AddProperty from "../pages/AddProperty";
import Favorites from "../pages/Favorites";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/properties" element={<PropertyListing />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
      <Route path="/add-property" element={<AddProperty />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;