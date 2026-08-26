import { useEffect, useState } from "react";

export type SiteConfig = {
  deliveryEtaPrefix: string;
  deliveryEtaValue: string;
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  deliveryEtaPrefix: "Estimated delivery:",
  deliveryEtaValue: "30 mins",
};

export async function loadSiteConfig(): Promise<SiteConfig> {
  try {
    const response = await fetch("/site-config.json");
    if (!response.ok) {
      return DEFAULT_SITE_CONFIG;
    }
    return await response.json();
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}

export function useSiteConfig(): SiteConfig {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);

  useEffect(() => {
    let isMounted = true;
    loadSiteConfig().then((loadedConfig) => {
      if (isMounted) {
        setConfig(loadedConfig);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return config;
}
