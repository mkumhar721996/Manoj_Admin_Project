import { Outlet } from "react-router-dom";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function Layout() {
  return (
    <div
      data-testid="page-shell"
      style={{ backgroundColor: "#FCFAF6", minHeight: "100vh" }}
    >
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </div>
  );
}
