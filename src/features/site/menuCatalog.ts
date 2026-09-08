import { useEffect, useState } from "react";

export type MenuCatalogItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
};

export const DEFAULT_MENU_CATALOG: MenuCatalogItem[] = [];

export async function loadMenuCatalog(): Promise<MenuCatalogItem[]> {
  try {
    const response = await fetch("/menu-catalog.json");
    if (!response.ok) {
      return DEFAULT_MENU_CATALOG;
    }
    return await response.json();
  } catch {
    return DEFAULT_MENU_CATALOG;
  }
}

export function useMenuCatalog(): MenuCatalogItem[] {
  const [catalog, setCatalog] = useState<MenuCatalogItem[]>(DEFAULT_MENU_CATALOG);

  useEffect(() => {
    let isMounted = true;
    loadMenuCatalog().then((loadedCatalog) => {
      if (isMounted) {
        setCatalog(loadedCatalog);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return catalog;
}
