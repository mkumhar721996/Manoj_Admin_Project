import { useIsMobileViewport } from "./useIsMobileViewport";
import { STORY_IMAGES } from "./storyData";

export function StoryImageCollage() {
  const isMobile = useIsMobileViewport();

  return (
    <div
      data-testid="story-image-collage"
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: 16,
      }}
    >
      {STORY_IMAGES.map((image) => (
        <img
          key={image.id}
          src={image.imageSrc}
          alt={image.imageAlt}
          style={{
            width: "100%",
            aspectRatio: "292 / 520",
            objectFit: "cover",
            borderRadius: 16,
          }}
        />
      ))}
    </div>
  );
}
