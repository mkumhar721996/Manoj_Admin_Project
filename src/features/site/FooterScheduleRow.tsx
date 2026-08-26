type FooterScheduleRowProps = {
  day: string;
  hours: string;
};

export function FooterScheduleRow({ day, hours }: FooterScheduleRowProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span
        style={{
          fontFamily: "Geist, sans-serif",
          fontSize: 14,
          color: "#FFFFFF",
        }}
      >
        {day}
      </span>
      <span
        style={{
          fontFamily: "Geist, sans-serif",
          fontSize: 14,
          color: "rgba(255, 255, 255, 0.6)",
        }}
      >
        {hours}
      </span>
    </div>
  );
}
