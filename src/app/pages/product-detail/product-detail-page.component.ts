import { Component, computed, inject, input, linkedSignal, resource, viewChild, ElementRef } from '@angular/core';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

import { Product } from '../../models/product.model';
import { CartStore } from '../../store/cart.store';
import { LoadingSpinnerComponent } from '../../components/shared/loading-spinner.component';

@Component({
  selector: 'app-product-detail-page',
  imports: [
    CurrencyPipe, UpperCasePipe, RouterLink,
    MatIcon,
    LoadingSpinnerComponent,
  ],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.css',
})
export class ProductDetailPageComponent {
  private readonly cartStore = inject(CartStore);

  id = input.required<string>();

  productResource = resource({
    params: () => ({ id: Number(this.id()) }),
    loader: async ({ params, abortSignal }): Promise<Product> => {
      const response = await fetch('/data/products.json', { signal: abortSignal });
      const products: Product[] = await response.json();
      const product = products.find((p) => p.id === params.id);
      if (!product) throw new Error(`Product ${params.id} not found`);
      return product;
    },
  });

  selectedImage = linkedSignal(() => this.productResource.value()?.imageUrl ?? '');

  selectedQuantity = linkedSignal<Product | undefined, number>({
    source: () => this.productResource.value(),
    computation: (product, previous) => {
      if (previous?.source?.id === product?.id) return previous!.value;
      return 1;
    },
  });

  imageSection = viewChild<ElementRef>('imageSection');

  specEntries = computed(() => {
    const product = this.productResource.value();
    return product ? Object.entries(product.specs) : [];
  });

  totalPrice = computed(() => {
    const product = this.productResource.value();
    return product ? product.price * this.selectedQuantity() : 0;
  });

  incrementQty() { this.selectedQuantity.update((q) => q + 1); }
  decrementQty() { this.selectedQuantity.update((q) => Math.max(1, q - 1)); }

  addToCart() {
    const product = this.productResource.value();
    if (product) this.cartStore.addItem(product, this.selectedQuantity());
  }
}
