import {describe, it, expect, beforeAll} from "vitest";
import {deriveControls, mergeControls, resolveControlSetup} from "./deriveControls";
import type {ComponentDoc, ExampleControl, ExampleTarget} from "../PreviewApp.types";

// A Lit-like element: static elementProperties Map + instance default fields.
class LitLikeElement extends HTMLElement {
    static elementProperties = new Map<PropertyKey, {type?: unknown; state?: boolean}>([
        ["disabled", {type: Boolean}],
        ["type", {type: String}],
        ["count", {type: Number}],
        ["internal", {type: String, state: true}],
    ]);
    disabled = false;
    type = "button";
    count = 3;
    internal = "x";
}

// A vanilla element: observedAttributes only, no types.
class VanillaElement extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["foo", "bar"];
    }
}

beforeAll(() => {
    if (!customElements.get("lit-like")) {
        customElements.define("lit-like", LitLikeElement);
    }
    if (!customElements.get("vanilla-el")) {
        customElements.define("vanilla-el", VanillaElement);
    }
});

const ce = (tagName: string): ExampleTarget => ({type: "custom-element", tagName});

describe("deriveControls — custom elements", () => {
    it("groups booleans under Attributes, makes string/number inputs, reads instance defaults, skips @state", () => {
        const {controls, defaultState} = deriveControls(ce("lit-like"));

        const attributes = controls.find((control) => control.id === "attributes");
        expect(attributes?.type).toBe("options");
        expect(attributes?.values.map((value) => value.id)).toEqual(["disabled"]);
        expect(controls.map((control) => control.id).sort()).toEqual(["attributes", "count", "type"]);
        expect(controls.find((control) => control.id === "type")?.type).toBe("input");
        expect(defaultState).toMatchObject({disabled: false, type: "button", count: 3});
        expect(defaultState).not.toHaveProperty("internal");
    });

    it("falls back to observedAttributes (as inputs) for vanilla elements", () => {
        const {controls} = deriveControls(ce("vanilla-el"));
        expect(controls.map((control) => control.id)).toEqual(["foo", "bar"]);
        expect(controls.every((control) => control.type === "input")).toBe(true);
    });

    it("hides derived ids — top-level controls and booleans inside the Attributes group", () => {
        const {controls} = deriveControls(ce("lit-like"), {hide: ["type", "disabled"]});
        expect(controls.map((control) => control.id)).toEqual(["count"]);
    });

    it("returns nothing for an unregistered tag", () => {
        expect(deriveControls(ce("not-registered")).controls).toEqual([]);
    });
});

describe("deriveControls — React docgen", () => {
    const propsDoc: ComponentDoc = {
        props: {
            variant: {
                name: "variant",
                required: false,
                type: {name: "enum", value: [{value: "'primary'"}, {value: "'ghost'"}]},
                defaultValue: {value: "'primary'"},
            },
            disabled: {name: "disabled", required: false, type: {name: "boolean"}, defaultValue: {value: "false"}},
        },
    };
    const reactTarget: ExampleTarget = {type: "react", component: () => null};

    it("maps enums to selects and booleans to the Attributes group, parsing defaults", () => {
        const {controls, defaultState} = deriveControls(reactTarget, {propsDoc});
        const variant = controls.find((control) => control.id === "variant");
        expect(variant?.type).toBe("select");
        expect(variant?.values.map((value) => value.id)).toEqual(["primary", "ghost"]);
        expect(defaultState).toMatchObject({variant: "primary", disabled: false});
    });
});

describe("mergeControls", () => {
    it("merges custom fields onto a derived control of the same id, keeping unspecified fields", () => {
        const derived: ExampleControl[] = [{name: "Type", id: "type", type: "input", values: []}];
        const custom: ExampleControl[] = [{name: "Type", id: "type", type: "select", values: [{name: "A", id: "a"}]}];
        const [merged] = mergeControls(derived, custom);
        expect(merged).toMatchObject({name: "Type", id: "type", type: "select"});
        expect(merged.values.map((value) => value.id)).toEqual(["a"]);
    });

    it("appends custom controls with new ids", () => {
        const merged = mergeControls([], [{name: "Extra", id: "extra", type: "input", values: []}]);
        expect(merged.map((control) => control.id)).toEqual(["extra"]);
    });
});

describe("resolveControlSetup", () => {
    it("passes through unchanged when derive is off", () => {
        const controls: ExampleControl[] = [{name: "X", id: "x", type: "input", values: []}];
        expect(resolveControlSetup(ce("lit-like"), {controls, defaultState: {x: "1"}})).toEqual({
            controls,
            defaultState: {x: "1"},
        });
    });

    it("derives + merges custom controls and lets explicit defaultState win when derive is on", () => {
        const {controls, defaultState} = resolveControlSetup(ce("lit-like"), {
            derive: true,
            controls: [{name: "Type", id: "type", type: "select", values: [{name: "Button", id: "button"}]}],
            defaultState: {type: "button"},
        });
        expect(controls.find((control) => control.id === "type")?.type).toBe("select");
        expect(defaultState.type).toBe("button");
        expect(defaultState).toHaveProperty("disabled");
    });
});
