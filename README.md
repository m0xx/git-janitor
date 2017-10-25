# Git Janitor

Too many feature branches? 

*Git Janitor* can help you to visualize fully merged branch and clean up your repo through a local web interface.


# Development

create a `.env` file in the root directory and add `JANITOR_GITDIR` with the location of a git repository.

For example:
```
JANITOR_GITDIR=c:/users/awesome-user/projects/project-a
```

Run server and client

```
npm install
npm run start:client
npm run start:server
```