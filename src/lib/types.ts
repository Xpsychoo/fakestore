/** A product as returned by the Fake Store API. */
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Address {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
}

export interface Order {
  id: number;
  placedAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  address: Address;
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  phone: string;
  address: { street: string; city: string; zip: string };
}

export interface Session {
  token: string;
  user: User;
}
