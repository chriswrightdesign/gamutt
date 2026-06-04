import {describe, it, expect, vi, beforeEach} from "vitest";
import {applyCustomElementBinding} from "./applyCustomElementBinding";

describe("applyCustomElementBinding", () => {
    let element: HTMLElement;

    beforeEach(() => {
        element = document.createElement("div");
    });

    it("sets an empty attribute for `true` and removes it for `false`/`undefined` (boolean-presence)", () => {
        applyCustomElementBinding(element, {attributes: {disabled: true}});
        expect(element.getAttribute("disabled")).toBe("");

        applyCustomElementBinding(element, {attributes: {disabled: false}});
        expect(element.hasAttribute("disabled")).toBe(false);

        element.setAttribute("hidden", "");
        applyCustomElementBinding(element, {attributes: {hidden: undefined}});
        expect(element.hasAttribute("hidden")).toBe(false);
    });

    it("stringifies non-boolean attribute values", () => {
        applyCustomElementBinding(element, {attributes: {type: "submit", tabindex: 0}});
        expect(element.getAttribute("type")).toBe("submit");
        expect(element.getAttribute("tabindex")).toBe("0");
    });

    it("assigns properties directly on the element", () => {
        applyCustomElementBinding(element, {properties: {value: {complex: true}}});
        expect(Reflect.get(element, "value")).toEqual({complex: true});
    });

    it("attaches event listeners and removes them via cleanup", () => {
        const handler = vi.fn();

        const {cleanup} = applyCustomElementBinding(element, {events: {"solar-button-focus": handler}});

        element.dispatchEvent(new Event("solar-button-focus"));
        expect(handler).toHaveBeenCalledTimes(1);

        cleanup();
        element.dispatchEvent(new Event("solar-button-focus"));
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it("removes the attributes it set on cleanup (so dropped keys don't linger)", () => {
        const {cleanup} = applyCustomElementBinding(element, {attributes: {type: "submit", disabled: true}});
        expect(element.getAttribute("type")).toBe("submit");

        cleanup();
        expect(element.hasAttribute("type")).toBe(false);
        expect(element.hasAttribute("disabled")).toBe(false);
    });
});
