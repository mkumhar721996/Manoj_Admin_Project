type DeliveryIndicatorProps = {
  prefix: string;
  value: string;
};

export function DeliveryIndicator({ prefix, value }: DeliveryIndicatorProps) {
  return (
    <span
      style={{
        fontFamily: "Geist, sans-serif",
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.8)",
        whiteSpace: "nowrap",
      }}
    >
      {prefix}{" "}
      <span style={{ color: "#2A7043", fontWeight: 600 }}>{value}</span>
    </span>
  );
}
