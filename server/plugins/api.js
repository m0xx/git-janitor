const Boom = require('boom');

function referenceToBranch(reference) {
    return {
        name: reference.name(),
        shorthand: reference.shorthand(),
        isRemote: reference.isRemote() > 0
    };
}

const routes = [
    {
        method: 'GET',
        path: '/api/branches',
        handler: (request, reply) => {
            const { janitor } = request.server.plugins['janitor'];

            return janitor
                .listBranches()
                .then(references => {
                    return references.map(referenceToBranch);
                })
                .then(reply)
                .catch(err => {
                    return Boom.internals(err);
                });
        }
    },
    {
        method: 'GET',
        path: '/api/current-branch',
        handler: (request, reply) => {
            const { janitor } = request.server.plugins['janitor'];

            return janitor
                .currentBranch()
                .then(referenceToBranch)
                .then(reply)
                .catch(err => {
                    return Boom.internals(err);
                });
        }
    }
];

const api = (server, options, next) => {
    server.route(routes);

    next();
};

api.attributes = {
    name: 'api',
    version: '1.0.0'
};

module.exports = api;
