import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';

import { Product } from '../../models/product.model';
import { ProductsStore } from '../../store/products.store';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-comparison-page',
  imports: [CurrencyPipe, MatIcon, MatChipListbox, MatChipOption],
  templateUrl: './comparison-page.component.html',
  styleUrl: './comparison-page.component.css',
})
export class ComparisonPageComponent {
  readonly productsStore = inject(ProductsStore);
  readonly cartStore = inject(CartStore);

  private readonly selectedIds = signal<Set<number>>(new Set());

  readonly selectedProducts = computed(() => {
    const ids = this.selectedIds();
    return this.productsStore.entities().filter((p) => ids.has(p.id));
  });

  readonly allSpecKeys = computed(() => {
    const keys = new Set<string>();
    for (const product of this.selectedProducts()) {
      for (const key of Object.keys(product.specs)) {
        keys.add(key);
      }
    }
    return Array.from(keys);
  });

  isSelected(id: number): boolean {
    return this.selectedIds().has(id);
  }

  toggleProduct(product: Product) {
    this.selectedIds.update((ids) => {
      const next = new Set(ids);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else if (next.size < 4) {
        next.add(product.id);
      }
      return next;
    });
  }

  removeProduct(id: number) {
    this.selectedIds.update((ids) => {
      const next = new Set(ids);
      next.delete(id);
      return next;
    });
  }
}
