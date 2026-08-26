import { BrowserRouter } from "react-router-dom";
import { SiteRoutes } from "./features/site/routes";

export function App() {
  return (
    <BrowserRouter>
      <SiteRoutes />
    </BrowserRouter>
  );
}
