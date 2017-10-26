const Janitor = require('./../../lib/janitor');

const janitor = (server, options, next) => {
    const { gitDir } = options;

    if (!gitDir) {
        return next('gitdir should be defined');
    }
    Janitor.init({ workspace: gitDir })
        .then(janitor => {
            server.expose('janitor', janitor);

            next();
        })
        .catch(err => {
            next(err);
        });
};

janitor.attributes = {
    name: 'janitor',
    version: '1.0.0'
};

module.exports = janitor;
