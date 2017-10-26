import React, { Component } from 'react';
import CurrentBranch from './components/CurrentBranch';
import BranchSelector from './components/BranchSelector';
import DifferenceSummary from './components/DifferenceSummary';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

import { fetchBranches, fetchCurrentBranch, compareBranches } from './api';

function setAllBranches(branches) {
    return (state, props) => ({
        allBranches: branches
    });
}

function setCurrentBranch(branch) {
    return (state, props) => ({
        currentBranch: branch
    });
}

function changeBranchSelection(name, isSelect) {
    return (state, props) => {
        const { selected } = state;
        if (isSelect) {
            return {
                selected: {
                    ...selected,
                    ...{ [name]: true }
                }
            };
        }

        delete selected[name];

        return { selected: { ...selected } };
    };
}

function setDifferences(commits) {
    return (state, props) => ({
        differences: commits,
        isComparing: false
    });
}

function startComparing(state, props) {
    return {
        isComparing: true
    };
}

function getAllBranchesButCurrent({ allBranches, currentBranch }) {
    if (!currentBranch) {
        return [];
    }

    return allBranches.filter(branch => branch.name !== currentBranch.name);
}

function getBranch(state, name) {
    const { allBranches } = state;

    for (let i = 0; i < allBranches.length; i++) {
        const branch = allBranches[i];
        if (branch.name === name) {
            return branch;
        }
    }

    return null;
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentBranch: null,
            allBranches: [],
            selected: {},
            differences: [],
            isComparing: false,
            summaryLines: []
        };
    }
    componentWillMount() {
        Promise.all([fetchCurrentBranch(), fetchBranches()]).then(results => {
            this.setState(setCurrentBranch(results[0]));
            this.setState(setAllBranches(results[1]));
        });
    }
    render() {
        const {
            currentBranch,
            allBranches,
            selected,
            summaryLines
        } = this.state;

        console.log(this.state);
        return (
            <div>
                {currentBranch && (
                    <CurrentBranch shorthand={currentBranch.shorthand} />
                )}

                {allBranches.length && (
                    <BranchSelector
                        branches={getAllBranchesButCurrent(this.state)}
                        selected={Object.keys(selected)}
                        onSelect={(name, isSelect) => {
                            this.setState(
                                changeBranchSelection(name, isSelect)
                            );
                        }}
                    />
                )}

                <div>
                    <DefaultButton
                        primary={true}
                        data-automation-id="test"
                        text="Compare!"
                        onClick={() => {
                            const { selected, currentBranch } = this.state;
                            const state = this.state;

                            Object.keys(selected).forEach(name => {
                                compareBranches(
                                    currentBranch.name,
                                    name
                                ).then(commits => {
                                    this.setState({
                                        summaryLines: [...state.summaryLines, {
                                            branch: getBranch(state, name),
                                            commits
                                        }]
                                    })
                                });
                            });
                        }}
                    />
                </div>
                {summaryLines.length && (
                    <DifferenceSummary lines={summaryLines} />
                )}
            </div>
        );
    }
}

export default App;
