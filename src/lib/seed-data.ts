export type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  variant: "birthday" | "wedding" | "chocolate" | "cupcake" | "anniversary" | "custom";
  weightOptions: string[];
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
  stock: number;
};

export const SEED_CATEGORIES = [
  { name: "Birthday Cakes", slug: "birthday", description: "Celebrate another year of sweetness.", variant: "birthday" },
  { name: "Wedding Cakes", slug: "wedding", description: "Elegant cakes for your perfect day.", variant: "wedding" },
  { name: "Anniversary Cakes", slug: "anniversary", description: "Celebrate love that lasts forever.", variant: "anniversary" },
  { name: "Chocolate Cakes", slug: "chocolate", description: "Rich, indulgent chocolate delights.", variant: "chocolate" },
  { name: "Cupcakes", slug: "cupcake", description: "Perfectly portioned sweet treats.", variant: "cupcake" },
  { name: "Customized Cakes", slug: "custom", description: "Design your dream cake.", variant: "custom" },
] as const;

export const SEED_PRODUCTS: SeedProduct[] = [
  // Birthday
  { name: "Rainbow Sprinkle Dream", slug: "rainbow-sprinkle-dream", description: "A three-layer vanilla sponge covered in rainbow sprinkles and buttercream. Perfect for kids and the young at heart.", price: 899, category: "birthday", variant: "birthday", weightOptions: ["500g", "1kg", "2kg"], isFeatured: true, rating: 4.8, reviewCount: 142, stock: 30 },
  { name: "Strawberry Confetti", slug: "strawberry-confetti", description: "Light strawberry sponge layered with fresh strawberries and vanilla cream. Topped with edible confetti.", price: 949, category: "birthday", variant: "birthday", weightOptions: ["500g", "1kg", "2kg"], rating: 4.7, reviewCount: 98, stock: 25 },
  { name: "Unicorn Magic", slug: "unicorn-magic", description: "A whimsical unicorn-themed cake with pastel buttercream, gold horn, and sprinkle mane.", price: 1499, category: "birthday", variant: "birthday", weightOptions: ["1kg", "2kg"], isFeatured: true, rating: 4.9, reviewCount: 210, stock: 20 },

  // Wedding
  { name: "Pearl Elegance", slug: "pearl-elegance", description: "Three-tier white fondant cake adorned with edible pearls and sugar flowers. A timeless classic.", price: 4999, category: "wedding", variant: "wedding", weightOptions: ["3kg", "5kg"], isFeatured: true, rating: 5.0, reviewCount: 48, stock: 10 },
  { name: "Rose Gold Romance", slug: "rose-gold-romance", description: "Elegant rose-gold accented tiered cake with handcrafted sugar roses.", price: 5499, category: "wedding", variant: "wedding", weightOptions: ["3kg", "5kg"], rating: 4.9, reviewCount: 36, stock: 8 },
  { name: "Minimalist White", slug: "minimalist-white", description: "Clean modern two-tier cake with fresh flower decoration.", price: 3999, category: "wedding", variant: "wedding", weightOptions: ["2kg", "3kg"], rating: 4.8, reviewCount: 27, stock: 12 },

  // Anniversary
  { name: "Heart of Gold", slug: "heart-of-gold", description: "Heart-shaped red velvet cake with cream cheese frosting and gold leaf accents.", price: 1299, category: "anniversary", variant: "anniversary", weightOptions: ["500g", "1kg"], isFeatured: true, rating: 4.9, reviewCount: 156, stock: 25 },
  { name: "Forever Yours", slug: "forever-yours", description: "Romantic pink ombre cake with edible hearts and fresh rose petals.", price: 1199, category: "anniversary", variant: "anniversary", weightOptions: ["500g", "1kg"], rating: 4.7, reviewCount: 89, stock: 20 },

  // Chocolate
  { name: "Dark Chocolate Truffle", slug: "dark-chocolate-truffle", description: "Decadent Belgian dark chocolate ganache layered with chocolate truffle sponge. For serious chocoholics.", price: 1099, category: "chocolate", variant: "chocolate", weightOptions: ["500g", "1kg", "2kg"], isFeatured: true, rating: 4.9, reviewCount: 287, stock: 35 },
  { name: "Triple Chocolate Fudge", slug: "triple-chocolate-fudge", description: "White, milk, and dark chocolate layers with chocolate fudge frosting.", price: 1199, category: "chocolate", variant: "chocolate", weightOptions: ["500g", "1kg", "2kg"], rating: 4.8, reviewCount: 164, stock: 30 },
  { name: "Chocolate Strawberry Bliss", slug: "chocolate-strawberry-bliss", description: "Rich chocolate cake topped with fresh strawberries and chocolate drizzle.", price: 1299, category: "chocolate", variant: "chocolate", weightOptions: ["500g", "1kg"], rating: 4.9, reviewCount: 198, stock: 25 },

  // Cupcakes
  { name: "Classic Vanilla Cupcake (Box of 6)", slug: "classic-vanilla-cupcake", description: "Six fluffy vanilla cupcakes topped with swirled vanilla buttercream.", price: 399, category: "cupcake", variant: "cupcake", weightOptions: ["6 pcs", "12 pcs"], isFeatured: true, rating: 4.7, reviewCount: 234, stock: 50 },
  { name: "Red Velvet Cupcake (Box of 6)", slug: "red-velvet-cupcake", description: "Six classic red velvet cupcakes with cream cheese frosting.", price: 449, category: "cupcake", variant: "cupcake", weightOptions: ["6 pcs", "12 pcs"], rating: 4.8, reviewCount: 176, stock: 50 },
  { name: "Chocolate Chip Cupcake (Box of 6)", slug: "chocolate-chip-cupcake", description: "Chocolate cupcakes with chocolate chips and ganache swirl.", price: 429, category: "cupcake", variant: "cupcake", weightOptions: ["6 pcs", "12 pcs"], rating: 4.7, reviewCount: 121, stock: 50 },

  // Custom
  { name: "Designer Custom Cake", slug: "designer-custom-cake", description: "Fully customized cake designed to your specifications. Choose flavors, colors, and themes.", price: 1999, category: "custom", variant: "custom", weightOptions: ["1kg", "2kg", "3kg"], isFeatured: true, rating: 4.9, reviewCount: 87, stock: 15 },
  { name: "Photo Print Custom Cake", slug: "photo-print-custom-cake", description: "Personalized cake with edible photo print of your favorite memory.", price: 1499, category: "custom", variant: "custom", weightOptions: ["1kg", "2kg"], rating: 4.8, reviewCount: 65, stock: 20 },
];
