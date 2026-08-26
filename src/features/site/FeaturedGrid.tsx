import { MenuItemCard } from "./MenuItemCard";
import { FEATURED_MENU_ITEMS } from "./menuData";
import { useFeaturedGridColumns } from "./useFeaturedGridColumns";

export function FeaturedGrid() {
  const columns = useFeaturedGridColumns();

  return (
    <div
      data-testid="featured-grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 24,
      }}
    >
      {FEATURED_MENU_ITEMS.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
