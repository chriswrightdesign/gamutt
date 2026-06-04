import {describe, it, expect, vi, afterEach} from "vitest";
import React from "react";
import {render, screen} from "../../../test/test-utils";
import {ErrorBoundary} from "./ErrorBoundary";

const Boom = (): React.JSX.Element => {
    throw new Error("boom");
};

describe("ErrorBoundary", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders children when they don't throw", () => {
        render(
            <ErrorBoundary>
                <span>all good</span>
            </ErrorBoundary>
        );
        expect(screen.getByText("all good")).toBeInTheDocument();
    });

    it("renders an inline fallback (with the message) when a child throws", () => {
        // React logs caught errors to console.error; silence it for a clean test run.
        vi.spyOn(console, "error").mockImplementation(() => {});

        render(
            <ErrorBoundary>
                <Boom />
            </ErrorBoundary>
        );

        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByText("boom")).toBeInTheDocument();
    });
});
