export type ProductCategory = 'cpu' | 'gpu' | 'ram' | 'ssd' | 'motherboard' | 'psu' | 'case' | 'cooler';

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  brand: string;
  price: number;
  specs: Record<string, string>;
  imageUrl: string;
  rating: number;
  stock: number;
  description: string;
}
