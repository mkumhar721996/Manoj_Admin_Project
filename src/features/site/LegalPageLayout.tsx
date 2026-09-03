import type { ReactNode } from "react";

type LegalPageLayoutProps = {
  testId: string;
  title: string;
  children: ReactNode;
};

export function LegalPageLayout({
  testId,
  title,
  children,
}: LegalPageLayoutProps) {
  return (
    <main
      data-testid={testId}
      style={{
        maxWidth: 720,
        marginLeft: "auto",
        marginRight: "auto",
        padding: "48px 20px",
      }}
    >
      <h1
        style={{
          fontFamily: "Fraunces, serif",
          fontWeight: 700,
          fontSize: 40,
          color: "#151212",
        }}
      >
        {title}
      </h1>
      <div
        style={{
          fontFamily: "Geist, sans-serif",
          fontWeight: 400,
          fontSize: 16,
          color: "#151212",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {children}
      </div>
    </main>
  );
}
