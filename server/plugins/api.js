const Boom = require('boom');
const Joi = require('joi');

const routes = [
    {
        method: 'GET',
        path: '/api/branches',
        handler: (request, reply) => {
            const { janitor } = request.server.plugins['janitor'];

            return janitor
                .listBranches()
                .then(reply)
                .catch(err => {
                    return Boom.internals(err);
                });
        }
    },
    {
        method: 'GET',
        path: '/api/branches/current',
        handler: (request, reply) => {
            const { janitor } = request.server.plugins['janitor'];

            return janitor
                .currentBranch()
                .then(reply)
                .catch(err => {
                    return Boom.internals(err);
                });
        }
    },
    {
        method: 'POST',
        path: '/api/branches/compare',
        config: {
            validate: {
                payload: {
                    branchA: Joi.string().required(),
                    branchB: Joi.string().required()
                }
            }
        },
        handler: (request, reply) => {
            const { janitor } = request.server.plugins['janitor'];
            const {branchA, branchB} = request.payload;

            return janitor
                .difference(branchA, branchB)
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
