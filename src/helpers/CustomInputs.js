import React, { useState } from 'react';
import './../styles/CustomInputs.css';

const isValidInt = (value, min, max) =>
    value !== '' &&
    value !== '-' &&
    (min === undefined || value >= min) &&
    (max === undefined || value <= max);

const isValidDecimal = (value) =>
    value !== '' &&
    value !== '-';

export const IntegerInput = ({ value, min, max, onChange, readOnly }) => {
    const regexp = new RegExp(`^-?[0-9]*$`);
    const [internalValue, setInternalValue] = useState(value);
    const [valid, setValid] = useState(isValidInt(value, min, max));
    return (
        <input type="text"
            className={valid ? 'custom-input' : 'custom-input invalid-input'}
            value={internalValue}
            onChange={(event) => {
                const newValue = event.target.value;
                if (regexp.test(newValue)) {
                    setInternalValue(newValue);
                    let newValid = isValidInt(newValue, min, max);
                    setValid(newValid);
                    if (newValid) {
                        onChange(newValue);
                    }
                }
            }}
            onBlur={() => {
                if (internalValue < min) {
                    setInternalValue(min);
                    onChange(min);
                } else if (internalValue > max) {
                    setInternalValue(max);
                    onChange(max);
                } else {
                    setInternalValue(value);
                }
                setValid(true);
            }}
            readOnly={readOnly}
        />
    );
};


export const DecimalInput = ({ value, precision, scale, onChange, readOnly }) => {
    const regexp = scale > 0 ? new RegExp(`^-?[0-9]{0,${precision}}(\\.[0-9]{0,${scale}})?$`) : new RegExp(`^-?[0-9]{0,${precision}}$`);
    const [internalValue, setInternalValue] = useState(value);
    const [valid, setValid] = useState(isValidDecimal(value));
    return (
        <input type="text"
            className={valid ? 'custom-input' : 'custom-input invalid-input'}
            value={internalValue}
            onChange={(event) => {
                const newValue = event.target.value;
                if (regexp.test(newValue)) {
                    setInternalValue(newValue);
                    let newValid = isValidDecimal(newValue);
                    setValid(newValid);
                    if (newValid) {
                        onChange(newValue);
                    }
                }
            }}
            onBlur={() => {
                setInternalValue(value);
                setValid(true);
            }}
            readOnly={readOnly}
        />
    );
};