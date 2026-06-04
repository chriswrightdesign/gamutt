import React from 'react';

interface ComponentStageProps {
    children: React.ReactNode;
}
const ComponentStage = ({children}: ComponentStageProps) => {
    return (
        <div className="gmt-component-stage">
            <div className="gmt-component-stage__inner">{children}</div>
        </div>
    );
};

export {ComponentStage};
