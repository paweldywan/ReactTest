import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';

const Select = ({
    name,
    label,
    options
}) => (<FormGroup>
    <Label for={name} >
        {label}
    </Label>
    <Input
        id={name}
        name={name}
        type="select"
    >
        {options.map(option =>
            <option key={option.value} value={option.value}>
                {option.text}
            </option>
        )}
    </Input>
</FormGroup>);

Select.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
    }))
}

export default Select;