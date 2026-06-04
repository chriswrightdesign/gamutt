import React from 'react';
import {ThemeToggle} from '../ThemeToggle';

interface PageFrameProps {
    children: React.ReactNode;
}

const PageFrame = ({children}: PageFrameProps) => {
    return (
        <div className="gmt-site">
            <ThemeToggle />
            <main className="gmt-stage">{children}</main>
        </div>
    )
}

export {PageFrame};