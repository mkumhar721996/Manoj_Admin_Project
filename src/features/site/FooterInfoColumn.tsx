import type { ReactNode } from "react";

type FooterInfoColumnProps = {
  title: string;
  children: ReactNode;
};

export function FooterInfoColumn({ title, children }: FooterInfoColumnProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h3
        style={{
          fontFamily: "Fraunces, serif",
          fontWeight: 600,
          fontSize: 16,
          textTransform: "uppercase",
          color: "#FFFFFF",
          margin: 0,
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
