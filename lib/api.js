const Git = require('nodegit');

function api({repository}) {
    function listBranches() {
        return repository.getReferences(Git.Reference.TYPE.OID)
            .then(function(references) {
                return references.filter((ref) => {
                    return ref.isBranch()
                })
            })
    }

    return {
        listBranches
    }
}


function init({workspace}) {
    return Git.Repository.open(workspace)
        .then((repository) => {
            return api({repository})
        })
}

module.exports = {
    init
}