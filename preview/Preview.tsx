import React from 'react';
import {PreviewApp} from '../src/PreviewApp';
import type {ComponentDoc, ExampleComponent, ExampleControl, ExampleState} from '../src/PreviewApp.types';

// --- A native custom element, defined with zero dependencies, to demo the custom-element target ---
class GmtDemoBadge extends HTMLElement {
    static get observedAttributes(): string[] {
        return ['variant', 'label'];
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback(): void {
        this.render();
        this.addEventListener('click', this.handleClick);
    }

    disconnectedCallback(): void {
        this.removeEventListener('click', this.handleClick);
    }

    attributeChangedCallback(): void {
        this.render();
    }

    private handleClick = (): void => {
        this.dispatchEvent(new CustomEvent('gmt-badge-select', {detail: {variant: this.getAttribute('variant')}}));
    };

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }
        const palette: Record<string, string> = {info: '#2563eb', success: '#16a34a', warning: '#d97706'};
        const variant = this.getAttribute('variant') ?? 'info';
        const label = this.getAttribute('label') ?? 'Badge';
        this.shadowRoot.innerHTML = `<span style="display:inline-block;background:${palette[variant] ?? palette.info};color:#fff;padding:4px 12px;border-radius:999px;font:13px/1 sans-serif;">${label}</span>`;
    }
}

if (typeof customElements !== 'undefined' && !customElements.get('gmt-demo-badge')) {
    customElements.define('gmt-demo-badge', GmtDemoBadge);
}

// --- A plain React component example (uses the `component` shorthand) ---
const buttonPalette: Record<string, React.CSSProperties> = {
    primary: {background: '#4f46e5', color: '#fff'},
    secondary: {background: '#e5e7eb', color: '#111827'},
    ghost: {background: 'transparent', color: '#4f46e5', boxShadow: 'inset 0 0 0 1px #4f46e5'},
};

const DemoButton = ({controlState}: {controlState: ExampleState}) => {
    const {variant, disabled, label} = controlState;
    const key = typeof variant === 'string' ? variant : 'primary';
    const text = typeof label === 'string' && label !== '' ? label : 'Click me';

    return (
        <button
            type="button"
            disabled={Boolean(disabled)}
            style={{
                padding: '10px 16px',
                borderRadius: 6,
                border: 'none',
                font: 'inherit',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                ...(buttonPalette[key] ?? buttonPalette.primary),
            }}>
            {text}
        </button>
    );
};

// Hand-authored docgen for DemoButton (gamutt has no build-time docgen step). In solar-ui this comes
// from the generated typeDocumentation.current.mjs.
const buttonPropsDoc: ComponentDoc = {
    props: {
        variant: {
            name: 'variant',
            required: false,
            type: {name: 'enum', value: [{value: "'primary'"}, {value: "'secondary'"}, {value: "'ghost'"}]},
            defaultValue: {value: "'primary'"},
        },
        disabled: {name: 'disabled', required: false, type: {name: 'boolean'}, defaultValue: {value: 'false'}},
        label: {name: 'label', required: false, type: {name: 'string'}, defaultValue: {value: "'Click me'"}},
    },
};

// Runtime derivation can't see solar-badge's literal variant options, so we merge a custom select onto it.
const badgeVariantControl: ExampleControl = {
    name: 'Variant',
    id: 'variant',
    type: 'select',
    values: [
        {name: 'Info', id: 'info'},
        {name: 'Success', id: 'success'},
        {name: 'Warning', id: 'warning'},
    ],
};

const examples: ExampleComponent[] = [
    {
        name: 'Button',
        category: 'React',
        component: DemoButton,
        // Auto-derive controls from the component's prop types; hide `label` from the panel.
        controlSetup: {
            derive: {propsDoc: buttonPropsDoc, hide: ['label']},
        },
        jsCodeExample: ({controlState}) => {
            const variant = typeof controlState.variant === 'string' ? controlState.variant : 'primary';
            const label =
                typeof controlState.label === 'string' && controlState.label !== '' ? controlState.label : 'Click me';
            return `<DemoButton variant="${variant}"${controlState.disabled ? ' disabled' : ''}>${label}</DemoButton>`;
        },
    },
    {
        name: 'Badge',
        category: 'Web Components',
        // Auto-derive from the element's observedAttributes, then merge a custom variant select on top.
        controlSetup: {
            derive: true,
            controls: [badgeVariantControl],
            defaultState: {variant: 'info', label: 'New'},
        },
        target: {
            type: 'custom-element',
            tagName: 'gmt-demo-badge',
            bind: ({variant, label}) => ({
                attributes: {
                    variant: typeof variant === 'string' ? variant : 'info',
                    label: typeof label === 'string' && label !== '' ? label : 'New',
                },
            }),
        },
        htmlCodeExample: ({controlState}) => {
            const variant = typeof controlState.variant === 'string' ? controlState.variant : 'info';
            const label =
                typeof controlState.label === 'string' && controlState.label !== '' ? controlState.label : 'New';
            return `<gmt-demo-badge variant="${variant}" label="${label}"></gmt-demo-badge>`;
        },
    },
];

// Renders with the default gamutt logo. Pass `logo={<YourLogo />}` to customise it.
const Preview = (): React.JSX.Element => <PreviewApp examples={examples} />;

export {Preview};
