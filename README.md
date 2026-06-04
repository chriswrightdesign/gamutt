# gamutt

A framework-agnostic component preview playground. Render **React components** and **native custom elements** side by side, with live controls, URL-synced state, a dockable controls panel, a source-code panel, and a customizable logo.

## Install

```sh
npm install gamutt
```

## Usage

```tsx
import {PreviewApp} from 'gamutt';
import 'gamutt/css';

const examples = [
    // A React component
    {
        name: 'Button',
        category: 'React',
        component: MyButton, // receives { controlState }
        controlSetup: {
            controls: [{name: 'Variant', id: 'variant', type: 'union', values: [/* … */]}],
            defaultState: {variant: 'primary'},
        },
    },
    // A native custom element
    {
        name: 'Badge',
        category: 'Web Components',
        target: {
            type: 'custom-element',
            tagName: 'my-badge',
            bind: ({variant}) => ({attributes: {variant: String(variant)}}),
        },
        controlSetup: {
            controls: [{name: 'Variant', id: 'variant', type: 'select', values: [/* … */]}],
            defaultState: {variant: 'info'},
        },
    },
];

export const App = () => <PreviewApp examples={examples} logo={<MyLogo />} />;
```

### Examples

Each example has a `controlSetup` (`controls` + `defaultState`) and a render **target**:

- `component: (props: {controlState}) => ReactNode` — shorthand for a React target.
- `target: {type: 'react', component}` — an explicit React target.
- `target: {type: 'custom-element', tagName, bind, register?, wrapperClassName?}` — a native custom element. `bind(controlState)` returns `{attributes?, properties?, children?, events?}`, applied to the real element (React 18 & 19 safe).

Control types: `union` (radios), `options` (checkboxes), `select` (dropdown), `input` (text). Optional `jsCodeExample` / `cssCodeExample` / `htmlCodeExample` populate the source-code panel.

### Logo

`logo?: React.ReactNode` sets the header brand mark; it defaults to the built-in gamutt mark.

## Develop

```sh
npm install
npm run preview   # demo harness at http://localhost:5173
npm test
npm run build     # emits dist/gamutt.{es,cjs}.js + gamutt.css
```

## License

Apache-2.0
