import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withMethods, withState } from '@ngrx/signals';
import { patchState } from '@ngrx/signals';

export type PaginationState = {
  currentPage: number;
  pageSize: number;
};

/**
 * Custom signalStoreFeature: pagination logic.
 * Works with any entity store — computes totalPages and paginates entities.
 *
 * Note: requires the store to have an `entities` signal (from withEntities).
 */
export function withPagination(config: { pageSize: number } = { pageSize: 12 }) {
  return signalStoreFeature(
    withState<PaginationState>({
      currentPage: 1,
      pageSize: config.pageSize,
    }),
    withComputed((store) => {
      const entities = (store as Record<string, unknown>)['entities'] as
        | (() => unknown[])
        | undefined;

      return {
        totalPages: computed(() => {
          if (!entities) return 0;
          return Math.ceil(entities().length / store.pageSize());
        }),
        offset: computed(() => (store.currentPage() - 1) * store.pageSize()),
      };
    }),
    withMethods((store) => ({
      nextPage() {
        patchState(store, (s) => ({
          currentPage: Math.min(s.currentPage + 1, Math.ceil(100 / s.pageSize)),
        }));
      },
      prevPage() {
        patchState(store, (s) => ({
          currentPage: Math.max(s.currentPage - 1, 1),
        }));
      },
      setPage(page: number) {
        patchState(store, { currentPage: page });
      },
      setPageSize(size: number) {
        patchState(store, { pageSize: size, currentPage: 1 });
      },
    })),
  );
}
