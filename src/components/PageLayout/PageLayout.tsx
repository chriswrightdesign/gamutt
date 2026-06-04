import React from 'react';
import {classMap} from '../../utils/classMap';

interface PageLayoutProps {
    children: React.ReactNode;
    layoutType: 'left' | 'right' | 'full';
}

const PageLayout = ({children, layoutType}: PageLayoutProps) => {
    return (
        <div
            className={classMap({
                'gmt-page-layout': true,
                [`gmt-page-layout--${layoutType}`]: true,
            })}>
            {children}
        </div>
    );
};

export {PageLayout};
