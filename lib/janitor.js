const Git = require('nodegit');
const differenceBy = require('lodash.differenceby');

function mapReferenceToBranch(reference) {
    return {
        name: reference.name(),
        shorthand: reference.shorthand(),
        isRemote: reference.isRemote() > 0
    };
}

function mapCommit(commit) {
    return {
        id: commit.id().toString(),
        message: commit.message(),
        author: mapSignature(commit.author()),
        date: commit.date().toISOString()
    };
}

function mapSignature(signature) {
    return {
        name: signature.name(),
        email: signature.email()
    };
}

function janitor({ repository }) {
    function listBranches() {
        return repository
            .getReferences(Git.Reference.TYPE.OID)
            .then(function(references) {
                return references.filter(ref => {
                    return ref.isBranch();
                });
            })
            .then(references => {
                return references.map(mapReferenceToBranch);
            });
    }

    function currentBranch() {
        return repository.getCurrentBranch().then(mapReferenceToBranch);
    }

    function commitHistory(branchName) {
        return repository
            .getReferenceCommit(branchName)
            .then(commit => {
                return new Promise((resolve, reject) => {
                    var eventEmitter = commit.history();

                    eventEmitter.on('end', resolve);
                    eventEmitter.on('error', reject);

                    eventEmitter.start();
                });
            })
            .then(commits => {
                return commits.map(mapCommit);
            });
    }

    // Compare branchB against branchA
    // returns existing commits in branchB that doesn't exists in branchA
    function difference(branchA, branchB) {
        return Promise.all([
            commitHistory(branchA),
            commitHistory(branchB)
        ])
            .then(histories => {
                return differenceBy(histories[1], histories[0], (commit) => {
                    return commit.id;
                });
            });
    }

    return {
        listBranches,
        currentBranch,
        commitHistory,
        difference
    };
}

function init({ workspace }) {
    return Git.Repository.open(workspace).then(repository => {
        return janitor({ repository });
    });
}

module.exports = {
    init
};
