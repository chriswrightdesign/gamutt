import {describe, it, expect} from "vitest";
import {findDeclaration, parseUnionLiterals} from "./cem";
import type {ComponentManifest} from "../PreviewApp.types";

const manifest: ComponentManifest = {
    modules: [
        {declarations: [{kind: "variable"}]},
        {
            declarations: [
                {
                    kind: "class",
                    tagName: "demo-badge",
                    members: [{kind: "field", name: "variant", type: {text: "'a' | 'b'"}}],
                },
            ],
        },
    ],
};

describe("findDeclaration", () => {
    it("finds the class declaration matching a tag name", () => {
        expect(findDeclaration(manifest, "demo-badge")?.tagName).toBe("demo-badge");
    });

    it("returns undefined when no class matches", () => {
        expect(findDeclaration(manifest, "nope")).toBeUndefined();
    });
});

describe("parseUnionLiterals", () => {
    it("extracts string-literal members from a union type", () => {
        expect(parseUnionLiterals("'info' | 'success' | 'warning'")).toEqual(["info", "success", "warning"]);
    });

    it("ignores non-literal members like undefined", () => {
        expect(parseUnionLiterals("'a' | 'b' | undefined")).toEqual(["a", "b"]);
    });

    it("returns undefined for non-unions (single literal, primitives, empty)", () => {
        expect(parseUnionLiterals("boolean")).toBeUndefined();
        expect(parseUnionLiterals("'only'")).toBeUndefined();
        expect(parseUnionLiterals(undefined)).toBeUndefined();
    });
});
