import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DetailsList } from 'office-ui-fabric-react/lib/DetailsList';

const lineShape = PropTypes.shape({
    branch: PropTypes.object.isRequired,
    commits: PropTypes.arrayOf(PropTypes.shape).isRequired
});

const propTypes = {
    lines: PropTypes.arrayOf(lineShape).isRequired
};

function DifferenceSummary({ lines }) {
    const data = lines.map(line => {
        return { shorthand: line.branch.shorthand };
    });
    const columns = [
        {
            key: 'branch',
            name: 'Branch',
            fieldName: 'shorthand',
            minWidth: 100
        }
    ];

    return (
        <DetailsList
            setKey="items"
            items={data}
            columns={columns}
            checkboxVisibility={true}
            isHeaderVisible={true}
            selectionMode="multiple"
        />
    );
}

DifferenceSummary.propTypes = propTypes;

export default DifferenceSummary;
