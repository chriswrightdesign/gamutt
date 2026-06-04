import React from "react";

/** A single control's current value: a string/number id, a boolean toggle, or unset. */
export type ControlStateValue = string | number | boolean | undefined;

/** The live state of every control for an example, keyed by control id. */
export type ExampleState = Record<string, ControlStateValue>;

/** An event dispatched by a previewed custom element, surfaced in the events panel. */
export interface ExampleEvent {
    name: string;
    detail: unknown;
    time: number;
}

/** Runs when a control changes; returns extra state to merge in (e.g. to reset dependent controls). */
export type EnableRule = (
    event: React.FormEvent<HTMLInputElement | HTMLSelectElement>,
    state: ExampleState
) => Partial<ExampleState>;

export interface ControlValue {
    name: string;
    id: string | number;
    disableRule?: (exampleState: ExampleState) => boolean;
    enableRule?: EnableRule;
    hideOption?: (exampleState: ExampleState) => boolean;
}

export interface ExampleControl {
    name: string;
    id: string;
    type: "union" | "options" | "select" | "input" | "color";
    values: ControlValue[];
    /** Optional group heading; controls sharing a group render together in a collapsible section. */
    group?: string;
    disableRule?: (exampleState: ExampleState) => boolean;
    enableRule?: EnableRule;
    hideGroup?: (exampleState: ExampleState) => boolean;
    viewCategories?: string[];
    viewSubCategories?: string[];
}

/** A minimal subset of react-docgen-typescript's ComponentDoc — enough to derive controls from. */
export interface ComponentDoc {
    props: Record<
        string,
        {
            name: string;
            type: {name: string; value?: {value: string}[]};
            defaultValue?: {value: string} | null;
            required: boolean;
            description?: string;
        }
    >;
}

/** Minimal subset of a Custom Elements Manifest (custom-elements.json) used to derive controls. */
export interface ComponentManifest {
    modules: {
        declarations?: {
            kind: string;
            tagName?: string;
            members?: {kind: string; name: string; type?: {text: string}; default?: string; description?: string; privacy?: string}[];
            attributes?: {name: string; type?: {text: string}; default?: string; description?: string}[];
        }[];
    }[];
}

/** Options for auto-deriving controls from a target's metadata. */
export interface DeriveOptions {
    /** Derived control ids (prop names) to omit. */
    hide?: string[];
    /** react-docgen-typescript output for the component; required to derive React props (ignored for custom elements). */
    propsDoc?: ComponentDoc;
    /** Custom Elements Manifest; when provided, custom-element derivation uses it (richer: union options, descriptions). */
    manifest?: ComponentManifest;
}

export interface ControlSetup {
    controls?: ExampleControl[];
    defaultState?: ExampleState;
    /** Opt in to deriving controls from the target. `true` derives custom-element metadata at runtime; pass options to also derive React props (`propsDoc`) or `hide` derived ids. */
    derive?: boolean | DeriveOptions;
}

/** The curried change handler: `onSetProperty(type, id, enableRule?)` returns a control's onChange. */
export type OnSetProperty = (
    type: ExampleControl["type"],
    controlId: string,
    enableRule?: EnableRule
) => (event: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => void;

/** Builds a formatted code snippet from the live control state, or returns nothing when not applicable. */
export type CodeExample = (args: {controlState: ExampleState}) => string | undefined;

/** A previewed React component: receives the live control state as a prop. */
export type ExampleComponentType = React.ComponentType<{controlState: ExampleState}>;

/** Renders a React component, passing the live control state through as a prop. */
export interface ReactExampleTarget {
    type: "react";
    component: ExampleComponentType;
}

/** How a custom element is bound from the live control state on each render. */
export interface CustomElementBinding {
    /** Reflected as string attributes. `true` sets an empty attribute, `false`/`undefined` removes it, otherwise `String(value)`. */
    attributes?: Record<string, string | number | boolean | undefined>;
    /** Assigned as DOM properties — for non-reflected or non-string values. */
    properties?: Record<string, unknown>;
    /** Light-DOM children for the element's default slot. */
    children?: React.ReactNode;
    /** Event name → handler, attached with `addEventListener` and cleaned up on change/unmount. */
    events?: Record<string, (event: Event) => void>;
    /** CSS custom properties to set on the element (e.g. theme tokens); removed on cleanup. */
    cssProperties?: Record<string, string | undefined>;
}

/** A CSS custom property exposed as a live theme control. */
export interface CssPropControl {
    /** The custom property name, e.g. "--solar-interface-button-background". */
    name: string;
    /** Display label; defaults to a humanised form of `name`. */
    label?: string;
    /** "color" renders a colour input, "text" a text input. Defaults to "text". */
    kind?: "color" | "text";
    default?: string;
}

/** Renders a real custom element by tag name, binding control state to its attributes/properties/slots/events. */
export interface CustomElementExampleTarget {
    type: "custom-element";
    /** The registered tag name, e.g. `"solar-button"`. */
    tagName: string;
    /** Registers the element (e.g. a side-effect import that calls `customElements.define`); run once on mount. */
    register?: () => void | Promise<unknown>;
    /** Maps the live control state onto the element. */
    bind?: (controlState: ExampleState) => CustomElementBinding;
    /** Optional class for a wrapper element around the custom element — e.g. a themed backdrop. */
    wrapperClassName?: (controlState: ExampleState) => string;
    /** CSS custom properties to expose as live theme controls (ids = the `--var` names). */
    cssProps?: CssPropControl[];
}

/** What an example renders, and how — the pluggable renderer seam (React component vs custom element). */
export type ExampleTarget = ReactExampleTarget | CustomElementExampleTarget;

/** Where the controls panel docks relative to the component stage. */
export type DockPosition = "footer" | "right-sidebar" | "left-sidebar" | "detach";

export interface ExampleComponent {
    /** Explicit render target. When omitted, defaults to a React target built from `component`. */
    target?: ExampleTarget;
    /** Shorthand for a React example — same as `target: {type: "react", component}`. Optional, for backward compatibility. */
    component?: ExampleComponentType;
    cssCodeExample?: CodeExample;
    jsCodeExample?: CodeExample;
    htmlCodeExample?: CodeExample;
    name: string;
    controlSetup?: ControlSetup;
    category?: string;
    color?: string;
    description?: string;
}

/** An example decorated with its display name and category while grouping for the landing page. */
export interface DecoratedExample extends ExampleComponent {
    originalName: string;
    originalCategory: string;
}

export interface Category {
    name: string;
    color?: string;
    originalName: string;
    originalCategory: string;
    controlSetup: ControlSetup;
    target: ExampleTarget;
}
