const path = require('path');
const fse = require('fs-extra');
const testWorkspace = path.join(__dirname, '.test');

module.exports = {
    testWorkspace,
    rmdir: p => {
        if (p.indexOf(testWorkspace) !== 0) {
            throw "Can't delete a file outside the test workspace.";
        }

        fse.removeSync(p);
    }
};
