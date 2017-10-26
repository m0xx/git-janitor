const fs = require('fs');
const { testWorkspace, rmdir } = require('./test-utils');

try {
    rmdir(testWorkspace);
} catch (err) {}

fs.mkdirSync(testWorkspace);
