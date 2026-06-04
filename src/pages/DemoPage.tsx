import React from 'react';
import {classMap} from '../utils/classMap';
import {DockControls} from '../components/Controls/DockControls';
import {ComponentStage} from '../components/ComponentStage';
import {ExampleRenderer} from '../components/ExampleRenderer';
import {Controls} from '../components/Controls/ComponentControls';
import {DragButton} from '../components/DragButton';
import {ControlsGroup} from '../components/Controls/ControlsGroup';
import {CodeAccordion} from '../components/CodeAccordion';
import {PageLayout} from '../components/PageLayout';
import {ControlSetup, CodeExample, DockPosition, ExampleTarget} from '../PreviewApp.types';
import {useDragPanel} from '../utils/useDragPanel';
import {useQueryState} from '../utils/useQueryState';

interface DemoPageProps {
    target: ExampleTarget;
    description?: React.ReactNode;
    jsCodeExample?: CodeExample;
    cssCodeExample?: CodeExample;
    htmlCodeExample?: CodeExample;
    controlSetup?: ControlSetup;
    hasSidebarControls?: boolean;
}

const SIDEBAR_LAYOUT: Record<DockPosition, 'left' | 'right' | 'full'> = {
    'left-sidebar': 'left',
    'right-sidebar': 'right',
    detach: 'full',
    footer: 'full',
};

const DemoPage = ({
    target,
    controlSetup,
    jsCodeExample,
    cssCodeExample,
    htmlCodeExample,
    hasSidebarControls = true,
}: DemoPageProps) => {
    const controls = controlSetup?.controls;
    const defaultState = controlSetup?.defaultState;

    const {position, isDragging, handlePointerDown, handlePointerMove, handlePointerUp} = useDragPanel();

    const {exampleState, onSetProperty, controlsDockPosition, setControlsDockPosition} = useQueryState({
        controls,
        defaultState,
        hasSidebarControls,
        isDragging,
    });

    const jsCode = jsCodeExample ? jsCodeExample({controlState: exampleState}) : undefined;

    const cssCode = cssCodeExample ? cssCodeExample({controlState: exampleState}) : undefined;

    const htmlCode = htmlCodeExample ? htmlCodeExample({controlState: exampleState}) : undefined;

    const {viewCategory} = exampleState;

    const filteredControls = (controls ?? []).filter((control) => {
        if (typeof viewCategory !== 'string' || control.viewCategories === undefined) {
            return true;
        }

        return control.viewCategories.includes(viewCategory);
    });

    return (
        <div className={classMap({'gmt-demo-page': true, 'is-dragging': isDragging})}>
            <PageLayout layoutType={SIDEBAR_LAYOUT[controlsDockPosition]}>
                <ComponentStage>
                    <ExampleRenderer target={target} controlState={exampleState} />
                </ComponentStage>

                {controls ? (
                    <Controls
                        controlSlot={
                            hasSidebarControls ? (
                                <DockControls
                                    activeLayout={controlsDockPosition}
                                    dragButtonSlot={
                                        <DragButton
                                            handlePointerDown={handlePointerDown}
                                            handlePointerMove={handlePointerMove}
                                            handlePointerUp={handlePointerUp}
                                            isDragging={isDragging}
                                        />
                                    }
                                    onToggleDock={(layout) => {
                                        setControlsDockPosition(layout);
                                    }}
                                />
                            ) : null
                        }
                        isDragging={isDragging}
                        controlsDockPosition={controlsDockPosition}
                        position={position}>
                        {filteredControls.map((control) => {
                            const {
                                type,
                                name,
                                values,
                                id,
                                viewSubCategories,
                                enableRule: enableRuleControl,
                                disableRule: disableRuleControl,
                                hideGroup = () => false,
                            } = control;

                            const shouldDisplayOptionGroup =
                                type === 'options' &&
                                Object.values(values).some((value) => {
                                    const shouldHideOption =
                                        value.hideOption && value.hideOption(exampleState) === true;
                                    return shouldHideOption ? false : true;
                                });

                            const matchesActiveSubCategory =
                                viewSubCategories === undefined ||
                                viewSubCategories.some((subCategory) =>
                                    Object.values(exampleState).includes(subCategory)
                                );

                            const isControlDisabled = disableRuleControl && disableRuleControl(exampleState);

                            if (
                                !matchesActiveSubCategory ||
                                (type === 'options' && shouldDisplayOptionGroup === false)
                            ) {
                                return null;
                            }

                            return !hideGroup(exampleState) ? (
                                <ControlsGroup
                                    key={id}
                                    exampleState={exampleState}
                                    isControlDisabled={isControlDisabled}
                                    enableRuleControl={enableRuleControl}
                                    id={id}
                                    type={type}
                                    name={name}
                                    values={values}
                                    onSetProperty={onSetProperty}
                                />
                            ) : null;
                        })}
                    </Controls>
                ) : null}
                {jsCode || cssCode || htmlCode ? (
                    <CodeAccordion jsCode={jsCode} cssCode={cssCode} htmlCode={htmlCode} />
                ) : null}
            </PageLayout>
        </div>
    );
};

export {DemoPage};
