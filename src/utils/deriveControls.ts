import {
    ComponentDoc,
    ControlSetup,
    ControlStateValue,
    CssPropControl,
    DeriveOptions,
    ExampleControl,
    ExampleState,
    ExampleTarget,
} from "../PreviewApp.types";
import {findDeclaration, ManifestDeclaration, parseUnionLiterals} from "./cem";

type DerivedKind = "boolean" | "number" | "string" | "enum";

interface DerivedProp {
    name: string;
    kind: DerivedKind;
    options?: string[];
    defaultValue?: ControlStateValue;
}

/** Title-cases a prop name for display, e.g. "hasIcon" → "Has icon". */
const titleCase = (name: string): string => {
    const spaced = name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[-_]+/g, " ");
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

const stripQuotes = (value: string): string => value.replace(/^['"]|['"]$/g, "");

// --- Custom elements: read metadata off the registered class at runtime ---

interface LitLikeConstructor extends CustomElementConstructor {
    elementProperties?: Map<PropertyKey, {type?: unknown; state?: boolean}>;
    observedAttributes?: string[];
}

const coerceDefault = (value: unknown, kind: DerivedKind): ControlStateValue => {
    if (value === undefined || value === null) {
        return undefined;
    }
    if (kind === "boolean") {
        return Boolean(value);
    }
    if (kind === "number") {
        return typeof value === "number" ? value : undefined;
    }
    return typeof value === "string" ? value : String(value);
};

const deriveFromCustomElement = (tagName: string): DerivedProp[] => {
    if (typeof customElements === "undefined") {
        return [];
    }

    const ElementClass = customElements.get(tagName) as LitLikeConstructor | undefined;
    if (!ElementClass) {
        return [];
    }

    let instance: Element | undefined;
    try {
        instance = document.createElement(tagName);
    } catch {
        instance = undefined;
    }

    const readDefault = (name: string, kind: DerivedKind): ControlStateValue =>
        instance ? coerceDefault(Reflect.get(instance, name), kind) : undefined;

    const props: DerivedProp[] = [];
    const litProps = ElementClass.elementProperties;

    if (litProps && typeof litProps.forEach === "function") {
        litProps.forEach((declaration, key) => {
            if (declaration && declaration.state) {
                return; // skip @state (internal reactive state)
            }
            const name = String(key);
            const kind: DerivedKind =
                declaration?.type === Boolean ? "boolean" : declaration?.type === Number ? "number" : "string";
            props.push({name, kind, defaultValue: readDefault(name, kind)});
        });
    } else if (Array.isArray(ElementClass.observedAttributes)) {
        ElementClass.observedAttributes.forEach((attribute) => {
            props.push({name: attribute, kind: "string", defaultValue: readDefault(attribute, "string")});
        });
    }

    return props;
};

// --- React: read metadata from react-docgen-typescript output ---

const parseDocgenDefault = (raw: string | undefined, kind: DerivedKind): ControlStateValue => {
    if (raw === undefined || raw === "undefined" || raw === "null") {
        return undefined;
    }
    if (kind === "boolean") {
        return raw === "true";
    }
    if (kind === "number") {
        const parsed = Number(raw);
        return Number.isNaN(parsed) ? undefined : parsed;
    }
    return stripQuotes(raw);
};

const deriveFromDocgen = (doc: ComponentDoc): DerivedProp[] =>
    Object.values(doc.props).map((prop) => {
        const typeName = prop.type?.name;
        const rawDefault = prop.defaultValue?.value;

        if (typeName === "boolean") {
            return {name: prop.name, kind: "boolean", defaultValue: parseDocgenDefault(rawDefault, "boolean")};
        }
        if (typeName === "enum" && prop.type.value) {
            const options = prop.type.value
                .map((member) => stripQuotes(member.value))
                .filter((value) => value !== "undefined");
            return {name: prop.name, kind: "enum", options, defaultValue: parseDocgenDefault(rawDefault, "string")};
        }
        if (typeName === "number") {
            return {name: prop.name, kind: "number", defaultValue: parseDocgenDefault(rawDefault, "number")};
        }
        return {name: prop.name, kind: "string", defaultValue: parseDocgenDefault(rawDefault, "string")};
    });

// --- Custom Elements Manifest: richer than runtime metadata (real union options, descriptions) ---

const deriveFromManifest = (declaration: ManifestDeclaration): DerivedProp[] => {
    const members = (declaration.members ?? []).filter(
        (member) => member.kind === "field" && member.privacy !== "private" && member.privacy !== "protected"
    );

    return members.reduce<DerivedProp[]>((derived, member) => {
        const typeText = member.type?.text;
        const options = parseUnionLiterals(typeText);

        if (options) {
            derived.push({name: member.name, kind: "enum", options, defaultValue: parseDocgenDefault(member.default, "string")});
        } else if (typeText === "boolean") {
            derived.push({name: member.name, kind: "boolean", defaultValue: parseDocgenDefault(member.default, "boolean")});
        } else if (typeText === "number") {
            derived.push({name: member.name, kind: "number", defaultValue: parseDocgenDefault(member.default, "number")});
        } else if (typeText === "string") {
            derived.push({name: member.name, kind: "string", defaultValue: parseDocgenDefault(member.default, "string")});
        }
        // Anything else (e.g. @query element refs like HTMLButtonElement) has no sensible control — skip it.
        return derived;
    }, []);
};

// --- Shared: DerivedProp[] → controls + default state ---

const toControls = (props: DerivedProp[]): {controls: ExampleControl[]; defaultState: ExampleState} => {
    const defaultState: ExampleState = {};
    const controls: ExampleControl[] = [];

    const booleanProps = props.filter((prop) => prop.kind === "boolean");
    if (booleanProps.length > 0) {
        controls.push({
            name: "Attributes",
            id: "attributes",
            type: "options",
            values: booleanProps.map((prop) => ({name: titleCase(prop.name), id: prop.name})),
        });
        booleanProps.forEach((prop) => {
            defaultState[prop.name] = Boolean(prop.defaultValue);
        });
    }

    props
        .filter((prop) => prop.kind !== "boolean")
        .forEach((prop) => {
            if (prop.kind === "enum" && prop.options && prop.options.length > 0) {
                controls.push({
                    name: titleCase(prop.name),
                    id: prop.name,
                    type: "select",
                    values: prop.options.map((option) => ({name: option, id: option})),
                });
            } else {
                controls.push({name: titleCase(prop.name), id: prop.name, type: "input", values: []});
            }
            if (prop.defaultValue !== undefined) {
                defaultState[prop.name] = prop.defaultValue;
            }
        });

    return {controls, defaultState};
};

const applyHide = (controls: ExampleControl[], hide: string[]): ExampleControl[] => {
    if (hide.length === 0) {
        return controls;
    }
    const hidden = new Set(hide);
    return controls
        .map((control) =>
            control.type === "options"
                ? {...control, values: control.values.filter((value) => !hidden.has(String(value.id)))}
                : control
        )
        .filter((control) => !hidden.has(control.id) && !(control.type === "options" && control.values.length === 0));
};

/** Derives controls + default state from a target's metadata (custom-element runtime, or React docgen via `propsDoc`). */
export const deriveControls = (
    target: ExampleTarget,
    options: DeriveOptions = {}
): {controls: ExampleControl[]; defaultState: ExampleState} => {
    let props: DerivedProp[] = [];

    if (target.type === "custom-element") {
        const declaration = options.manifest ? findDeclaration(options.manifest, target.tagName) : undefined;
        props = declaration ? deriveFromManifest(declaration) : deriveFromCustomElement(target.tagName);
    } else if (target.type === "react" && options.propsDoc) {
        props = deriveFromDocgen(options.propsDoc);
    }

    const {controls, defaultState} = toControls(props);
    return {controls: applyHide(controls, options.hide ?? []), defaultState};
};

/** Merges author controls onto derived ones: matching ids merge fields (author wins), new ids append. */
export const mergeControls = (derived: ExampleControl[], custom: ExampleControl[]): ExampleControl[] => {
    const merged = [...derived];

    custom.forEach((control) => {
        const index = merged.findIndex((existing) => existing.id === control.id);
        if (index >= 0) {
            merged[index] = {...merged[index], ...control};
        } else {
            merged.push(control);
        }
    });

    return merged;
};

/** Resolves the final controls + default state for an example, applying derivation + merge when `derive` is set. */
/** Builds a "Theme" control (one per declared CSS custom property) for a custom-element target. */
const cssPropsToControls = (cssProps: CssPropControl[]): {controls: ExampleControl[]; defaultState: ExampleState} => {
    const defaultState: ExampleState = {};
    const controls = cssProps.map((prop): ExampleControl => {
        if (prop.default !== undefined) {
            defaultState[prop.name] = prop.default;
        }
        return {
            name: prop.label ?? prop.name,
            id: prop.name,
            type: prop.kind === "color" ? "color" : "input",
            values: [],
            group: "Theme",
        };
    });
    return {controls, defaultState};
};

export const resolveControlSetup = (
    target: ExampleTarget,
    controlSetup: ControlSetup
): {controls: ExampleControl[]; defaultState: ExampleState} => {
    let controls = controlSetup.controls ?? [];
    let defaultState = controlSetup.defaultState ?? {};

    if (controlSetup.derive) {
        const options = controlSetup.derive === true ? {} : controlSetup.derive;
        const derived = deriveControls(target, options);
        controls = mergeControls(derived.controls, controls);
        defaultState = {...derived.defaultState, ...defaultState};
    }

    if (target.type === "custom-element" && target.cssProps && target.cssProps.length > 0) {
        const theme = cssPropsToControls(target.cssProps);
        controls = [...controls, ...theme.controls];
        defaultState = {...theme.defaultState, ...defaultState};
    }

    return {controls, defaultState};
};
