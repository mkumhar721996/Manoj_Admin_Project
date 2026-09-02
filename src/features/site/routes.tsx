import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../auth/LoginPage";
import { OtpLoginPage } from "../auth/OtpLoginPage";
import { OtpRegisterPage } from "../auth/OtpRegisterPage";
import { RegisterPage } from "../auth/RegisterPage";
import { HomePage } from "./HomePage";
import { Layout } from "./Layout";
import { OurMenuPage } from "./OurMenuPage";

export function SiteRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<OurMenuPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/otp" element={<OtpRegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/otp" element={<OtpLoginPage />} />
      </Route>
    </Routes>
  );
}
