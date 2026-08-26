import { FeatureListItem } from "./FeatureListItem";
import { STORY_FEATURES } from "./storyData";

export function FeatureList() {
  return (
    <div
      data-testid="feature-list"
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      {STORY_FEATURES.map((feature) => (
        <FeatureListItem
          key={feature.id}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
}
