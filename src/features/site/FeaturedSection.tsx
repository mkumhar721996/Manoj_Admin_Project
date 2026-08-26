import { FeaturedGrid } from "./FeaturedGrid";
import { useIsMobileViewport } from "./useIsMobileViewport";

export function FeaturedSection() {
  const isMobile = useIsMobileViewport();

  return (
    <section
      data-testid="featured-section"
      style={{
        backgroundColor: "#FCFAF6",
        paddingTop: 80,
        paddingBottom: 80,
        paddingLeft: isMobile ? 20 : 80,
        paddingRight: isMobile ? 20 : 80,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <p
          style={{
            fontFamily: "Geist, sans-serif",
            fontWeight: 600,
            fontSize: 13,
            lineHeight: "16.9px",
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "#C82D25",
            margin: 0,
          }}
        >
          Chef Recommendations
        </p>
        <h2
          style={{
            fontFamily: "Fraunces, serif",
            fontWeight: 700,
            fontSize: 40,
            lineHeight: "46px",
            color: "#151212",
            margin: "8px 0 0",
          }}
        >
          Popular Sourdough Pizzas
        </h2>
        <div
          style={{
            width: 48,
            height: 3,
            backgroundColor: "#C82D25",
            margin: "16px auto 0",
          }}
        />
      </div>
      <FeaturedGrid />
    </section>
  );
}
