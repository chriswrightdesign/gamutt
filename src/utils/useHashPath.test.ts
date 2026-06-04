import {describe, it, expect, beforeEach} from "vitest";
import {renderHook, act} from "../../test/test-utils";
import {useHashPath} from "./useHashPath";

describe("useHashPath", () => {
    beforeEach(() => {
        window.location.hash = "";
    });

    it("defaults to '/' when the hash is empty", () => {
        const {result} = renderHook(() => useHashPath());
        expect(result.current).toBe("/");
    });

    it("strips the leading # and any query string", () => {
        window.location.hash = "#/button/primary?foo=bar";
        const {result} = renderHook(() => useHashPath());
        expect(result.current).toBe("/button/primary");
    });

    it("updates when the hash changes", () => {
        const {result} = renderHook(() => useHashPath());
        expect(result.current).toBe("/");

        act(() => {
            window.location.hash = "#/avatar/default";
            window.dispatchEvent(new Event("hashchange"));
        });

        expect(result.current).toBe("/avatar/default");
    });
});
