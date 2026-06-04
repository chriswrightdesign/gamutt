import {classMap} from '../../utils/classMap';
import React, {forwardRef} from 'react';

interface CoreInputProps extends React.HTMLProps<HTMLInputElement> {
    /**
     * Determines whether the input should focus automatically.
     */
    autoFocus?: boolean;
    /**
     *  Optional class name to reference and style the input with CSS.
     */
    className?: string;
    /**
     * Determines whether the input is in a disabled, non-interactive state.
     */
    disabled?: boolean;
    /**
     * Default value of the input.
     */
    defaultValue?: string;
    /**
     * Identifier for the form element that should be referenced on submit.
     */
    form?: string;
    /**
     * A unique identifier for the input.
     */
    id: string;
    /**
     * Sets the input to require user input for successful form submission.
     */
    required?: boolean;
    /**
     * Determines the input type. Default is text. 
     */
    type?: 'text' | 'number' | 'password' | 'tel' | 'email' | 'time' | 'search';
    /**
     * Specifies the value of the input. 
     */
    value?: string;
    /**
     * Text to display in the input when there is no value.
     */
    placeholder?: string;
    /**
     * Callback for the change event.
     */
    onChange?: (event: React.FormEvent<HTMLInputElement>) => void;
    /**
     * Callback for the blur event.
     */
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /**
     *  Callback for the focus event.
     */
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /**
     *  Callback for the paste event.
     */
    onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
    /**
     *  Callback for the select event.
     */
    onSelect?: (event: React.FormEvent<HTMLInputElement>) => void;
    /**
     *  Callback for the selecion start event.
     */
    onSelectionStart?: (event: React.FormEvent<HTMLInputElement>) => void;
    /**
     *  Callback for the selection end event.
     */
    onSelectionEnd?: (event: React.FormEvent<HTMLInputElement>) => void;
    /**
     *  Allows the `qa-` class hook to be customised
     */
    qaOverride?: string;
}

const TextField = forwardRef<HTMLInputElement, CoreInputProps>((props, ref) => {
    const {id, className, defaultValue, qaOverride, ...extended} = props;

    return <input {...extended} id={id} ref={ref} defaultValue={defaultValue} className={classMap({
        'gmt-input': true,
        [`qa-input-${id}`]: !qaOverride,
        [`qa-${qaOverride}`]: Boolean(qaOverride),
    }, className)} />;
});

export {TextField};