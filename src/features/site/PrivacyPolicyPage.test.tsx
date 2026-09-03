import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PrivacyPolicyPage } from "./PrivacyPolicyPage";

describe("PrivacyPolicyPage", () => {
  it("renders the Privacy Policy title and readable body copy", () => {
    render(<PrivacyPolicyPage />);

    const main = screen.getByTestId("privacy-policy-page");
    expect(main).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Privacy Policy" }),
    ).toBeInTheDocument();
    expect(main.textContent?.trim().length).toBeGreaterThan(
      "Privacy Policy".length,
    );
  });

  it("requires no accept/acknowledge interaction from the visitor", () => {
    render(<PrivacyPolicyPage />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
