import React from 'react';
import {SidebarIcon} from '../Icon/SidebarIcon';
import {FooterIcon} from '../Icon/FooterIcon';
import {DetachIcon} from '../Icon/DetachIcon';
import {classMap} from "../../utils/classMap";
import {DockPosition} from '../../PreviewApp.types';

interface ToggleConfigurationTriggerProps {
    onToggleLayout: (layoutType: DockPosition) => void;
    activeLayout: DockPosition;
}

const ToggleLayout = ({activeLayout, onToggleLayout = () => {}}: ToggleConfigurationTriggerProps) => {
    return (
        <div className="gmt-toggle-layout-controls">
            <button aria-label="Dock controls to the right" className={classMap({
                'gmt-toggle-layout-controls__button': true,
                'is-active': activeLayout === 'right-sidebar',
            })} type="button" onClick={() => {
                onToggleLayout('right-sidebar');
            }}>
                <SidebarIcon orientation="right" />
            </button>
            
            <button aria-label="Dock controls to the bottom" className={classMap({
                'gmt-toggle-layout-controls__button': true,
                'is-active': activeLayout === 'footer',
            })} type="button" onClick={() => {
                onToggleLayout('footer');
            }}>
                <FooterIcon />
            </button>

            <button aria-label="Dock controls to the left" className={classMap({
                'gmt-toggle-layout-controls__button': true,
                'is-active': activeLayout === 'left-sidebar',
            })} type="button" onClick={() => {
                onToggleLayout('left-sidebar');
            }}>
                <SidebarIcon orientation="left" />
            </button>
            <button aria-label="Detach controls" className={classMap({
                'gmt-toggle-layout-controls__button': true,
                'is-active': activeLayout === 'detach',
            })} type="button" onClick={() => {
                onToggleLayout('detach');
            }}>
                <DetachIcon />
            </button>
        </div>
    )
}

export {ToggleLayout}