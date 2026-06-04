import {useState, useEffect} from "react";
import {getPropsFromQueryString, setQueryFromState} from "./utils";
import {ExampleControl, ExampleState, DockPosition, OnSetProperty} from "../PreviewApp.types";

interface UseQueryStateArgs {
    controls?: ExampleControl[];
    defaultState?: ExampleState;
    hasSidebarControls: boolean;
    /** Drag state is in the write effect's deps so the URL re-syncs around a drag, matching prior behaviour. */
    isDragging: boolean;
}

interface QueryState {
    exampleState: ExampleState;
    onSetProperty: OnSetProperty;
    controlsDockPosition: DockPosition;
    setControlsDockPosition: (position: DockPosition) => void;
}

/** Owns the control state that's mirrored to/from the URL hash query (for deep-linking and refresh). */
const useQueryState = ({controls, defaultState, hasSidebarControls, isDragging}: UseQueryStateArgs): QueryState => {
    const [exampleState, setExampleState] = useState<ExampleState>(defaultState ?? {});

    const [controlsDockPosition, setControlsDockPosition] = useState<DockPosition>("right-sidebar");

    // On mount, hydrate state from the query string (deep links / refresh).
    useEffect(() => {
        const queryProps = getPropsFromQueryString();

        if (!controls) {
            return;
        }

        const allowedProps = controls.reduce<string[]>((acc, curr) => {
            if (curr.type === "options") {
                return [...acc, ...curr.values.map((value) => String(value.id))];
            }

            return [...acc, curr.id];
        }, []);

        const queryState = allowedProps.reduce<ExampleState>((acc, curr) => {
            const propValue = queryProps[curr];

            if (propValue === undefined) {
                return acc;
            }

            return {...acc, [curr]: propValue};
        }, {});

        setExampleState((current) => ({...current, ...queryState}));

        const rpaDock = queryProps["gmt-dock"];
        setControlsDockPosition(
            rpaDock === "footer" || rpaDock === "left-sidebar" || rpaDock === "detach" ? rpaDock : "right-sidebar"
        );
    }, []);

    // Mirror state back into the query as it changes.
    useEffect(() => {
        if (!controls) {
            return;
        }

        const reservedState = hasSidebarControls ? {"gmt-dock": controlsDockPosition} : {};

        setQueryFromState({
            state: exampleState,
            reservedState,
            filterKeys: [
                "gmt-pos-x",
                "gmt-pos-y",
                "gmt-dock",
                "errorMessage",
                "label",
                "placeholderText",
                "description",
                "placeholder",
            ],
        });
    }, [exampleState, controlsDockPosition, isDragging]);

    const onSetProperty: OnSetProperty = (type, controlId, enableRule) => (event) => {
        const enableRuleState = enableRule ? enableRule(event, exampleState) : {};

        if (type === "select") {
            const newState = {
                ...exampleState,
                [controlId]: event.currentTarget.value,
            };

            setExampleState({...newState, ...enableRuleState});
            return;
        }

        const {currentTarget} = event;

        if (type === "input") {
            setExampleState({...exampleState, [controlId]: currentTarget.value, ...enableRuleState});
            return;
        }

        if (type === "union") {
            setExampleState({...exampleState, [controlId]: currentTarget.id, ...enableRuleState});
            return;
        }

        if (type === "options") {
            setExampleState({...exampleState, [currentTarget.id]: !exampleState[currentTarget.id], ...enableRuleState});
            return;
        }
    };

    return {exampleState, onSetProperty, controlsDockPosition, setControlsDockPosition};
};

export {useQueryState};
