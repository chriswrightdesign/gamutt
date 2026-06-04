import React from 'react';
import {classMap} from "../../utils/classMap";
import './DragButton.css';
import {DragHandleIcon} from '../Icon';

interface DragButtonProps {
    handlePointerDown: (event: React.PointerEvent) => void;
    handlePointerMove: (event: React.PointerEvent) => void;
    handlePointerUp: (event: React.PointerEvent) => void;
    isDragging: boolean;
}
const DragButton = ({handlePointerDown, handlePointerMove, handlePointerUp, isDragging}: DragButtonProps) => {
    return (
        <button
            type="button"
            aria-label="Drag to reposition controls"
            className={classMap({
                'gmt-dock-controls__grab': true,
                'is-dragging': isDragging,
            })}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}>
            <DragHandleIcon />
        </button>
    )
}

export {DragButton};
