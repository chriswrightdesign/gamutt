import React from 'react';
import { ToggleLayout } from './ToggleLayout';
import { GamuttLogo } from '../GamuttLogo';
import {Link} from '../Link';
import {DockPosition} from '../../PreviewApp.types';

interface DockControlsProps {
    onToggleDock: (layout: DockPosition) => void;
    activeLayout: DockPosition;
    dragButtonSlot: React.ReactNode;
}

const DockControls = ({ dragButtonSlot, activeLayout, onToggleDock = () => { }}: DockControlsProps) => {

    return (
        <div className="gmt-dock-controls">
            <Link className="gmt-dock-controls__logo gmt-toggle-layout-controls__button" to="/" aria-label="Home">
                <GamuttLogo height="10" width="10" />
            </Link>
            <div className="gmt-dock-controls__button-group">
                <ToggleLayout activeLayout={activeLayout} onToggleLayout={(layoutPosition) => {
                    onToggleDock(layoutPosition);
                }} />
              {activeLayout === 'detach' ? <span className="gmt-dock-controls__drag-slot">{dragButtonSlot}</span>  : null}  
            </div>
        </div>
    )
}

export { DockControls };