import { NavLink } from "./NavLink";

export function PrimaryNav() {
  return (
    <nav
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
      }}
    >
      <NavLink to="/" label="Home" end />
      <NavLink to="/menu" label="Our Menu" />
      <NavLink to="/cart" label="Cart" />
    </nav>
  );
}
