import {describe, it, expect, beforeEach} from "vitest";
import React from "react";
import {render, screen, act} from "../test/test-utils";
import {PreviewApp} from ".";
import {ExampleComponent} from "./PreviewApp.types";

const examples: ExampleComponent[] = [
    {
        name: "Primary",
        category: "Buttons",
        component: () => <button>Primary button</button>,
        controlSetup: {controls: [], defaultState: {}},
    },
    {
        name: "Secondary",
        category: "Buttons",
        target: {type: "react", component: () => <button>Secondary button</button>},
        controlSetup: {controls: [], defaultState: {}},
    },
];

describe("PreviewApp", () => {
    beforeEach(() => {
        window.location.hash = "";
    });

    it("renders the landing page with a link per example at the root", () => {
        render(<PreviewApp examples={examples} />);

        expect(screen.getByRole("heading", {name: "Buttons"})).toBeInTheDocument();
        expect(screen.getByRole("link", {name: "Primary"})).toBeInTheDocument();
        expect(screen.getByRole("link", {name: "Secondary"})).toBeInTheDocument();
    });

    it("renders the matching example's demo page when the hash matches its path", () => {
        window.location.hash = "#/buttons/secondary";
        render(<PreviewApp examples={examples} />);

        expect(screen.getByText("Secondary button")).toBeInTheDocument();
        expect(screen.queryByRole("link", {name: "Primary"})).not.toBeInTheDocument();
    });

    it("navigates from the landing page to a demo when the hash changes", () => {
        render(<PreviewApp examples={examples} />);
        expect(screen.getByRole("link", {name: "Primary"})).toBeInTheDocument();

        act(() => {
            window.location.hash = "#/buttons/primary";
            window.dispatchEvent(new Event("hashchange"));
        });

        expect(screen.getByText("Primary button")).toBeInTheDocument();
        expect(screen.queryByRole("link", {name: "Secondary"})).not.toBeInTheDocument();
    });
});
