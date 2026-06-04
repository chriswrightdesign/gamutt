import React from "react";
import {Radio} from "../Radio";
import {SelectField} from "../SelectField";
import {Checkbox} from "../Checkbox";
import {TextField} from "../TextField";
import {ControlValue, ExampleState, ExampleControl, OnSetProperty, EnableRule} from "../../PreviewApp.types";

interface ControlsGroupProps {
    name: string;
    type: ExampleControl["type"];
    values: ControlValue[];
    exampleState: ExampleState;
    onSetProperty: OnSetProperty;
    id: string;
    isControlDisabled?: boolean;
    enableRuleControl?: EnableRule;
}

const ControlsGroup = ({name, type, values, onSetProperty, exampleState, id, isControlDisabled, enableRuleControl}: ControlsGroupProps) => {
    return (
        <div className="gmt-controls__group">
            <h4 className="gmt-controls__group-heading">{name}</h4>
            <div className="gmt-controls__items">
                {type === "union" && (
                    <React.Fragment>
                        {values.map((value) => {
                            const { disableRule, enableRule, hideOption } = value;

                            const isDisabled = disableRule && disableRule(exampleState);
                            const shouldHideOption = hideOption && hideOption(exampleState);

                            return (!shouldHideOption) && (
                                <div key={`${value.id}`}>
                                    <Radio
                                        label={value.name}
                                        disabled={isDisabled}
                                        checked={exampleState[id] === value.id}
                                        onChange={onSetProperty(type, id, enableRule)}
                                        id={String(value.id)}
                                        name={id}
                                    />
                                </div>
                            );
                        })}
                    </React.Fragment>
                )}
                {type === "options" && (
                    <React.Fragment>
                        {values.map((value) => {
                            const { disableRule, enableRule, hideOption } = value;
                            const isDisabled = disableRule && disableRule(exampleState);
                            const shouldHideOption = hideOption && hideOption(exampleState);

                            return (!shouldHideOption) && (
                                <div key={value.id}>
                                    <Checkbox
                                        label={value.name}
                                        disabled={isDisabled}
                                        checked={Boolean(exampleState[value.id])}
                                        onChange={onSetProperty(type, id, enableRule)}
                                        id={String(value.id)}
                                        name={id}
                                    />
                                </div>
                            );
                        })}
                    </React.Fragment>
                )}
                {type === "select" && (
                    <SelectField
                        disabled={isControlDisabled}
                        value={String(exampleState[id] || "")}
                        label={name}
                        onChange={onSetProperty(type, id, enableRuleControl)}
                        id={id}>
                        {values.map((value) => {
                            const { disableRule, hideOption } = value;
                            const isDisabled = disableRule && disableRule(exampleState);
                            const shouldHideOption = hideOption && hideOption(exampleState);

                            return (!shouldHideOption) && (
                                <option disabled={isDisabled} key={value.id} value={value.id}>
                                    {value.name}
                                </option>
                            );
                        })}
                    </SelectField>
                )}
                {type === "input" && (
                    <TextField
                        id={id}
                        onChange={onSetProperty(type, id)}
                        label={name}
                        value={String(exampleState[id] ?? "")}
                    />
                )}
                {type === "color" && (
                    <input
                        className="gmt-controls__color"
                        type="color"
                        id={id}
                        value={String(exampleState[id] ?? "#000000")}
                        onChange={onSetProperty(type, id)}
                    />
                )}
            </div>
        </div>
    );
};

export {ControlsGroup};