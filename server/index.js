const Server = require('./server');

Server.setup({
        host: '0.0.0.0',
        port: 8000,
        workspace: process.env.JANITOR_WORKSPACE
    })
    .then((server) => {
        return server.start()
            .then(() => {
                console.log(`Server running at ${server.info.uri}`);
            })
    })