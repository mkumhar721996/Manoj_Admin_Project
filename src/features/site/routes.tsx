import { Route, Routes } from "react-router-dom";
import { HomePage } from "./HomePage";
import { Layout } from "./Layout";
import { OurMenuPage } from "./OurMenuPage";

export function SiteRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<OurMenuPage />} />
      </Route>
    </Routes>
  );
}
