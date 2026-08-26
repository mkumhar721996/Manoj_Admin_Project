import { NavLink as RouterNavLink } from "react-router-dom";

type NavLinkProps = {
  to: string;
  label: string;
  end?: boolean;
};

export function NavLink({ to, label, end }: NavLinkProps) {
  return (
    <RouterNavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        textDecoration: "none",
        fontFamily: "Geist, sans-serif",
        fontSize: 15,
        fontWeight: isActive ? 600 : 500,
        color: isActive ? "#C82D25" : "#FFFFFF",
      })}
    >
      {({ isActive }) => (
        <>
          <span>{label}</span>
          {isActive && (
            <span
              style={{
                width: 12,
                height: 2,
                borderRadius: 1,
                backgroundColor: "#C82D25",
              }}
            />
          )}
        </>
      )}
    </RouterNavLink>
  );
}
