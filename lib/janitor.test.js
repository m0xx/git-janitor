const path = require('path');
const Git = require('nodegit');
const uuid = require('uuid');
const fs = require('fs');
const { testWorkspace } = require('./../test-utils');
const Janitor = require('./janitor');

const { Repository, Signature, Reference, CheckoutOptions } = Git;

function generateDirName() {
    return path.join(testWorkspace, uuid.v4().toString());
}
const createRepo = dir => {
    return Repository.init(dir, 0);
};

const commitFile = ({ repository, filename, content, message, parent }) => {
    fs.writeFileSync(path.join(repository.workdir(), filename), content);
    let index;

    return repository
        .refreshIndex()
        .then(function(indexResult) {
            index = indexResult;
        })
        .then(function() {
            return index.addByPath(filename);
        })
        .then(function() {
            return index.write();
        })
        .then(function() {
            return index.writeTree();
        })
        .then(function(oid) {
            const author = repository.defaultSignature();

            const parents = [];
            if (parent) {
                parents.push(parent);
            }

            return repository.createCommit(
                'HEAD',
                author,
                author,
                message,
                oid,
                parents
            );
        });
};

test('list all branches', done => {
    const dir = generateDirName();
    const context = {};

    createRepo(dir)
        .then(repository => {
            context.repository = repository;

            return commitFile({
                repository,
                filename: 'file.txt',
                content: 'Hello you!',
                message: 'my commit!'
            });
        })
        .then(commit => {
            const { repository } = context;
            return repository.createBranch(
                'new-branch',
                commit,
                0,
                repository.defaultSignature(),
                'Created new-branch on HEAD'
            );
        })
        .then(branch => {
            return Janitor.init({ workspace: dir });
        })
        .then(janitor => {
            return janitor.listBranches();
        })
        .then(branches => {
            const shorthands = branches.map(branch => branch.shorthand);

            expect(branches).toHaveLength(2);
            expect(shorthands).toContain('master');
            expect(shorthands).toContain('new-branch');

            done();
        });
});

test('list commit history for a branch', done => {
    const dir = generateDirName();
    const context = {};

    createRepo(dir)
        .then(repository => {
            context.repository = repository;

            return commitFile({
                repository,
                filename: 'file.txt',
                content: 'Hello you!',
                message: 'my commit!'
            });
        })
        .then(() => {
            return Janitor.init({ workspace: dir });
        })
        .then(janitor => {
            return janitor.currentBranch();
        })
        .then(branch => {
            expect(branch).toMatchObject({
                name: 'refs/heads/master',
                shorthand: 'master',
                isRemote: false
            });

            done();
        });
});

test('get current branch', done => {
    const dir = generateDirName();
    const context = {};

    createRepo(dir)
        .then(repository => {
            context.repository = repository;

            return commitFile({
                repository,
                filename: 'file.txt',
                content: 'Hello you!',
                message: 'my commit!'
            });
        })
        .then(commit => {
            context.commit = commit;

            return Janitor.init({ workspace: dir });
        })
        .then(janitor => {
            return janitor.commitHistory('refs/heads/master');
        })
        .then(commits => {
            expect(commits).toHaveLength(1);
            expect(commits[0].message).toBe('my commit!');

            done();
        });
});

test('difference between branches', done => {
    const dir = generateDirName();
    const context = {};

    const BRANCH_A = 'master';
    const BRANCH_B = 'new-branch';

    createRepo(dir)
        .then(repository => {
            context.repository = repository;

            return commitFile({
                repository,
                filename: 'file.txt',
                content: 'Hello you!',
                message: 'my commit!'
            });
        })
        .then(commit => {
            context.parent = commit;
            const { repository } = context;

            return repository.createBranch(
                BRANCH_B,
                commit,
                0,
                repository.defaultSignature(),
                'Created new-branch on HEAD'
            );
        })
        .then(() => {
            const { repository } = context;

            return repository.checkoutBranch(BRANCH_B);
        })
        .then(reference => {
            const { repository, parent } = context;

            return commitFile({
                repository,
                filename: 'file-2.txt',
                content: 'Hello',
                message: 'git is awesome',
                parent
            });
        })
        .then(commit => {
            return Janitor.init({ workspace: dir });
        })
        .then(janitor => {
            return janitor.difference(BRANCH_A, BRANCH_B);
        })
        .then(commits => {
            expect(commits).toHaveLength(1);

            done();
        })
        .catch(err => {
            console.log(err);
        });
});

test('difference between branches', done => {
    const dir = generateDirName();
    const context = {};

    const BRANCH_A = 'master';
    const BRANCH_B = 'new-branch';

    createRepo(dir)
        .then(repository => {
            context.repository = repository;

            return commitFile({
                repository,
                filename: 'file.txt',
                content: 'Hello you!',
                message: 'initial commit'
            });
        })
        .then(commit => {
            context.initialCommit = commit;
            const { repository } = context;

            return repository.createBranch(
                BRANCH_B,
                commit,
                0,
                repository.defaultSignature(),
                'Created new-branch on HEAD'
            );
        })
        .then(() => {
            const { repository } = context;
            return repository.checkoutBranch(BRANCH_A)
        })
        .then(() => {
            const { repository, initialCommit } = context;

            return commitFile({
                repository,
                filename: 'file-2.txt',
                content: 'Hello',
                message: 'git is awesome',
                parent: initialCommit
            });
        })
        .then(commit => {
            return Janitor.init({ workspace: dir });
        })
        .then(janitor => {
            return janitor.difference(BRANCH_A, BRANCH_B);
        })
        .then(commits => {
            expect(commits).toHaveLength(0);

            done();
        })
        .catch(err => {
            console.log(err);
        });
});
