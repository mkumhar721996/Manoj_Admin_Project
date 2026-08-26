import { CompassIcon } from "./CompassIcon";
import { ShieldIcon } from "./ShieldIcon";
import { StarIcon } from "./StarIcon";

const ICONS = {
  star: StarIcon,
  shield: ShieldIcon,
  compass: CompassIcon,
};

type FeatureListItemProps = {
  icon: keyof typeof ICONS;
  title: string;
  description: string;
};

export function FeatureListItem({
  icon,
  title,
  description,
}: FeatureListItemProps) {
  const IconComponent = ICONS[icon];

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: "#C82D25",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconComponent />
      </div>
      <div>
        <h3
          style={{
            fontFamily: "Fraunces, serif",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: "19.73px",
            color: "#151212",
            margin: 0,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: "Geist, sans-serif",
            fontWeight: 400,
            fontSize: 13,
            lineHeight: "18.2px",
            color: "#6B6661",
            margin: "4px 0 0",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
