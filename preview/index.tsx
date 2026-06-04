import React from 'react';
import { createRoot } from 'react-dom/client';
import {Preview} from './Preview';

const App = () => (
    <Preview />
);

createRoot(document.getElementById('root')!).render(<App />);

