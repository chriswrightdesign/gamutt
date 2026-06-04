import {classMap} from '../../utils/classMap';
import React, {forwardRef} from 'react';

interface CoreCheckboxProps {
    /** Determines if the checkbox should focus automatically. */
    autoFocus?: boolean;
    /** Label text that shows beside the checkbox. */
    label: React.ReactNode;
    /** A unique identifier for the checkbox. */
    id: string;
    /** Optional class name to reference and style the checkbox with CSS. */
    className?: string;
    /** Determines if the checkbox is in a checked state. */
    checked?: boolean;
    /** Determines if the checkbox is checked by default. */
    defaultChecked?: boolean;
    /** Determines if the label is hidden. */
    hideLabel?: boolean;
    /** Specifies the value of the checkbox. */
    value?: string;
    /** Name of the checkbox. Name of the checkbox group if associated with more than one checkbox. */
    name?: string;
    /** Sets the checkbox to require user input for successful form submission. If only 1 in the group (or no group) then must be checked. */
    required?: boolean;
    /** Determines if the checkbox is in a disabled, non-interactive state. */
    disabled?: boolean;
    /** Identifier for the form element that should be referenced on submit. */
    form?: string;
    /** Callback for the change event. */
    onChange?: (event: React.FormEvent<HTMLInputElement>) => void;
    /** Callback function to trigger on a click event. */
    onClick?: (event: React.FormEvent<HTMLInputElement>) => void;
    /** Callback for the blur event. */
    onBlur?: (event: React.FormEvent<HTMLInputElement>) => void;
    /** Class to override the default appeneded class to each form element and the top level component */
    qaOverride?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CoreCheckboxProps>((props, ref) => {
    const {id, label, className, hideLabel, qaOverride, ...extended} = props;

    return (
        <div className={classMap(
            {
                'gmt-checkbox': true,
                'gmt-checkbox--has-hidden-label': Boolean(hideLabel),
                [`qa-checkbox-${id}`]: !qaOverride,
                [`qa-${qaOverride}`]: Boolean(qaOverride),
            }, className)}>
            <input {...extended} id={id} type="checkbox" ref={ref} className={classMap({
                'gmt-checkbox__input': true,
                [`qa-input`]: true,
                [`qa-input-${id}`]: !qaOverride,
                [`qa-${qaOverride}-input-${id}`]: Boolean(qaOverride),
            })} />
            <div className="gmt-checkbox__box">
                <div className="gmt-checkbox__tick" />
            </div>
            <label htmlFor={id} className={classMap(
            {
                'gmt-checkbox__label': true,
                [`qa-checkbox-label-${id}`]: !qaOverride,
                [`qa-${qaOverride}-label-${id}`]: Boolean(qaOverride),
                
            })}>
                {label}
            </label>
        </div>
    );
});

export {Checkbox};