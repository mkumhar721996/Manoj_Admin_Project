type FooterContactLinesProps = {
  delivery: string;
  email: string;
};

export function FooterContactLines({ delivery, email }: FooterContactLinesProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          fontFamily: "Geist, sans-serif",
          fontSize: 14,
          color: "#FFFFFF",
        }}
      >
        Delivery: {delivery}
      </span>
      <span
        style={{
          fontFamily: "Geist, sans-serif",
          fontSize: 14,
          color: "rgba(255, 255, 255, 0.6)",
        }}
      >
        Email: {email}
      </span>
    </div>
  );
}
