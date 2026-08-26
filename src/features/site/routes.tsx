import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../auth/LoginPage";
import { RegisterPage } from "../auth/RegisterPage";
import { DeliveryTermsPage } from "./DeliveryTermsPage";
import { HomePage } from "./HomePage";
import { Layout } from "./Layout";
import { OurMenuPage } from "./OurMenuPage";
import { PrivacyPolicyPage } from "./PrivacyPolicyPage";

export function SiteRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<OurMenuPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/delivery-terms" element={<DeliveryTermsPage />} />
      </Route>
    </Routes>
  );
}
