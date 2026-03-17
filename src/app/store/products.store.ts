import { inject } from '@angular/core';
import { signalStore, withHooks, withMethods } from '@ngrx/signals';
import { withEntities, setAllEntities } from '@ngrx/signals/entities';
import { patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { withRequestStatus } from './features/with-request-status';
import { withPagination } from './features/with-pagination';
import { withLogger } from './features/with-logger';

/**
 * ProductsStore — global store (providedIn: 'root')
 *
 * Demonstrates:
 * - signalStore() with withEntities<Product>
 * - Custom features composition: withRequestStatus, withPagination, withLogger
 * - withMethods with inject() in injection context (before return)
 * - rxMethod<string> with debounce + switchMap (accepts value, Signal, or Observable!)
 * - withHooks onInit for auto-loading
 * - patchState with setAllEntities
 */
export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withEntities<Product>(),
  withRequestStatus(),
  withPagination({ pageSize: 12 }),
  withMethods((store, productService = inject(ProductService)) => ({
    async loadAll() {
      store.setPending();
      try {
        const response = await fetch('/data/products.json');
        const products: Product[] = await response.json();
        patchState(store, setAllEntities(products));
        store.setFulfilled();
      } catch (e) {
        store.setError((e as Error).message);
      }
    },

    /**
     * rxMethod: factory that creates a function accepting:
     * - a plain string value
     * - a Signal<string>
     * - an Observable<string>
     *
     * Internally treats each call as an observable emission.
     * switchMap cancels previous HTTP request on new emission.
     */
    searchByQuery: rxMethod<string>(
      pipe(
        debounceTime(700),
        distinctUntilChanged(),
        tap(() => store.setPending()),
        switchMap((query) =>
          productService.search(query).pipe(
            tapResponse({
              next: (products) => {
                patchState(store, setAllEntities(products));
                store.setFulfilled();
              },
              error: (err) => {
                console.error('Search failed:', err);
                store.setError('Search failed');
              },
            }),
          ),
        ),
      ),
    ),
  })),
  withHooks({
    onInit(store) {
      store.loadAll();
    },
  }),
  withLogger('ProductsStore'),
);
