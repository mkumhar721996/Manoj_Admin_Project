export type FeaturedMenuItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

export const FEATURED_MENU_ITEMS: FeaturedMenuItem[] = [
  {
    id: "diavola",
    name: "Diavola",
    price: "$16.50",
    description:
      "Spicy calabrian salami, house-pulled fresh mozzarella, san marzano tomato base, organic chili oil, fresh basil leaves.",
    imageSrc: "/images/menu/diavola.png",
    imageAlt: "Diavola",
  },
  {
    id: "funghi-selvatici-tartufo",
    name: "Funghi Selvatici & Tartufo",
    price: "$18.00",
    description:
      "Roasted wild porcini and cremini mushrooms, truffle-infused olive oil, white mozzarella base, shaved pecorino.",
    imageSrc: "/images/menu/funghi-selvatici-tartufo.png",
    imageAlt: "Funghi Selvatici & Tartufo",
  },
  {
    id: "classic-margherita",
    name: "Classic Margherita",
    price: "$14.50",
    description:
      "Imported San Marzano tomato sauce, fresh buffalo mozzarella, fragrant fresh basil, extra virgin olive oil.",
    imageSrc: "/images/menu/classic-margherita.png",
    imageAlt: "Classic Margherita",
  },
  {
    id: "prosciutto-crudo-e-rucola",
    name: "Prosciutto Crudo e Rucola",
    price: "$19.00",
    description:
      "Prosciutto di Parma cured ham, fresh peppery wild arugula, shaved parmigiano-reggiano, balsamic glaze reduction.",
    imageSrc: "/images/menu/prosciutto-crudo-e-rucola.png",
    imageAlt: "Prosciutto Crudo e Rucola",
  },
];
