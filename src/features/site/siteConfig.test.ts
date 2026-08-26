import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_SITE_CONFIG, loadSiteConfig } from "./siteConfig";

describe("DEFAULT_SITE_CONFIG", () => {
  it("includes the footer's kitchen hours, address, contact, and social link fields", () => {
    expect(DEFAULT_SITE_CONFIG.kitchenHours).toEqual([
      { day: "Monday - Thursday", hours: "12:00 PM - 10:00 PM" },
      { day: "Friday - Saturday", hours: "12:00 PM - 11:30 PM" },
      { day: "Sunday", hours: "1:00 PM - 9:30 PM" },
    ]);
    expect(DEFAULT_SITE_CONFIG.pizzeriaAddress).toBe(
      "842 Rione Monti, Sourdough Avenue, Suite 100",
    );
    expect(DEFAULT_SITE_CONFIG.deliveryPhone).toBe("(555) 392-7677");
    expect(DEFAULT_SITE_CONFIG.contactEmail).toBe("ciao@fornorosso.pizza");
    expect(DEFAULT_SITE_CONFIG.socialLinks).toEqual({
      instagram: "#",
      facebook: "#",
      twitter: "#",
    });
  });
});

describe("loadSiteConfig", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolves to the fetched site-config.json payload when the request succeeds", async () => {
    const customConfig = {
      deliveryEtaPrefix: "Ready for pickup in:",
      deliveryEtaValue: "45 mins",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(customConfig),
      }),
    );

    const config = await loadSiteConfig();

    expect(config).toEqual(customConfig);
  });

  it("falls back to the default config when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));

    const config = await loadSiteConfig();

    expect(config).toEqual(DEFAULT_SITE_CONFIG);
  });

  it("falls back to the default config when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({}),
      }),
    );

    const config = await loadSiteConfig();

    expect(config).toEqual(DEFAULT_SITE_CONFIG);
  });
});
