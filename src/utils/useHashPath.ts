import {useSyncExternalStore} from "react";

const subscribe = (callback: () => void): (() => void) => {
    window.addEventListener("hashchange", callback);

    return () => window.removeEventListener("hashchange", callback);
};

const getSnapshot = (): string => window.location.hash;

/**
 * Current route path from the URL hash. Mirrors HashRouter, which matched on pathname only —
 * the query (written by the controls via history.replaceState) must be stripped so it never
 * affects matching, and replaceState fires no `hashchange`, so control changes don't re-route.
 * "#/button/primary?foo=bar" → "/button/primary"; empty hash → "/".
 */
const useHashPath = (): string => {
    const hash = useSyncExternalStore(subscribe, getSnapshot);

    return hash.replace(/^#/, "").split("?")[0] || "/";
};

export {useHashPath};
