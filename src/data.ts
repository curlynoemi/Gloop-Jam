/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { JamFlavor, Review, FAQItem } from './types';

// Import assets generated using generate_image
import heroImage from './assets/images/gloop_jars_hero_1780505394590.png';
import strawberryImage from './assets/images/gloop_strawberry_1780505411935.png';
import peachImage from './assets/images/gloop_peach_1780505430359.png';
import lemonImage from './assets/images/gloop_lemon_1780505448674.png';
import blueberryImage from './assets/images/gloop_blueberry_1780519923566.png';
import orangeImage from './assets/images/gloop_orange_1780520795616.png';

export const HERO_IMAGE = heroImage;

export const FLAVORS: JamFlavor[] = [
  {
    id: 'strawberry-jam',
    name: 'Strawberry Jam',
    title: 'The Crimson Classicist',
    color: '#b51136',
    textColor: '#f4f5f0',
    bgColor: 'bg-[#b51136]',
    hoverColor: 'hover:bg-[#a00e2e]',
    tagline: 'Deep velvet red with high-sheen berry lustre',
    description: 'A luxurious spread crafted from sun-drenched crimson strawberries cooked down into an incredibly rich, glistening velvet state. Unmatched depth of pure red ruby juice designed for serious toast-theorists.',
    image: strawberryImage,
    sweetness: 4,
    tartness: 2,
    lustre: 5,
    vibe: 'Bold, Nostalgic, Classy and Unapologetically Rich',
    pairings: ['Warm Sourdough & Flaky Sea Salt', 'Freshly Whipped Ricotta', 'Warm Buttery Croissants'],
    ingredients: 'Orchard-grown organic strawberries, unrefined cane sugar, wild organic raspberries (for acidity balance), fresh citrus pectin.',
    price: 8,
  },
  {
    id: 'peach-jam',
    name: 'Peach Jam',
    title: 'The Golden Melodist',
    color: '#fcaf9b',
    textColor: '#4b2920',
    bgColor: 'bg-[#fcaf9b]',
    hoverColor: 'hover:bg-[#e89d89]',
    tagline: 'Lustrous coral-peach with velvety fruit silkiness',
    description: 'Luminous ripe nectar cooked at ultra-low pressures to preserve the ethereal, sunlit perfume of fresh summer peaches. Extremely juicy, with natural pulp folds that melt delightfully on the spoon.',
    image: peachImage,
    sweetness: 3,
    tartness: 3,
    lustre: 4,
    vibe: 'Balmy, Warm-hearted, Ethereal and Comforting',
    pairings: ['Greek Yogurt & Roasted Pistachios', 'Gorgonzola Dolce or Goat Cheese', 'Almond Butter Spreads'],
    ingredients: 'Premium velvet peaches, organic white nectarines, fresh lemon juice, unrefined cane sugar, trace vanilla bean infusion.',
    price: 8,
  },
  {
    id: 'lemon-jam',
    name: 'Lemon Jam',
    title: 'The Zesty Radical',
    color: '#fbbc2f',
    textColor: '#4b2920',
    bgColor: 'bg-[#fbbc2f]',
    hoverColor: 'hover:bg-[#e4a822]',
    tagline: 'Ultra-creamy custard zest with a wild sour punch',
    description: 'A striking yellow curd with smooth, shimmering consistency, marrying wild citrus punch with creamy organic velvet texture. Created utilizing freshly grated lemon curls and light cold-whipped organic oils.',
    image: lemonImage,
    sweetness: 2,
    tartness: 5,
    lustre: 5,
    vibe: 'Electric, Artistic, Sharp and Refreshingly Elegant',
    pairings: ['Earl Grey Tea biscuits', 'Warm Brioche Buns', 'Mascarpone Crepes'],
    ingredients: 'Freshly squeezed lemons, organic egg-free custard emulsion, premium lemon zest curls, pure cold-pressed citrus oil, light raw honey.',
    price: 8,
  },
  {
    id: 'blueberry-jam',
    name: 'Blueberry Jam',
    title: 'The Indigo Velvet',
    color: '#1e293b',
    textColor: '#f4f5f0',
    bgColor: 'bg-[#1e293b]',
    hoverColor: 'hover:bg-[#0f172a]',
    tagline: 'Deep subalpine wild blueberry shimmering glaze',
    description: 'A decadent and tangy spread brimming with wild organic blueberries harvested from subalpine mountain crops. Slowly hand-simmered to create a sparkling, deep indigo shine that holds rich flavor.',
    image: blueberryImage,
    sweetness: 3,
    tartness: 4,
    lustre: 5,
    vibe: 'Mysterious, Luxurious, Rich and Wildly Tangy',
    pairings: ['Warm Goat Cheese & Butter Toast', 'Fresh Vanilla Waffles2', 'Cream Cheese Bagels'],
    ingredients: 'Freshly harvested wild blueberries, unrefined cane sugar, squeezed blackcurrant nectar, handpicked mountain lemon rind.',
    price: 8,
  },
  {
    id: 'orange-jam',
    name: 'Orange Jam',
    title: 'The Citrus Sunshine',
    color: '#ea580c',
    textColor: '#f4f5f0',
    bgColor: 'bg-[#ea580c]',
    hoverColor: 'hover:bg-[#c2410c]',
    tagline: 'Glistening amber marmalade with candied orange ribbons',
    description: 'A spectacular, translucent amber glaze prepared using the zest of sweet oranges and the pure, fragrant pulp of seasonal citrus. Delivers an unforgettable balance of warm, sunny flavor with signature gloop lustre.',
    image: orangeImage,
    sweetness: 3,
    tartness: 4,
    lustre: 5,
    vibe: 'Warm, Radiant, Complex and Intensely Bright',
    pairings: ['Dark Chocolate Slices', 'Warm Scones with Clotted Cream', 'Aged Cream Cheese'],
    ingredients: 'Organic oranges, unrefined golden cane sugar, freshly squeezed orange juice, artisan orange zest curls, clean fruit pectin.',
    price: 8,
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Sienna Vance',
    location: 'Design Director, Milan',
    rating: 5,
    quote: "Gloop isn't breakfast product; it is dynamic table artwork. The shimmering sheen of Strawberry Jam is absolutely pristine, catching the morning sun like Murano glass.",
    flavor: 'Strawberry Jam',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'rev-2',
    name: 'Elias Thorne',
    location: 'Pastry Chef & Writer',
    rating: 5,
    quote: "Cooking peach jam under low pressure preserves the fruit's volatile top notes that usually get boiled away. Peach Jam tastes like an actual peach orchard in August.",
    flavor: 'Peach Jam',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'rev-3',
    name: 'Margot Moreau',
    location: 'Brunch Connoisseur, Paris',
    rating: 5,
    quote: 'Lemon Jam is electric. It has that thick, classy custard texture but punches through with a razor-sharp tart vibrancy that wakes up your entire plate.',
    flavor: 'Lemon Jam',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Why is it called "Gloop"?',
    answer: 'Because "jam" sounds like a traffic block or standard spreadsheet. "Gloop" represents the thick, lustrous, tactile sound of a generous spoonful hitting high-density sourdough bread. It celebrates the beautiful, fun, glidant texture of our premium design spreads!'
  },
  {
    id: 'faq-2',
    question: 'What makes Gloop "Premium & Classy" yet "Fun"?',
    answer: "Most premium brands take themselves too seriously with clinical white labels and boring marketing. We combine top-tier culinary methods (low-temperature vacuum boiling, high-density organic orchards) with loud, beautiful color contrasts, giant graphics, and a joyful dedication to culinary pleasure."
  },
  {
    id: 'faq-3',
    question: 'How do you achieve that incredible shimmering sheen?',
    answer: 'Our secret lies in low-pressure simmering. Standard jam-making involves violent, high-heat boiling which breaks down fruit cells and turns sugar into a cloudy syrup. By simmering gently in a specialized vessel, we preserve the organic juices translucent refraction, resulting in our signature lustrous, glistening shine.'
  },
  {
    id: 'faq-4',
    question: 'Are there any artificial coloring agents or thickeners?',
    answer: 'Never! Our color is 100% natural and inherited directly from high-intensity heirloom rubies, peaches, and organic lemons. We do not use gelatin, corn starch, or artificial glooming agents. Pure orchard fruit pectin does all the work.'
  }
];
