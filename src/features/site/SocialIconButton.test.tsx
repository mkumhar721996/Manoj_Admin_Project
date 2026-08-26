import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SocialIconButton } from "./SocialIconButton";

describe("SocialIconButton", () => {
  it("renders a link to the given href with the accessible label, opening in a new tab safely", () => {
    render(
      <SocialIconButton
        icon="instagram"
        href="https://example.test/instagram"
        label="Instagram"
      />,
    );

    const link = screen.getByRole("link", { name: "Instagram" });
    expect(link).toHaveAttribute("href", "https://example.test/instagram");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
