import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatButton } from '@angular/material/button';

import { Product, ProductCategory } from '../../models/product.model';
import { ProductsStore } from '../../store/products.store';
import { CartStore } from '../../store/cart.store';
import { FilterStore } from '../../store/filter.store';
import { ProductGridComponent } from '../../components/product/product-grid.component';
import { LoadingSpinnerComponent } from '../../components/shared/loading-spinner.component';

const CATEGORIES: { value: ProductCategory; label: string; icon: string }[] = [
  { value: 'cpu', label: 'CPU', icon: 'developer_board' },
  { value: 'gpu', label: 'GPU', icon: 'videocam' },
  { value: 'ram', label: 'RAM', icon: 'memory' },
  { value: 'ssd', label: 'SSD', icon: 'storage' },
  { value: 'motherboard', label: 'Motherboard', icon: 'dashboard' },
  { value: 'psu', label: 'PSU', icon: 'bolt' },
  { value: 'case', label: 'Case', icon: 'computer' },
  { value: 'cooler', label: 'Cooler', icon: 'ac_unit' },
];

@Component({
  selector: 'app-catalog-page',
  providers: [FilterStore],
  imports: [
    MatIcon, MatChipListbox, MatChipOption, MatButton,
    ProductGridComponent, LoadingSpinnerComponent,
  ],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.css',
})
export class CatalogPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly productsStore = inject(ProductsStore);
  readonly cartStore = inject(CartStore);
  readonly filterStore = inject(FilterStore);
  readonly categories = CATEGORIES;

  private readonly categoryParam = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('category') as ProductCategory | null)),
  );

  private readonly syncCategory = effect(() => {
    const category = this.categoryParam();
    if (category && CATEGORIES.some((c) => c.value === category)) {
      this.filterStore.setCategories([category]);
    }
  });

  readonly filteredProducts = computed(() => {
    let products = this.productsStore.entities();
    const query = this.filterStore.searchQuery().toLowerCase();
    const categories = this.filterStore.selectedCategories();
    const { min, max } = this.filterStore.priceRange();
    const sortBy = this.filterStore.sortBy();
    const sortOrder = this.filterStore.sortOrder();

    if (query) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query),
      );
    }

    if (categories.length > 0) {
      products = products.filter((p) => categories.includes(p.category));
    }

    products = products.filter((p) => p.price >= min && p.price <= max);

    const direction = sortOrder === 'asc' ? 1 : -1;
    products = [...products].sort((a, b) => {
      switch (sortBy) {
        case 'price': return direction * (a.price - b.price);
        case 'rating': return direction * (a.rating - b.rating);
        default: return direction * a.name.localeCompare(b.name);
      }
    });

    return products;
  });

  onAddToCart(product: Product) {
    this.cartStore.addItem(product);
  }
}
