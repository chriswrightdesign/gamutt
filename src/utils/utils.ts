import {ExampleState, ControlStateValue} from '../PreviewApp.types';

export const convertToKebabCase = (str: string): string =>
    str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

export const generateRandomHSL = (hueOffset = 0) => {
    const h = (360 - hueOffset) * Math.random();
    const s = 45 + 70 * Math.random();
    const l = 65 + 10 * Math.random();

    return `hsl(${h}, ${s}%, ${l}%)`;
}

export const getPropsFromQueryString = (): ExampleState => {
    const queryString = window.location.hash.split('?')[1];

    if (!queryString) {
        return {};
    }

    const props: ExampleState = {};

    new URLSearchParams(queryString).forEach((value, key) => {
        // `attributes` is a comma-separated shorthand that expands into one boolean flag per item.
        if (key === 'attributes') {
            value.split(',').forEach((attribute) => {
                if (attribute) {
                    props[attribute] = true;
                }
            });
            return;
        }

        props[key] = value === 'true' ? true : value === 'false' ? false : value;
    });

    return props;
};

interface SetQueryFromStateArgs {
    state: ExampleState;
    reservedState?: Record<string, ControlStateValue>;
    filterKeys?: string[];
}

export const setQueryFromState = ({state, reservedState = {}, filterKeys = []}: SetQueryFromStateArgs): void => {
    const params = new URLSearchParams();

    Object.entries(state).forEach(([key, value]) => {
        if (filterKeys.includes(key) || value === '' || value === undefined) {
            return;
        }

        params.set(key, String(value));
    });

    // Reserved keys (e.g. the dock position) are written even when filtered out of `state`.
    Object.entries(reservedState).forEach(([key, value]) => {
        if (value !== undefined) {
            params.set(key, String(value));
        }
    });

    const cleanHash = window.location.hash.split('?')[0];

    window.history.replaceState({}, '', `${cleanHash}?${params.toString()}`);
};