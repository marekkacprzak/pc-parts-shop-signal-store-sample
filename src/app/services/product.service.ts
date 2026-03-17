import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly url = '/data/products.json';

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }

  getById(id: number): Observable<Product | undefined> {
    return this.getAll().pipe(map((products) => products.find((p) => p.id === id)));
  }

  search(query: string): Observable<Product[]> {
    return this.getAll().pipe(
      map((products) => {
        if (!query.trim()) return products;
        const lower = query.toLowerCase();
        return products.filter(
          (p) =>
            p.name.toLowerCase().includes(lower) ||
            p.brand.toLowerCase().includes(lower) ||
            p.category.toLowerCase().includes(lower) ||
            p.description.toLowerCase().includes(lower),
        );
      }),
    );
  }
}
