import { Component, computed, effect, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatIcon, MatBadge],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly cartStore = inject(CartStore);

  readonly cartBadge = computed(() => {
    const count = this.cartStore.totalItems();
    return count > 99 ? '99+' : `${count}`;
  });

  private cartLogger = effect(() => {
    const items = this.cartStore.totalItems();
    const price = this.cartStore.totalPrice();
    console.log(`[Header] Cart updated: ${items} items, $${price.toFixed(2)} total`);
  });
}
