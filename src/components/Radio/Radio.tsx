import {classMap} from '../../utils/classMap';
import React, {forwardRef} from 'react';

interface CoreRadioProps {
    /** Determines whether the radio should focus automatically. */
    autoFocus?: boolean;
    /** Label text that shows beside the radio. */
    label: React.ReactNode;
    /** A unique identifier for the radio. */
    id: string;
    /** Optional class name to reference and style the radio with CSS. */
    className?: string;
    /** Determines whether the radio is in a checked state. */
    checked?: boolean;
    /** Determines whether the radio is checked by default. */
    defaultChecked?: boolean;
    /** Determines if the label is hidden. */
    hideLabel?: boolean;
    /** Specifies the value of the radio. */
    value?: string;
    /** Name of the radio group. */
    name?: string;
    /** Sets the radio group to require user input for successful form submission. */
    required?: boolean;
    /** Determines whether the radio is in a disabled, non-interactive state. */
    disabled?: boolean;
    /** Callback for the change event. */
    onChange?: (event: React.FormEvent<HTMLInputElement>) => void;
    /** Callback function to trigger on a click event. */
    onClick?: (event: React.FormEvent<HTMLInputElement>) => void;
    /** Callback for the blur event. */
    onBlur?: (event: React.FormEvent<HTMLInputElement>) => void;
    /** Class to override the default appeneded class to each form element and the top level component */
    qaOverride?: string;
}

const Radio = forwardRef<HTMLInputElement, CoreRadioProps>((props, ref) => {
    const {label, id, name, className, qaOverride, hideLabel, ...extended} = props;

    return (
        <div className={classMap({
            'gmt-radio': true,
            'gmt-radio--has-hidden-label': Boolean(hideLabel),
            [`qa-radio-${id}`]: !qaOverride,
            [`qa-${qaOverride}`]: Boolean(qaOverride),
        }, className)}>
            <input {...extended} ref={ref} name={name} id={id} type="radio" className={classMap({
                'gmt-radio__input': true,
                'qa-input': true,
                [`qa-input-${id}`]: !qaOverride,
                [`qa-${qaOverride}-input-${id}`]: Boolean(qaOverride),
            })} />
            <div className="gmt-radio__box">
                <div className="gmt-radio__tick" />
            </div>
            <label htmlFor={id} className={classMap(
                {
                    'gmt-radio__label': true,
                    [`qa-radio-label-${id}`]: !qaOverride,
                    [`qa-${qaOverride}-label-${id}`]: Boolean(qaOverride),
                })}>
                {label}
            </label>
        </div>
    );
});

export {Radio};