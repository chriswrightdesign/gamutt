import React from "react";
import {ExampleState, ExampleTarget} from "../../PreviewApp.types";
import {CustomElementRenderer} from "./CustomElementRenderer";

interface ExampleRendererProps {
    target: ExampleTarget;
    controlState: ExampleState;
}

/** Unreachable at runtime; gives the switch compile-time exhaustiveness over ExampleTarget. */
const assertNever = (value: never): never => {
    throw new Error(`[react-preview-app] unhandled example target: ${JSON.stringify(value)}`);
};

/** The pluggable renderer seam: chooses how to render an example from its target's discriminant. */
const ExampleRenderer = ({target, controlState}: ExampleRendererProps): React.JSX.Element => {
    switch (target.type) {
        case "react": {
            const Component = target.component;
            return <Component controlState={controlState} />;
        }
        case "custom-element":
            return <CustomElementRenderer target={target} controlState={controlState} />;
        default:
            return assertNever(target);
    }
};

export {ExampleRenderer};
