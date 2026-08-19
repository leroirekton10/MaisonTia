export interface Product {
  id: string;
  name: string;
  category: 'gold' | 'silver';
  categoryLabel: string;
  subCategory: 'or-diamant' | 'argent-beldi' | 'argent-925';
  price: string;
  numericPrice: number;
  description: string;
  longDescription: string;
  materials: string[];
  dimensions?: string;
  craftsmanship: string;
  featuredImage: string;
  gallery: string[];
  isNewArrival?: boolean;
  isBestseller?: boolean;
  diamondCarat?: string;
  diamondCut?: string;
  origin?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'solitaire-celeste',
    name: 'Solitaire Céleste',
    category: 'gold',
    categoryLabel: 'Or & Diamant de Laboratoire',
    subCategory: 'or-diamant',
    price: '2 850 €',
    numericPrice: 2850,
    description: 'Bague solitaire éthique en or 18 carats sertie d\'un diamant de laboratoire pur.',
    longDescription: 'Le Solitaire Céleste célèbre l’union parfaite entre l’or éthique 18K et la perfection scientifique du diamant de laboratoire. Façonné à la main dans notre atelier, son serti discret magnifie la brillance naturelle de la pierre précieuse cultivée de manière éco-responsable.',
    materials: ['Or 18 Carats Recyclé', 'Diamant de Laboratoire de Synthèse Éthique (1.2 Carats)'],
    dimensions: 'Anneau de 1.8mm, Serti 4 griffes d\'exception',
    craftsmanship: 'Façonné à la main par nos maîtres joailliers. Certification de pureté VVS1, couleur F.',
    featuredImage: '/assets/instagram/photo acceuil 1.jpg',
    gallery: ['/assets/instagram/photo acceuil 1.jpg', '/assets/instagram/1000250540.jpg'],
    isBestseller: true,
    diamondCarat: '1.20 ct',
    diamondCut: 'Brillant Rond Idéal',
    origin: 'Joaillerie Contemporaine'
  },
  {
    id: 'collier-aura-or',
    name: 'Pendentif Aura d\'Or & Diamant',
    category: 'gold',
    categoryLabel: 'Or & Diamant de Laboratoire',
    subCategory: 'or-diamant',
    price: '1 950 €',
    numericPrice: 1950,
    description: 'Pendentif délicat goutte d\'or et pavage diamant de synthèse éthique.',
    longDescription: 'Inspiré par les rayons solaires, le pendentif Aura d\'Or entoure un diamant éco-responsable d\'un halo d\'or 18 carats poli miroir. Une signature lumineuse et inaltérable qui traverse le temps.',
    materials: ['Or Jaune 18 Carats', 'Pavage Diamants de Laboratoire (0.45 Carats)'],
    dimensions: 'Chaîne 45cm ajustable, Pendentif 14mm',
    craftsmanship: 'Sertissage micro-pave à la loupe de précision. Certifié neutre en carbone.',
    featuredImage: '/assets/instagram/photo acceuil 2.jpg',
    gallery: ['/assets/instagram/photo acceuil 2.jpg', '/assets/instagram/1000257112.jpg'],
    isNewArrival: true,
    diamondCarat: '0.45 ct total',
    diamondCut: 'Poire & Brillant',
    origin: 'Collection Haute-Joaillerie'
  },
  {
    id: 'manchette-beldi-atlas',
    name: 'Manchette Beldi Atlas',
    category: 'silver',
    categoryLabel: 'Argent 925 & Argent Beldi',
    subCategory: 'argent-beldi',
    price: '680 €',
    numericPrice: 680,
    description: 'Manchette artisanale en argent Beldi pur martelé à la main au Maroc.',
    longDescription: 'Chaque manchette Beldi Atlas est une pièce unique sculptée à la main selon les techniques ancestrales des artisans orfèvres marocains. L\'argent traditionnel Beldi offre une patine vivante et texturée d\'une authenticité rare.',
    materials: ['Argent Beldi Traditionnel Marocain (950/1000)', 'Finition Martelée Main'],
    dimensions: 'Largeur 35mm, Ouverture ajustable',
    craftsmanship: 'Travail à la ciselure et au marteau par un maître artisan marocain à Fès/Marrakech.',
    featuredImage: '/assets/instagram/photo acceuil 3.jpg',
    gallery: ['/assets/instagram/photo acceuil 3.jpg', '/assets/instagram/1000257114.jpg'],
    isBestseller: true,
    origin: 'Fait Main au Maroc'
  },
  {
    id: 'bague-beldi-koutoubia',
    name: 'Bague Beldi Koutoubia',
    category: 'silver',
    categoryLabel: 'Argent 925 & Argent Beldi',
    subCategory: 'argent-beldi',
    price: '420 €',
    numericPrice: 420,
    description: 'Création sculpturale en argent 925 enrichie des motifs Beldi ancestraux.',
    longDescription: 'Hommage à l\'architecture maure et à la pureté des lignes du Sud, la bague Beldi Koutoubia associe la robustesse de l\'argent 925 à l\'âme chaleureuse de la finition Beldi gravée main.',
    materials: ['Argent 925 Sterling', 'Gravure Ciselée Beldi'],
    dimensions: 'Plateau 18mm, Corps ergonomique',
    craftsmanship: 'Pièce estampée et ciselée à la main. Polissage satiné d\'exception.',
    featuredImage: '/assets/instagram/photo acceuil 4.jpg',
    gallery: ['/assets/instagram/photo acceuil 4.jpg', '/assets/instagram/1000257115.jpg'],
    isNewArrival: true,
    origin: 'Fait Main au Maroc'
  },
  {
    id: 'boucles-diamant-or-ethique',
    name: 'Créoles Diamants de Labo 18K',
    category: 'gold',
    categoryLabel: 'Or & Diamant de Laboratoire',
    subCategory: 'or-diamant',
    price: '3 200 €',
    numericPrice: 3200,
    description: 'Paire de créoles graphiques serties de diamants de synthèse sur deux rangs.',
    longDescription: 'Une réinterprétation contemporaine de la créole classique. Deux rangs parallèles de diamants de laboratoire illuminent votre visage sous chaque angle d\'éclairage.',
    materials: ['Or Blanc 18 Carats', 'Diamants de Laboratoire (1.80 Carats total)'],
    dimensions: 'Diamètre 22mm, Fermoir cliquet de sécurité',
    craftsmanship: 'Conception haute précision. Pierres certifiées zéro émission minérale.',
    featuredImage: '/assets/instagram/photo acceuil 5.jpg',
    gallery: ['/assets/instagram/photo acceuil 5.jpg', '/assets/instagram/1000275805.webp'],
    isBestseller: true,
    diamondCarat: '1.80 ct total',
    diamondCut: 'Brillant',
    origin: 'Collection Haute-Joaillerie'
  },
  {
    id: 'fibule-beldi-contemporaine',
    name: 'Fibule Beldi Contemporaine',
    category: 'silver',
    categoryLabel: 'Argent 925 & Argent Beldi',
    subCategory: 'argent-beldi',
    price: '540 €',
    numericPrice: 540,
    description: 'Broche / Pendentif en argent Beldi gravé main, symbole de force et de protection.',
    longDescription: 'Revisitant l\'emblématique fibule marocaine, cette création versatille peut se porter en broche de manteau ou en pendentif sculptural. Un bijou signature, lourd et expressif.',
    materials: ['Argent Beldi Pur (925/1000)', 'Patine Antique Faite Main'],
    dimensions: 'Hauteur 55mm, Largeur 40mm',
    craftsmanship: 'Ciselure traditionnelle au burin et polissage à la peau de chamois.',
    featuredImage: '/assets/instagram/1000279760.png',
    gallery: ['/assets/instagram/1000279760.png', '/assets/instagram/1000257160.png'],
    isNewArrival: true,
    origin: 'Fait Main au Maroc'
  }
];

export const INSTAGRAM_MEDIA = [
  { id: 'ig-1', type: 'image' as const, url: '/assets/instagram/photo acceuil 1.jpg', caption: 'Solitaire Céleste en Or 18K et Diamant de Laboratoire Éthique ✨', likes: '1.4k' },
  { id: 'ig-2', type: 'image' as const, url: '/assets/instagram/photo acceuil 2.jpg', caption: 'Pendentif Aura d\'Or : la noblesse de l\'or alliée à la conscience.', likes: '980' },
  { id: 'ig-3', type: 'image' as const, url: '/assets/instagram/photo acceuil 3.jpg', caption: 'Argent Beldi fait main : l\'artisanat marocain sous son plus beau jour 🇲🇦', likes: '2.1k' },
  { id: 'ig-4', type: 'image' as const, url: '/assets/instagram/photo acceuil 4.jpg', caption: 'Bague Beldi Koutoubia : lignes épurées et gravures ancestrales.', likes: '1.7k' },
  { id: 'ig-5', type: 'image' as const, url: '/assets/instagram/photo acceuil 5.jpg', caption: 'La force douce de la femme à travers des créations d\'exception.', likes: '3.2k' },
  { id: 'ig-6', type: 'image' as const, url: '/assets/instagram/1000250540.jpg', caption: 'Détail de sertissage à la loupe par nos maîtres joailliers.', likes: '890' },
  { id: 'ig-7', type: 'image' as const, url: '/assets/instagram/1000257112.jpg', caption: 'Diamants de laboratoire : brillance absolue sans compromis éthique.', likes: '1.5k' },
  { id: 'ig-8', type: 'image' as const, url: '/assets/instagram/1000257114.jpg', caption: 'Argent 925 et Argent Beldi martelé au marteau de précision.', likes: '1.1k' },
  { id: 'ig-9', type: 'image' as const, url: '/assets/instagram/1000257115.jpg', caption: 'Chaque pièce raconte une histoire inaltérable.', likes: '1.3k' },
  { id: 'ig-10', type: 'image' as const, url: '/assets/instagram/1000257160.png', caption: 'Une signature personnelle, lumineuse et précieuse.', likes: '2.4k' },
  { id: 'ig-11', type: 'image' as const, url: '/assets/instagram/1000275805.webp', caption: 'Équilibre subtil entre tradition marocaine et modernité.', likes: '1.8k' },
  { id: 'ig-12', type: 'image' as const, url: '/assets/instagram/1000279760.png', caption: 'Maison Tia – L’essence du bijou contemporain.', likes: '4.5k' }
];

export const COMMERCIAL_PRESENTATION = {
  title: "Maison Tia – L’essence du bijou contemporain",
  subtitle: "Née du désir de sublimer la féminité à travers des créations précieuses et intemporelles, Maison Tia incarne une vision moderne du luxe, où l’élégance rime avec conscience.",
  paragraphs: [
    "Chaque bijou est façonné à la main, dans le respect d’un savoir-faire artisanal d’exception, en alliant l’éclat de l’argent 925, la noblesse de l’or et la pureté éthique des diamants de laboratoire. Ces pierres précieuses, cultivées de manière responsable, offrent une alternative durable au diamant traditionnel, sans compromis sur la beauté ni sur la brillance.",
    "Les collections Maison Tia célèbrent la force douce de la femme à travers des lignes épurées, une attention méticuleuse au détail et des matériaux d’exception. Chaque pièce raconte une histoire, celle d’un bijou qui traverse le temps avec grâce.",
    "Plus qu’un ornement, un bijou Maison Tia est une signature : personnelle, lumineuse, inaltérable."
  ]
};
