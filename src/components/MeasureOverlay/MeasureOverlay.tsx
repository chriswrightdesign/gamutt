import React, {useEffect, useState} from "react";
import "./MeasureOverlay.css";

interface MeasureOverlayProps {
    /** Ref to a container whose first child (the rendered example) is measured. */
    targetRef: React.RefObject<HTMLElement | null>;
    enabled: boolean;
}

const MeasureOverlay = ({targetRef, enabled}: MeasureOverlayProps): React.JSX.Element | null => {
    const [size, setSize] = useState<{width: number; height: number} | null>(null);

    useEffect(() => {
        const container = targetRef.current;
        if (!enabled || !container) {
            setSize(null);
            return;
        }

        const measured = container.firstElementChild ?? container;
        const update = () => {
            const rect = measured.getBoundingClientRect();
            setSize({width: Math.round(rect.width), height: Math.round(rect.height)});
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(measured);

        return () => observer.disconnect();
    }, [enabled, targetRef]);

    if (!enabled || !size) {
        return null;
    }

    return (
        <div className="gmt-measure" aria-live="polite">
            {size.width} × {size.height}
        </div>
    );
};

export {MeasureOverlay};
