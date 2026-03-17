import { effect } from '@angular/core';
import { getState, signalStoreFeature, withHooks } from '@ngrx/signals';

/**
 * Custom signalStoreFeature: logs state changes via effect().
 * Reusable across any signal store — just plug `withLogger('StoreName')`.
 *
 * Pattern from Rainer Hahnekamp's presentation:
 * - signalStoreFeature uses the same withHooks/withState/withMethods API
 * - effect() inside onInit auto-tracks all state reads
 */
export function withLogger(name: string) {
  return signalStoreFeature(
    withHooks({
      onInit(store) {
        effect(() => {
          const state = getState(store);
          console.log(`[${name}] state changed`, state);
        });
      },
    }),
  );
}
