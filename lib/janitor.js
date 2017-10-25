const Git = require('nodegit');

function janitor({repository}) {
    function listBranches() {
        return repository.getReferences(Git.Reference.TYPE.OID)
            .then(function(references) {
                return references.filter((ref) => {
                    return ref.isBranch()
                })
            })
    }

    function currentBranch() {
        return repository.getCurrentBranch();
    }


    return {
        listBranches,
        currentBranch
    }
}


function init({workspace}) {
    return Git.Repository.open(workspace)
        .then((repository) => {
            return janitor({repository})
        })
}

module.exports = {
    init
}