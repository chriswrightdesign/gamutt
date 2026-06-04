import {ComponentManifest} from "../PreviewApp.types";

export type ManifestDeclaration = NonNullable<ComponentManifest["modules"][number]["declarations"]>[number];

/** Finds the custom-element class declaration for a tag within a manifest. */
export const findDeclaration = (manifest: ComponentManifest, tagName: string): ManifestDeclaration | undefined => {
    for (const module of manifest.modules) {
        for (const declaration of module.declarations ?? []) {
            if (declaration.kind === "class" && declaration.tagName === tagName) {
                return declaration;
            }
        }
    }
    return undefined;
};

/** Parses a TS type text like `'a' | 'b' | undefined` into its string-literal members (or undefined). */
export const parseUnionLiterals = (text: string | undefined): string[] | undefined => {
    if (!text) {
        return undefined;
    }
    const literals = text
        .split("|")
        .map((part) => part.trim())
        .filter((part) => /^['"].*['"]$/.test(part))
        .map((part) => part.replace(/^['"]|['"]$/g, ""));

    return literals.length >= 2 ? literals : undefined;
};
