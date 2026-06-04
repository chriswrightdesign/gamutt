import React from 'react';
import './DragHandleIcon.css';
const columnOneX = '8';

const columnTwoX = '15';

const DragHandleIcon = () => {
    return (
        <svg className="gmt-drag-handle-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 24 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx={columnOneX} cy="13" r="1" />
            <circle cx={columnOneX} cy="6" r="1" />
            <circle cx={columnOneX} cy="20" r="1" />
            <circle cx={columnOneX} cy="27" r="1" />
            <circle cx={columnOneX} cy="34" r="1" />
            <circle cx={columnOneX} cy="41" r="1" />

            <circle cx={columnTwoX} cy="13" r="1" />
            <circle cx={columnTwoX} cy="6" r="1" />
            <circle cx={columnTwoX} cy="20" r="1" />
            <circle cx={columnTwoX} cy="27" r="1" />
            <circle cx={columnTwoX} cy="34" r="1" />
            <circle cx={columnTwoX} cy="41" r="1" />

        </svg>
    );
};

export {DragHandleIcon};