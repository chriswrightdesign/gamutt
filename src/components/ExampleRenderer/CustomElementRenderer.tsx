import React, {useEffect, useMemo, useRef} from "react";
import {CustomElementExampleTarget, ExampleEvent, ExampleState} from "../../PreviewApp.types";
import {applyCustomElementBinding} from "./applyCustomElementBinding";

interface CustomElementRendererProps {
    target: CustomElementExampleTarget;
    controlState: ExampleState;
    onEvent?: (event: ExampleEvent) => void;
}

/** Renders a real custom element by tag name and binds the live control state to it imperatively. */
const CustomElementRenderer = ({target, controlState, onEvent}: CustomElementRendererProps): React.ReactElement => {
    const ref = useRef<HTMLElement>(null);

    // Register the element once (e.g. a side-effect import that calls customElements.define).
    useEffect(() => {
        target.register?.();
    }, [target]);

    // Surface every event the element dispatches (incl. non-bubbling CustomEvents) by intercepting its
    // dispatchEvent; restored on unmount.
    useEffect(() => {
        const element = ref.current;

        if (!element || !onEvent) {
            return;
        }

        const dispatch = element.dispatchEvent.bind(element);
        element.dispatchEvent = (event: Event): boolean => {
            onEvent({name: event.type, detail: event instanceof CustomEvent ? event.detail : undefined, time: Date.now()});
            return dispatch(event);
        };

        return () => {
            element.dispatchEvent = dispatch;
        };
    }, [onEvent]);

    const binding = useMemo(() => (target.bind ? target.bind(controlState) : {}), [target, controlState]);

    useEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        return applyCustomElementBinding(element, binding).cleanup;
    }, [binding]);

    const element = React.createElement(target.tagName, {ref}, binding.children);
    const wrapperClassName = target.wrapperClassName?.(controlState);

    return wrapperClassName ? <div className={wrapperClassName}>{element}</div> : element;
};

export {CustomElementRenderer};
