import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SiteFooter } from "./SiteFooter";

const DEFAULT_INNER_WIDTH = window.innerWidth;

describe("SiteFooter", () => {
  afterEach(() => {
    act(() => {
      window.innerWidth = DEFAULT_INNER_WIDTH;
      window.dispatchEvent(new Event("resize"));
    });
  });

  it("renders as a footer landmark with a dark near-black background", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("contentinfo")).toHaveStyle({
      backgroundColor: "#151212",
    });
  });

  it("shows the kitchen hours", () => {
    render(<SiteFooter />);

    expect(
      screen.getByRole("heading", { name: "Kitchen Hours" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Monday - Thursday")).toBeInTheDocument();
    expect(screen.getByText("12:00 PM - 10:00 PM")).toBeInTheDocument();
    expect(screen.getByText("Friday - Saturday")).toBeInTheDocument();
    expect(screen.getByText("12:00 PM - 11:30 PM")).toBeInTheDocument();
    expect(screen.getByText("Sunday")).toBeInTheDocument();
    expect(screen.getByText("1:00 PM - 9:30 PM")).toBeInTheDocument();
  });

  it("shows the pizzeria location and contact information", () => {
    render(<SiteFooter />);

    expect(
      screen.getByRole("heading", { name: "Pizzeria Location" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("120 Fireside Lane, Portland, OR 97201"),
    ).toBeInTheDocument();
    expect(screen.getByText("(503) 555-0119")).toBeInTheDocument();
    expect(screen.getByText("hello@fornorosso.com")).toBeInTheDocument();
  });

  it("contains no interactive elements", () => {
    render(<SiteFooter />);

    const footer = screen.getByRole("contentinfo");
    expect(
      footer.querySelectorAll("a, button, input, select, textarea"),
    ).toHaveLength(0);
  });

  it("uses Fraunces for headings and Geist for body text", () => {
    render(<SiteFooter />);

    expect(
      screen.getByRole("heading", { name: "Kitchen Hours" }),
    ).toHaveStyle({ fontFamily: "Fraunces, serif" });
    expect(
      screen.getByRole("heading", { name: "Pizzeria Location" }),
    ).toHaveStyle({ fontFamily: "Fraunces, serif" });
    expect(screen.getByText("Monday - Thursday")).toHaveStyle({
      fontFamily: "Geist, sans-serif",
    });
    expect(
      screen.getByText("120 Fireside Lane, Portland, OR 97201"),
    ).toHaveStyle({ fontFamily: "Geist, sans-serif" });
  });

  it("uses wide side padding and a row layout at a 1280px desktop viewport", () => {
    window.innerWidth = 1280;
    window.dispatchEvent(new Event("resize"));

    render(<SiteFooter />);

    expect(screen.getByRole("contentinfo")).toHaveStyle({
      paddingLeft: "80px",
      paddingRight: "80px",
    });
    expect(screen.getByTestId("footer-columns")).toHaveStyle({
      flexDirection: "row",
    });
  });

  it("uses narrow side padding and a stacked layout at a 375px mobile viewport", () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event("resize"));

    render(<SiteFooter />);

    expect(screen.getByRole("contentinfo")).toHaveStyle({
      paddingLeft: "20px",
      paddingRight: "20px",
    });
    expect(screen.getByTestId("footer-columns")).toHaveStyle({
      flexDirection: "column",
    });
  });
});
