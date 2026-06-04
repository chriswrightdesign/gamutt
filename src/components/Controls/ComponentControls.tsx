import React from 'react';
import {classMap} from "../../utils/classMap";

interface ComponentControlsProps {
    children: React.ReactNode;
    controlsDockPosition: string;
    isDragging: boolean;
    position: {
        x: number;
        y: number;
    }
    controlSlot: React.ReactNode;
}

const Controls = ({controlsDockPosition, isDragging, position, children, controlSlot}: ComponentControlsProps) => {
    return (
        <div
            className={classMap({
                'gmt-controls': true,
                'is-dragging': Boolean(isDragging),
                [`gmt-controls--dock-position-${controlsDockPosition}`]: Boolean(controlsDockPosition),
            })}
            style={{
                ...(controlsDockPosition === 'detach' ? {
                    bottom: 'auto',
                    right: 'auto',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                } : {})
            }}>
            {controlSlot}
            <div className="gmt-controls__inner">
                <div className="gmt-controls__content">
                    {children}
                </div>
            </div>
        </div>
    )
}

export {Controls};