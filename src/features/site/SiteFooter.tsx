import { useIsMobileViewport } from "./useIsMobileViewport";

type ScheduleRowProps = {
  days: string;
  hours: string;
};

function ScheduleRow({ days, hours }: ScheduleRowProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <span style={{ fontFamily: "Geist, sans-serif", fontSize: 14, color: "#FFFFFF" }}>
        {days}
      </span>
      <span
        style={{
          fontFamily: "Geist, sans-serif",
          fontSize: 14,
          color: "rgba(255, 255, 255, 0.8)",
        }}
      >
        {hours}
      </span>
    </div>
  );
}

function ColumnHeading({ children }: { children: string }) {
  return (
    <h3
      style={{
        fontFamily: "Fraunces, serif",
        fontWeight: 600,
        fontSize: 18,
        color: "#FFFFFF",
        margin: 0,
      }}
    >
      {children}
    </h3>
  );
}

export function SiteFooter() {
  const isMobile = useIsMobileViewport();

  return (
    <footer
      style={{
        backgroundColor: "#151212",
        paddingTop: 64,
        paddingBottom: 64,
        paddingLeft: isMobile ? 20 : 80,
        paddingRight: isMobile ? 20 : 80,
      }}
    >
      <div
        data-testid="footer-columns"
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 48,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
          <ColumnHeading>Kitchen Hours</ColumnHeading>
          <ScheduleRow days="Monday - Thursday" hours="12:00 PM - 10:00 PM" />
          <ScheduleRow days="Friday - Saturday" hours="12:00 PM - 11:30 PM" />
          <ScheduleRow days="Sunday" hours="1:00 PM - 9:30 PM" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
          <ColumnHeading>Pizzeria Location</ColumnHeading>
          <p
            style={{
              fontFamily: "Geist, sans-serif",
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.8)",
              margin: 0,
            }}
          >
            120 Fireside Lane, Portland, OR 97201
          </p>
          <p
            style={{
              fontFamily: "Geist, sans-serif",
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.8)",
              margin: 0,
            }}
          >
            (503) 555-0119
          </p>
          <p
            style={{
              fontFamily: "Geist, sans-serif",
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.8)",
              margin: 0,
            }}
          >
            hello@fornorosso.com
          </p>
        </div>
      </div>
    </footer>
  );
}
