import React, {useState, useRef} from "react";

interface Position {
    x: number;
    y: number;
}

interface DragPanel {
    position: Position;
    isDragging: boolean;
    handlePointerDown: (event: React.PointerEvent) => void;
    handlePointerMove: (event: React.PointerEvent) => void;
    handlePointerUp: (event: React.PointerEvent) => void;
}

/**
 * Drag state for the detachable controls panel. Uses Pointer Events + pointer capture so
 * dragging keeps tracking over iframes / outside the window, and derives an absolute delta
 * from the drag-start origin (held in a ref) rather than per-event movementX/Y.
 */
const useDragPanel = (initialPosition: Position = {x: 72, y: 200}): DragPanel => {
    const [isDragging, setIsDragging] = useState(false);

    const [position, setPosition] = useState(initialPosition);

    const dragOrigin = useRef<{pointerX: number; pointerY: number; posX: number; posY: number} | null>(null);

    const handlePointerDown = (event: React.PointerEvent) => {
        // Capture so move/up keep firing on the handle even when the cursor passes over the
        // component stage (incl. iframes) or leaves the window.
        event.currentTarget.setPointerCapture(event.pointerId);
        dragOrigin.current = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            posX: position.x,
            posY: position.y,
        };
        setIsDragging(true);
    };

    const handlePointerMove = (event: React.PointerEvent) => {
        const origin = dragOrigin.current;
        if (!origin) {
            return;
        }

        // Absolute pointer delta rather than movementX/Y: WebKit reports movement* in physical
        // device pixels, so a detached panel drifts at 2x on retina in Safari. clientX/Y are CSS px.
        setPosition({
            x: origin.posX + (event.clientX - origin.pointerX),
            y: origin.posY + (event.clientY - origin.pointerY),
        });
    };

    const handlePointerUp = (event: React.PointerEvent) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        dragOrigin.current = null;
        setIsDragging(false);
    };

    return {position, isDragging, handlePointerDown, handlePointerMove, handlePointerUp};
};

export {useDragPanel};
