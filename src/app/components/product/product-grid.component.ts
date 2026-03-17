import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { Product } from '../../models/product.model';
import { ProductCardComponent } from './product-card.component';

@Component({
  selector: 'app-product-grid',
  imports: [ProductCardComponent, MatIcon],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.css',
})
export class ProductGridComponent {
  products = input.required<Product[]>();
  addToCart = output<Product>();
}
