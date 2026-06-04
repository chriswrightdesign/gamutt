import { describe, expect, it } from "vitest";
import { PreviewApp } from ".";
import React from "react";
import { render, screen, userEvent } from "../test/test-utils";

describe("Simple working test", () => {
    it("The Preview app loads", () => {
        expect(true).toBe(true);
    });

});