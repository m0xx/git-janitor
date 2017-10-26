import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';

const propTypes = {
    branches: PropTypes.arrayOf(PropTypes.object).isRequired,
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelect: PropTypes.func.isRequired
};

function BranchSelector({ branches, selected, onSelect }) {
    return (
        <div>
            {branches.map(({ name, shorthand }) => {
                return (
                    <BranchOption
                        key={name}
                        name={name}
                        shorthand={shorthand}
                        isChecked={selected.indexOf(name) > -1}
                        onChange={(isChecked) => {
                            onSelect(name, isChecked);
                        }}
                    />
                );
            })}
        </div>
    );
}

function BranchOption({ shorthand, isChecked, onChange }) {
    return <Checkbox
        label={shorthand}
        checked={isChecked}
        onChange={(evt, isChecked) => {
            onChange(isChecked);
        }}
    />
}

BranchSelector.propTypes = propTypes;

export default BranchSelector;
