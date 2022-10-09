import React from 'react';
import { FormGroup, Label, Input as DefaultInput } from 'reactstrap';
import PropTypes from 'prop-types';

const Input = ({
    type,
    name,
    label,
    options,
    multiple,
    searchable,
    placeholder
}) => {
    const generatedOptions =
        options?.map((option, index) =>
            <option key={index} value={option.value}>
                {option.text}
            </option>
        )

    return (
        <FormGroup>
            <Label for={name} >
                {label}
            </Label>
            <DefaultInput
                id={name}
                name={name}
                type={searchable ? null : type}
                multiple={searchable ? null : multiple}
                list={searchable ? `${name}-list` : null}
                placeholder={placeholder}
            >
                {searchable ? null : generatedOptions}
            </DefaultInput>
            {searchable &&
                <datalist id={`${name}-list`}>
                    {generatedOptions}
                </datalist>
            }
        </FormGroup>
    );
};

Input.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
    })),
    multiple: PropTypes.bool,
    searchable: PropTypes.bool,
    placeholder: PropTypes.string
}

export default Input;