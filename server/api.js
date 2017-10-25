const Boom = require('boom');
const Janitor = require('./../lib/janitor');

const routes = [{
    method: 'GET',
    path: '/api/branches',
    handler: (request, reply) => {
        const {workspace} = request.server.plugins['api'];

        Janitor.init({workspace})
            .then((janitor) => {
                return janitor.listBranches();
            })
            .then((references) => {
                return references.map((ref) => (ref.shorthand()))
            })
            .then((names) => {
                reply({
                    branches: names
                })
            })
            .catch((err) => {
                return Boom.internals(err)
            })
    }
}]


module.exports = function({workspace}) {
    const api = (server, options, next) => {
        server.expose('workspace', workspace);
        server.route(routes);

        next();
    }

    api.attributes = {
        name: 'api',
        version: '1.0.0'
    };

    return api;
};
