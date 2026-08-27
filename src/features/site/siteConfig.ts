import { useEffect, useState } from "react";

export type FooterScheduleEntry = {
  day: string;
  hours: string;
};

export type SiteConfig = {
  deliveryEtaPrefix: string;
  deliveryEtaValue: string;
  footerDescription: string;
  kitchenHours: FooterScheduleEntry[];
  pizzeriaAddress: string;
  deliveryPhone: string;
  contactEmail: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  deliveryEtaPrefix: "Estimated delivery:",
  deliveryEtaValue: "30 mins",
  footerDescription:
    "Artisanal wood-fired sourdough pizzas crafted with 48-hour fermented dough and imported San Marzano ingredients. Delivered fresh and piping hot.",
  kitchenHours: [
    { day: "Monday - Thursday", hours: "12:00 PM - 10:00 PM" },
    { day: "Friday - Saturday", hours: "12:00 PM - 11:30 PM" },
    { day: "Sunday", hours: "1:00 PM - 9:30 PM" },
  ],
  pizzeriaAddress: "842 Rione Monti, Sourdough Avenue, Suite 100",
  deliveryPhone: "(555) 392-7677",
  contactEmail: "ciao@fornorosso.pizza",
  socialLinks: {
    instagram: "#",
    facebook: "#",
    twitter: "#",
  },
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
