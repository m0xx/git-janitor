require('dotenv').config();

if (!process.env.JANITOR_GITDIR) {
    console.log("Environment variable 'JANITOR_GITDIR' should be set");
    process.exit(1);
}

const Server = require('./server');

Server.setup({
    host: '0.0.0.0',
    port: 8000,
    workspace: process.env.JANITOR_GITDIR
})
    .then(server => {
        return server.start().then(() => {
            console.log(`Server running at ${server.info.uri}`);
        });
    })
    .catch(err => {
        console.log(err);
    });
