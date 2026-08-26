import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_SITE_CONFIG, loadSiteConfig } from "./siteConfig";

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
