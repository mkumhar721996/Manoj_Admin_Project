import { FeatureList } from "./FeatureList";
import { StoryImageCollage } from "./StoryImageCollage";
import { STORY_NARRATIVE } from "./storyData";
import { useIsMobileViewport } from "./useIsMobileViewport";

export function StorySection() {
  const isMobile = useIsMobileViewport();

  return (
    <section
      data-testid="story-section"
      style={{
        backgroundColor: "#F3EFE9",
        paddingTop: 96,
        paddingBottom: 120,
        paddingLeft: isMobile ? 20 : 80,
        paddingRight: isMobile ? 20 : 80,
      }}
    >
      <div
        data-testid="story-section-grid"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <p
              style={{
                fontFamily: "Geist, sans-serif",
                fontWeight: 600,
                fontSize: 13,
                lineHeight: "16.9px",
                letterSpacing: 1,
                textTransform: "uppercase",
                color: "#2A7043",
                margin: 0,
              }}
            >
              The Sourdough Secret
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
              Our Passion for the Perfect Crust
            </h2>
          </div>
          <p
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 400,
              fontSize: 16,
              lineHeight: "25.6px",
              color: "#6B6661",
              margin: 0,
            }}
          >
            {STORY_NARRATIVE}
          </p>
          <FeatureList />
        </div>
        <StoryImageCollage />
      </div>
    </section>
  );
}
