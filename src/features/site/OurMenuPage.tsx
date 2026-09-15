import { groupMenuItemsByCategory } from "./groupMenuItemsByCategory";
import { MenuItemCard } from "./MenuItemCard";
import { useMenuCatalog } from "./menuCatalog";

export function OurMenuPage() {
  const catalog = useMenuCatalog();
  const groups = groupMenuItemsByCategory(catalog);

  return (
    <main data-testid="our-menu-page">
      <h1>Our Menu</h1>
      {groups.map((group) => (
        <section key={group.category}>
          <h2>{group.category}</h2>
          <div data-testid="menu-grid">
            {group.items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
