import {useState, useEffect} from "react";

type ColorScheme = "light" | "dark";

const STORAGE_KEY = "gmt-color-scheme";

const prefersDark = (): boolean =>
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches;

/** Stored preference wins; otherwise fall back to the OS setting, then light. */
const getInitialScheme = (): ColorScheme => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === "light" || stored === "dark") {
        return stored;
    }

    return prefersDark() ? "dark" : "light";
};

interface ColorSchemeControls {
    scheme: ColorScheme;
    toggle: () => void;
}

/**
 * Light/dark preference, persisted to localStorage and reflected as `data-theme` on the
 * document root (so `:root[data-theme="dark"]` overrides apply). Defaults to the OS setting
 * until the user makes an explicit choice.
 */
const useColorScheme = (): ColorSchemeControls => {
    const [scheme, setScheme] = useState<ColorScheme>(getInitialScheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", scheme);
    }, [scheme]);

    const toggle = () => {
        setScheme((current) => {
            const next: ColorScheme = current === "dark" ? "light" : "dark";
            localStorage.setItem(STORAGE_KEY, next);
            return next;
        });
    };

    return {scheme, toggle};
};

export {useColorScheme};
