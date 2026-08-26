import { Link } from "react-router-dom";
import type { FeaturedMenuItem } from "./menuData";
import { PlusIcon } from "./PlusIcon";

type MenuItemCardProps = {
  item: FeaturedMenuItem;
};

export function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      <img
        src={item.imageSrc}
        alt={item.imageAlt}
        style={{
          width: "100%",
          aspectRatio: "302 / 220",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: 20,
          flexGrow: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <h3
            style={{
              fontFamily: "Fraunces, serif",
              fontWeight: 600,
              fontSize: 18,
              lineHeight: "22.19px",
              color: "#151212",
              margin: 0,
            }}
          >
            {item.name}
          </h3>
          <span
            style={{
              fontFamily: "Fraunces, serif",
              fontWeight: 700,
              fontSize: 18,
              lineHeight: "22.19px",
              color: "#C82D25",
              whiteSpace: "nowrap",
            }}
          >
            {item.price}
          </span>
        </div>
        <p
          style={{
            fontFamily: "Geist, sans-serif",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "19.6px",
            color: "#6B6661",
            margin: 0,
            flexGrow: 1,
          }}
        >
          {item.description}
        </p>
        <Link
          to="/menu"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 8,
            padding: "12px 20px",
            borderRadius: 100,
            backgroundColor: "#151212",
            color: "#FFFFFF",
            fontFamily: "Geist, sans-serif",
            fontWeight: 600,
            fontSize: 15,
            lineHeight: "19.5px",
            textDecoration: "none",
          }}
        >
          <PlusIcon />
          Add to Order
        </Link>
      </div>
    </article>
  );
}
