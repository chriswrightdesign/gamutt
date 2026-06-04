import {describe, it, expect, beforeEach} from "vitest";
import {convertToKebabCase, getPropsFromQueryString, setQueryFromState} from "./utils";

describe("convertToKebabCase", () => {
    it("lowercases and replaces whitespace with hyphens", () => {
        expect(convertToKebabCase("Primary Button")).toBe("primary-button");
    });
});

describe("getPropsFromQueryString", () => {
    beforeEach(() => {
        window.location.hash = "";
    });

    it("returns an empty object when there is no query string", () => {
        window.location.hash = "#/button/primary";
        expect(getPropsFromQueryString()).toEqual({});
    });

    it("coerces 'true'/'false' to booleans and keeps other values as strings", () => {
        window.location.hash = "#/x?hasIcon=true&isDismissible=false&label=Hello";
        expect(getPropsFromQueryString()).toEqual({
            hasIcon: true,
            isDismissible: false,
            label: "Hello",
        });
    });

    it("expands the `attributes` shorthand into individual boolean flags", () => {
        window.location.hash = "#/x?attributes=oat,soy";
        expect(getPropsFromQueryString()).toEqual({oat: true, soy: true});
    });

    it("decodes percent-encoded values", () => {
        window.location.hash = "#/x?label=Tom%20%26%20Jerry";
        expect(getPropsFromQueryString()).toEqual({label: "Tom & Jerry"});
    });
});

describe("setQueryFromState", () => {
    beforeEach(() => {
        window.location.hash = "#/x";
    });

    it("writes non-empty state, skipping empty and filtered keys", () => {
        setQueryFromState({state: {width: "100%", label: "", type: "default"}, filterKeys: ["type"]});

        const params = new URLSearchParams(window.location.hash.split("?")[1]);
        expect(params.get("width")).toBe("100%");
        expect(params.has("label")).toBe(false);
        expect(params.has("type")).toBe(false);
    });

    it("writes reservedState even when the same key is filtered out of state", () => {
        setQueryFromState({
            state: {"gmt-dock": "left-sidebar"},
            reservedState: {"gmt-dock": "footer"},
            filterKeys: ["gmt-dock"],
        });

        const params = new URLSearchParams(window.location.hash.split("?")[1]);
        expect(params.get("gmt-dock")).toBe("footer");
    });

    it("round-trips values containing reserved characters (regression: URL encoding)", () => {
        const state = {label: "Tom & Jerry = fun", width: "100%"};

        setQueryFromState({state});

        expect(getPropsFromQueryString()).toEqual(state);
    });
});
