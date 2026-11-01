"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** False during the server render and hydration, true afterwards, once saved data is readable. */
export const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
