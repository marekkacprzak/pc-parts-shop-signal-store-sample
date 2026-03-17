import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  {
    path: 'catalog',
    loadComponent: () =>
      import('./pages/catalog/catalog-page.component').then((m) => m.CatalogPageComponent),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail-page.component').then(
        (m) => m.ProductDetailPageComponent,
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart-page.component').then((m) => m.CartPageComponent),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout-page.component').then((m) => m.CheckoutPageComponent),
  },
  {
    path: 'compare',
    loadComponent: () =>
      import('./pages/comparison/comparison-page.component').then(
        (m) => m.ComparisonPageComponent,
      ),
  },
  {
    path: 'order-confirmation',
    loadComponent: () =>
      import('./pages/order-confirmation/order-confirmation-page.component').then(
        (m) => m.OrderConfirmationPageComponent,
      ),
  },
];
