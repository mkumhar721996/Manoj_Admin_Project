import { Link } from "react-router-dom";
import { useCartItemCount } from "../cart/cartStore";
import { CartIcon } from "./CartIcon";

export function CartButton() {
  const count = useCartItemCount();

  return (
    <Link
      to="/cart"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: "#2A2626",
        color: "#FFFFFF",
        flexShrink: 0,
      }}
    >
      <CartIcon />
      <span
        data-testid="cart-badge"
        style={{
          position: "absolute",
          top: -4,
          right: -4,
          minWidth: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: "#C82D25",
          color: "#FFFFFF",
          fontFamily: "Geist, sans-serif",
          fontSize: 11,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 4px",
        }}
      >
        {count}
      </span>
    </Link>
  );
}
