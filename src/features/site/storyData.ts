export const STORY_NARRATIVE =
  "At Forno Rosso, we respect the traditions of Neapolitan pizzaiolos while implementing modern techniques. We ferment our proprietary sourdough mother starter for 48 hours. This process creates a light, bubbly, and incredibly digestible dough with complex flavor profiles.";

export type StoryFeature = {
  id: string;
  icon: "star" | "shield" | "compass";
  title: string;
  description: string;
};

export const STORY_FEATURES: StoryFeature[] = [
  {
    id: "san-marzano-tomatoes",
    icon: "star",
    title: "100% Imported San Marzano Tomatoes",
    description:
      "Sourced directly from fertile Campania volcano soils for a sweet, low-acid base.",
  },
  {
    id: "fior-di-latte-mozzarella",
    icon: "shield",
    title: "Fior di Latte & Fresh Mozzarella",
    description:
      "Hand-stretched daily, creating the classic pool texture that blends beautifully under high fire.",
  },
  {
    id: "stone-hearth-oven",
    icon: "compass",
    title: "900°F Stone Hearth Wood Oven",
    description:
      "Powered by seasoned hickory and oak to lock in flavors and produce perfect crust blistering in 90 seconds.",
  },
];

export type StoryImage = {
  id: string;
  imageSrc: string;
  imageAlt: string;
};

export const STORY_IMAGES: StoryImage[] = [
  {
    id: "dough-stretching",
    imageSrc: "/images/story/dough-stretching.png",
    imageAlt:
      "A chef hand-stretching sourdough pizza dough over a floured countertop",
  },
  {
    id: "wood-fired-oven",
    imageSrc: "/images/story/wood-fired-oven.png",
    imageAlt: "A wood-fired pizza baking inside a lit stone hearth oven",
  },
];
