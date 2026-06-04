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
import {ErrorBoundary} from '../components/ErrorBoundary';
import {EventsPanel, LoggedEvent} from '../components/EventsPanel';
import {MeasureOverlay} from '../components/MeasureOverlay';
import {ControlSetup, CodeExample, DockPosition, ExampleControl, ExampleEvent, ExampleTarget} from '../PreviewApp.types';
import {useDragPanel} from '../utils/useDragPanel';
import {useQueryState} from '../utils/useQueryState';
import {resolveControlSetup} from '../utils/deriveControls';

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
    const {controls, defaultState} = React.useMemo(
        () => resolveControlSetup(target, controlSetup ?? {}),
        [target, controlSetup]
    );

    const [events, setEvents] = React.useState<LoggedEvent[]>([]);
    const handleEvent = React.useCallback((event: ExampleEvent) => {
        setEvents((previous) => [...previous, {id: (previous[previous.length - 1]?.id ?? -1) + 1, ...event}].slice(-50));
    }, []);
    const clearEvents = React.useCallback(() => setEvents([]), []);

    const {position, isDragging, handlePointerDown, handlePointerMove, handlePointerUp} = useDragPanel();

    const {exampleState, onSetProperty, controlsDockPosition, setControlsDockPosition} = useQueryState({
        controls,
        defaultState,
        hasSidebarControls,
        isDragging,
    });

    const [searchTerm, setSearchTerm] = React.useState('');
    const [isMeasuring, setIsMeasuring] = React.useState(false);
    const stageContentRef = React.useRef<HTMLDivElement>(null);

    const jsCode = jsCodeExample ? jsCodeExample({controlState: exampleState}) : undefined;

    const cssCode = cssCodeExample ? cssCodeExample({controlState: exampleState}) : undefined;

    const htmlCode = htmlCodeExample ? htmlCodeExample({controlState: exampleState}) : undefined;

    const {viewCategory} = exampleState;

    const filteredControls = controls.filter((control) => {
        if (typeof viewCategory !== 'string' || control.viewCategories === undefined) {
            return true;
        }

        return control.viewCategories.includes(viewCategory);
    });

    const renderControl = (control: ExampleControl): React.ReactNode => {
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
                const shouldHideOption = value.hideOption && value.hideOption(exampleState) === true;
                return shouldHideOption ? false : true;
            });

        const matchesActiveSubCategory =
            viewSubCategories === undefined ||
            viewSubCategories.some((subCategory) => Object.values(exampleState).includes(subCategory));

        const isControlDisabled = disableRuleControl && disableRuleControl(exampleState);

        if (!matchesActiveSubCategory || (type === 'options' && shouldDisplayOptionGroup === false)) {
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
    };

    const searchValue = searchTerm.trim().toLowerCase();
    const searchedControls = searchValue
        ? filteredControls.filter(
              (control) =>
                  control.name.toLowerCase().includes(searchValue) ||
                  control.id.toLowerCase().includes(searchValue)
          )
        : filteredControls;

    const ungroupedControls = searchedControls.filter((control) => !control.group);
    const groupOrder: string[] = [];
    const groupedControls = new Map<string, ExampleControl[]>();
    searchedControls.forEach((control) => {
        if (!control.group) {
            return;
        }
        const existing = groupedControls.get(control.group);
        if (existing) {
            existing.push(control);
        } else {
            groupedControls.set(control.group, [control]);
            groupOrder.push(control.group);
        }
    });

    const copyThemeCss = () => {
        const selector = target.type === 'custom-element' ? target.tagName : ':root';
        const lines = controls
            .filter((control) => control.group === 'Theme')
            .map((control) => {
                const value = exampleState[control.id];
                return typeof value === 'string' && value !== '' ? `  ${control.id}: ${value};` : null;
            })
            .filter((line): line is string => line !== null);

        if (lines.length === 0) {
            return;
        }

        navigator.clipboard?.writeText(`${selector} {\n${lines.join('\n')}\n}`);
    };

    return (
        <div className={classMap({'gmt-demo-page': true, 'is-dragging': isDragging})}>
            <PageLayout layoutType={SIDEBAR_LAYOUT[controlsDockPosition]}>
                <ComponentStage>
                    <div className="gmt-stage-content" ref={stageContentRef}>
                        <ErrorBoundary resetKey={JSON.stringify(exampleState)}>
                            <ExampleRenderer target={target} controlState={exampleState} onEvent={handleEvent} />
                        </ErrorBoundary>
                    </div>
                </ComponentStage>
                <div className="gmt-stage-toolbar">
                    <button
                        type="button"
                        className={classMap({'gmt-stage-toolbar__button': true, 'is-active': isMeasuring})}
                        onClick={() => setIsMeasuring((value) => !value)}
                        aria-pressed={isMeasuring}>
                        Measure
                    </button>
                    <MeasureOverlay targetRef={stageContentRef} enabled={isMeasuring} />
                </div>

                {controls.length > 0 ? (
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
                        {controls.length > 3 ? (
                            <input
                                type="search"
                                className="gmt-controls__search"
                                placeholder="Search controls…"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.currentTarget.value)}
                            />
                        ) : null}
                        {ungroupedControls.map(renderControl)}
                        {groupOrder.map((groupName) => (
                            <details key={groupName} className="gmt-controls__section" open>
                                <summary className="gmt-controls__section-summary">{groupName}</summary>
                                {(groupedControls.get(groupName) ?? []).map(renderControl)}
                                {groupName === 'Theme' ? (
                                    <button
                                        type="button"
                                        className="gmt-controls__copy-theme"
                                        onClick={copyThemeCss}>
                                        Copy theme CSS
                                    </button>
                                ) : null}
                            </details>
                        ))}
                    </Controls>
                ) : null}
                {jsCode || cssCode || htmlCode ? (
                    <CodeAccordion jsCode={jsCode} cssCode={cssCode} htmlCode={htmlCode} />
                ) : null}
                <EventsPanel events={events} onClear={clearEvents} />
            </PageLayout>
        </div>
    );
};

export {DemoPage};
