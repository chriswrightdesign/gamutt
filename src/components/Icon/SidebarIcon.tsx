import React from 'react';
import {classMap} from "../../utils/classMap";
import './SidebarIcon.css';

interface SidebarIconProps {
    orientation: 'right' | 'left';
}

const SidebarIcon = ({orientation = 'right'}: SidebarIconProps) => {
    return (
        <span className={classMap({
            'gmt-sidebar-icon': true,
            [`gmt-sidebar-icon--${orientation}`]: true,
        })}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
        </span>
    )
}

export {SidebarIcon}