import type { MenuCatalogItem } from "./menuCatalog";

export type MenuCategoryGroup = {
  category: string;
  items: MenuCatalogItem[];
};

export function groupMenuItemsByCategory(
  items: MenuCatalogItem[],
): MenuCategoryGroup[] {
  const groups: MenuCategoryGroup[] = [];
  const groupsByCategory = new Map<string, MenuCategoryGroup>();

  for (const item of items) {
    let group = groupsByCategory.get(item.category);
    if (!group) {
      group = { category: item.category, items: [] };
      groupsByCategory.set(item.category, group);
      groups.push(group);
    }
    group.items.push(item);
  }

  return groups;
}
