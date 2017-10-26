const Hapi = require('hapi');
const janitor = require('./plugins/janitor');
const api = require('./plugins/api');

process.on('uncaughtException', function (err) {
    console.log('uncaughtException', err);
})

process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
});

function setup({ host, port, workspace }) {
    return new Promise((resolve, reject) => {
        const server = new Hapi.Server();

        server.connection({
            host,
            port
        });

        server.register(
            [
                {
                    register: janitor,
                    options: {
                        gitDir: workspace
                    }
                },
                api
            ],
            err => {
                if (err) {
                    return reject(err);
                }

                return resolve(server);
            }
        );
    });
}

module.exports = {
    setup
};
