const Hapi = require('hapi');
const api = require('./api');

function setup({host, port, workspace}) {
    return new Promise((resolve, reject) => {
        const server = new Hapi.Server();

        server.connection({
            host,
            port
        });

        server.register([api({workspace})], (err) => {

            if (err) {
                return reject(err);
            }

            return resolve(server);
        });
    })
}

module.exports = {
    setup
};