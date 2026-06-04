import {CustomElementBinding} from "../../PreviewApp.types";

/** Reflects one attribute using boolean-presence semantics (so Lit's `?attr` reads correctly). */
const applyAttribute = (element: HTMLElement, name: string, value: string | number | boolean | undefined): void => {
    if (value === undefined || value === false) {
        element.removeAttribute(name);
        return;
    }

    element.setAttribute(name, value === true ? "" : String(value));
};

export interface AppliedBinding {
    /** Reverts this binding (removes the attributes it set and detaches its event listeners); call before re-applying and on unmount. */
    cleanup: () => void;
}

/**
 * Imperatively binds control state to a custom element. Done via the DOM rather than JSX props so the
 * behaviour is identical across React 18 and 19, which disagree on how custom-element props map to
 * attributes vs properties. Attributes use boolean-presence semantics; properties are assigned directly
 * (via `Reflect.set`, so Lit picks up complex/non-reflected values); events are attached with `addEventListener`.
 */
export const applyCustomElementBinding = (element: HTMLElement, binding: CustomElementBinding): AppliedBinding => {
    const attributeEntries = Object.entries(binding.attributes ?? {});

    attributeEntries.forEach(([name, value]) => {
        applyAttribute(element, name, value);
    });

    Object.entries(binding.properties ?? {}).forEach(([name, value]) => {
        Reflect.set(element, name, value);
    });

    const cssPropertyEntries = Object.entries(binding.cssProperties ?? {});

    cssPropertyEntries.forEach(([name, value]) => {
        if (value === undefined || value === "") {
            element.style.removeProperty(name);
        } else {
            element.style.setProperty(name, value);
        }
    });

    const events = Object.entries(binding.events ?? {});

    events.forEach(([name, handler]) => {
        element.addEventListener(name, handler);
    });

    return {
        cleanup: () => {
            // Remove the attributes this binding set so any dropped on the next render don't linger.
            attributeEntries.forEach(([name]) => {
                element.removeAttribute(name);
            });
            cssPropertyEntries.forEach(([name]) => {
                element.style.removeProperty(name);
            });
            events.forEach(([name, handler]) => {
                element.removeEventListener(name, handler);
            });
        },
    };
};
