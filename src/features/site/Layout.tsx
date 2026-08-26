import { Outlet } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";

export function Layout() {
  return (
    <>
      <SiteHeader />
      <Outlet />
    </>
  );
}
