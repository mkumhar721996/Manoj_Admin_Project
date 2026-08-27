import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../auth/LoginPage";
import { RegisterPage } from "../auth/RegisterPage";
import { CartPage } from "./CartPage";
import { HomePage } from "./HomePage";
import { Layout } from "./Layout";
import { OurMenuPage } from "./OurMenuPage";

export function SiteRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<OurMenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}
