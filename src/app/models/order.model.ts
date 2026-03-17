import { CartItem } from './cart-item.model';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface Order {
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}
