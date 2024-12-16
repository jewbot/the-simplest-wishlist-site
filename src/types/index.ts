export interface Wishlist {
  systemName: string;
  userName: string;
  title: string;
  isPublic: boolean;
  password?: string;
  createdAt: Date;
  lastEditedAt: Date;
  items: WishlistItem[];
}

export interface WishlistItem {
  id: string;
  name: string;
  specification?: string;
  howToBuy: string;
  price?: number;
  priority?: WishlistPriority;
  comments?: string;
  lastEditedAt: Date;
  isBought: boolean;
}

export type WishlistPriority = 
  | "I need it urgently"
  | "I need it in general"
  | "I want it urgently"
  | "I want it in general"
  | "It would be nice";