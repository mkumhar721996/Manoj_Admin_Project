type FooterAddressBlockProps = {
  address: string;
};

export function FooterAddressBlock({ address }: FooterAddressBlockProps) {
  return (
    <p
      style={{
        fontFamily: "Geist, sans-serif",
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.6)",
        margin: 0,
      }}
    >
      {address}
    </p>
  );
}
