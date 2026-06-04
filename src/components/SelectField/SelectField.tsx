import {classMap} from '../../utils/classMap';
import React, {forwardRef} from 'react';

interface CoreSelectProps extends React.HTMLProps<HTMLSelectElement> {
    /** Replaces the default caret with a custom caret. Should be an svg. */
    caretSlot?: React.ReactNode;
    /** Determines whether the select is in a disabled, non-interactive state. */
    disabled?: boolean;
    /** The options for the select. */
    children: React.ReactNode;
    /** Optional class name to reference and style the select with CSS. */
    className?: string;
    /** Specifies the value of the select. */
    value?: string;
    /** Default value of the select. */
    defaultValue?: string;
    /** A unique identifier for the select. */
    id?: string;
    /** Sets the select to require user input for successful form submission. */
    required?: boolean;
    /** Hint for form autofill. */
    autocomplete?: string;
    /** Determines whether the select should focus automatically. */
    autoFocus?: boolean;
    /** Identifier for the form element that should be referenced on submit. */
    form?: string;
    /** Allows the selection of multiple values. */
    multiple?: boolean;
    /** Name of the select. */
    name?: string;
    /** Callback for the change event. */
    onChange?: (event: React.FormEvent<HTMLSelectElement>) => void;
    /** Allows you to specify the class name of the `qa-` class */
    qaOverride?: string;
}

const SelectField = forwardRef<HTMLSelectElement, CoreSelectProps>((props, ref) => {
    const {children, id, className, value, caretSlot, disabled, qaOverride, ...extended} = props;

    return (
        <div
            className={classMap(
                {
                    'gmt-select': true,
                    [`qa-select-${id}`]: !qaOverride,
                    [`qa-${qaOverride}`]: Boolean(qaOverride),
                    'is-disabled': Boolean(disabled),
                },
                className
            )}>
            <select {...extended} id={id} ref={ref} value={value} className={classMap({
                'gmt-select__control': true,
                'qa-select-control': true,
                [`qa-select-control-${id}`]: !qaOverride,
                [`qa-${qaOverride}-${id}`]: Boolean(qaOverride),
                })} disabled={disabled}>
                {children}
            </select>
            <span className="gmt-select__icon">
                {caretSlot ? (
                    caretSlot
                ) : (
                    <svg
                        aria-hidden="true"
                        className="gmt-select__icon-svg"
                        focusable="false"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                            className="gmt-select_icon-svg-path"
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </span>
        </div>
    );
});

export {SelectField};