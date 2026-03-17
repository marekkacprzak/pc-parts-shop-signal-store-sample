import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, debounceTime, distinctUntilChanged, tap } from 'rxjs';

import { ProductCategory } from '../models/product.model';
import { withLogger } from './features/with-logger';

/**
 * FilterStore — local store (no providedIn).
 * Provided in CatalogPageComponent's providers array to demonstrate local state management.
 *
 * Demonstrates:
 * - withState for plain state (not entities)
 * - withComputed for derived values (hasActiveFilters, activeFilterCount)
 * - withMethods for actions
 * - patchState for partial updates
 * - Local vs Global store pattern (compare with CartStore which is global)
 */
export type SortBy = 'name' | 'price' | 'rating';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  searchQuery: string;
  selectedCategories: ProductCategory[];
  priceRange: { min: number; max: number };
  sortBy: SortBy;
  sortOrder: SortOrder;
}

const initialState: FilterState = {
  searchQuery: '',
  selectedCategories: [],
  priceRange: { min: 0, max: 10000 },
  sortBy: 'name',
  sortOrder: 'asc',
};

export const FilterStore = signalStore(
  withState(initialState),
  withComputed(({ searchQuery, selectedCategories, priceRange }) => ({
    hasActiveFilters: computed(
      () => !!searchQuery() || selectedCategories().length > 0 || priceRange().min > 0 || priceRange().max < 10000,
    ),
    activeFilterCount: computed(() => {
      let count = 0;
      if (searchQuery()) count++;
      if (selectedCategories().length > 0) count++;
      if (priceRange().min > 0 || priceRange().max < 10000) count++;
      return count;
    }),
  })),
  withMethods((store) => ({
    setSearchQuery: rxMethod<string>(
      pipe(
        debounceTime(700),
        distinctUntilChanged(),
        tap((query) => patchState(store, { searchQuery: query })),
      ),
    ),
    setCategories(categories: ProductCategory[]) {
      patchState(store, { selectedCategories: categories });
    },
    setPriceRange(min: number, max: number) {
      patchState(store, { priceRange: { min, max } });
    },
    setSortBy(sortBy: SortBy) {
      patchState(store, { sortBy });
    },
    setSortOrder(sortOrder: SortOrder) {
      patchState(store, { sortOrder });
    },
    resetFilters() {
      patchState(store, initialState);
    },
  })),
  withLogger('FilterStore'),
);
