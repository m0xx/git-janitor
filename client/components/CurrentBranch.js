import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    shorthand: PropTypes.string.isRequired
};

function CurrentBranch({ shorthand }) {
    return <div>Current branch: {shorthand}</div>;
}

CurrentBranch.propTypes = propTypes;

export default CurrentBranch;
