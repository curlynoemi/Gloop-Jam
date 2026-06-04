/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface JamFlavor {
  id: string;
  name: string;
  title: string;
  color: string;
  textColor: string;
  bgColor: string;
  hoverColor: string;
  tagline: string;
  description: string;
  image: string;
  sweetness: number; // 1-5
  tartness: number;  // 1-5
  lustre: number; // 1-5
  vibe: string;
  pairings: string[];
  ingredients: string;
  price: number;
}

export interface CartItem {
  id: string;
  name: string;
  flavorId: string;
  image: string;
  price: number;
  quantity: number;
  isCustomBox: boolean;
  boxContents?: string[]; // list of flavor ids
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
  flavor: string;
  avatar: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
