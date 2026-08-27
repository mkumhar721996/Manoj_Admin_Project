import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SiteFooter } from "./SiteFooter";

const DEFAULT_INNER_WIDTH = window.innerWidth;

describe("SiteFooter", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    act(() => {
      window.innerWidth = DEFAULT_INNER_WIDTH;
      window.dispatchEvent(new Event("resize"));
    });
  });

  it("shows kitchen hours, pizzeria location, contact information, and social links", () => {
    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /kitchen hours/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /pizzeria location/i }),
    ).toBeInTheDocument();

    expect(screen.getByText("Monday - Thursday")).toBeInTheDocument();
    expect(screen.getByText("12:00 PM - 10:00 PM")).toBeInTheDocument();
    expect(screen.getByText("Friday - Saturday")).toBeInTheDocument();
    expect(screen.getByText("12:00 PM - 11:30 PM")).toBeInTheDocument();
    expect(screen.getByText("Sunday")).toBeInTheDocument();
    expect(screen.getByText("1:00 PM - 9:30 PM")).toBeInTheDocument();

    expect(
      screen.getByText(/842 Rione Monti, Sourdough Avenue, Suite 100/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/\(555\) 392-7677/)).toBeInTheDocument();
    expect(screen.getByText(/ciao@fornorosso\.pizza/)).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Instagram" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Facebook" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Twitter" })).toBeInTheDocument();
  });

  it("reads the social link hrefs from the site config, not a hardcoded value", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            deliveryEtaPrefix: "Estimated delivery:",
            deliveryEtaValue: "30 mins",
            footerDescription: "desc",
            kitchenHours: [{ day: "Everyday", hours: "24 hours" }],
            pizzeriaAddress: "1 Test Way",
            deliveryPhone: "555",
            contactEmail: "test@example.test",
            socialLinks: {
              instagram: "https://instagram.test/fornorosso",
              facebook: "https://facebook.test/fornorosso",
              twitter: "https://twitter.test/fornorosso",
            },
          }),
      }),
    );

    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>,
    );

    const instagramLink = await screen.findByRole("link", {
      name: "Instagram",
    });
    expect(instagramLink).toHaveAttribute(
      "href",
      "https://instagram.test/fornorosso",
    );
    expect(
      screen.getByRole("link", { name: "Facebook" }),
    ).toHaveAttribute("href", "https://facebook.test/fornorosso");
    expect(screen.getByRole("link", { name: "Twitter" })).toHaveAttribute(
      "href",
      "https://twitter.test/fornorosso",
    );
  });

  it("navigates to the corresponding static page when a legal link is clicked destination is set", () => {
    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: "Privacy Policy" }),
    ).toHaveAttribute("href", "/privacy-policy");
    expect(
      screen.getByRole("link", { name: "Delivery Terms" }),
    ).toHaveAttribute("href", "/delivery-terms");
  });

  it("uses full 80px side padding and a row layout for the business-info columns at a 1280px desktop viewport", () => {
    window.innerWidth = 1280;
    window.dispatchEvent(new Event("resize"));

    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("site-footer")).toHaveStyle({
      paddingLeft: "80px",
      paddingRight: "80px",
    });
    expect(screen.getByTestId("footer-cols")).toHaveStyle({
      flexDirection: "row",
    });

    expect(
      screen.getByRole("heading", { name: /kitchen hours/i }),
    ).toBeInTheDocument();
  });

  it("reduces side padding and stacks the business-info columns at a 375px mobile viewport, without hiding content", () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event("resize"));

    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("site-footer")).toHaveStyle({
      paddingLeft: "20px",
      paddingRight: "20px",
    });
    expect(screen.getByTestId("footer-cols")).toHaveStyle({
      flexDirection: "column",
    });

    expect(
      screen.getByRole("heading", { name: /kitchen hours/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /pizzeria location/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/842 Rione Monti, Sourdough Avenue, Suite 100/i),
    ).toBeInTheDocument();
  });
});
