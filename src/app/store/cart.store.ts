import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import {
  withEntities,
  addEntity,
  removeEntity,
  updateEntity,
  removeAllEntities,
} from '@ngrx/signals/entities';
import { patchState } from '@ngrx/signals';

import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { withLogger } from './features/with-logger';

/**
 * CartStore — global (providedIn: 'root') because cart must survive navigation.
 *
 * Demonstrates:
 * - withEntities<CartItem> for entity management
 * - withComputed for derived totals (totalItems, totalPrice, isEmpty)
 * - withMethods with entity updaters (addEntity, removeEntity, updateEntity, removeAllEntities)
 * - patchState for partial updates (only update quantity, not the whole entity)
 */
export const CartStore = signalStore(
  { providedIn: 'root' },
  withEntities<CartItem>(),
  withComputed(({ entities }) => ({
    totalItems: computed(() => entities().reduce((sum, item) => sum + item.quantity, 0)),
    totalPrice: computed(() =>
      entities().reduce((sum, item) => sum + item.price * item.quantity, 0),
    ),
    isEmpty: computed(() => entities().length === 0),
  })),
  withMethods((store) => ({
    addItem(product: Product, quantity = 1) {
      const existing = store.entityMap()[product.id];
      if (existing) {
        patchState(
          store,
          updateEntity({
            id: product.id,
            changes: { quantity: existing.quantity + quantity },
          }),
        );
      } else {
        patchState(
          store,
          addEntity({
            id: product.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            imageUrl: product.imageUrl,
          }),
        );
      }
    },
    removeItem(id: number) {
      patchState(store, removeEntity(id));
    },
    updateQuantity(id: number, quantity: number) {
      if (quantity <= 0) {
        patchState(store, removeEntity(id));
      } else {
        patchState(store, updateEntity({ id, changes: { quantity } }));
      }
    },
    clearCart() {
      patchState(store, removeAllEntities());
    },
  })),
  withLogger('CartStore'),
);
