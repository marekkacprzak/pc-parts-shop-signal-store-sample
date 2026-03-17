import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withMethods, withState } from '@ngrx/signals';
import { patchState } from '@ngrx/signals';

export type RequestStatus = 'idle' | 'pending' | 'fulfilled' | { error: string };
export type RequestStatusState = { requestStatus: RequestStatus };

/**
 * Custom signalStoreFeature: tracks async request status.
 * Adds: requestStatus state + isPending/isFulfilled/error computed + setter methods.
 *
 * Usage:
 *   signalStore(
 *     withRequestStatus(),
 *     withMethods((store) => ({
 *       async load() {
 *         store.setPending();
 *         try {
 *           // ...load data
 *           store.setFulfilled();
 *         } catch (e) { store.setError(e.message); }
 *       }
 *     }))
 *   )
 */
export function withRequestStatus() {
  return signalStoreFeature(
    withState<RequestStatusState>({ requestStatus: 'idle' }),
    withComputed(({ requestStatus }) => ({
      isPending: computed(() => requestStatus() === 'pending'),
      isFulfilled: computed(() => requestStatus() === 'fulfilled'),
      error: computed(() => {
        const status = requestStatus();
        return typeof status === 'object' ? status.error : null;
      }),
    })),
    withMethods((store) => ({
      setPending() {
        patchState(store, { requestStatus: 'pending' as RequestStatus });
      },
      setFulfilled() {
        patchState(store, { requestStatus: 'fulfilled' as RequestStatus });
      },
      setError(error: string) {
        patchState(store, { requestStatus: { error } as RequestStatus });
      },
    })),
  );
}
