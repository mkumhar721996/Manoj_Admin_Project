import { FacebookIcon } from "./FacebookIcon";
import { InstagramIcon } from "./InstagramIcon";
import { TwitterIcon } from "./TwitterIcon";

const ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  twitter: TwitterIcon,
} as const;

type SocialIconButtonProps = {
  icon: keyof typeof ICONS;
  href: string;
  label: string;
};

export function SocialIconButton({ icon, href, label }: SocialIconButtonProps) {
  const IconComponent = ICONS[icon];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255, 255, 255, 0.07)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#FFFFFF",
        flexShrink: 0,
      }}
    >
      <IconComponent />
    </a>
  );
}
