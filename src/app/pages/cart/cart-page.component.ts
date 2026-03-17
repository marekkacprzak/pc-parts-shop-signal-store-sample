import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, RouterLink, MatIcon],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css',
})
export class CartPageComponent {
  readonly cartStore = inject(CartStore);
}
