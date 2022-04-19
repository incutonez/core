# Core Code

The intent of this code is used as experiments for how to build commonly reused code for any application (both API and UI).  Do note that this leans heavily more on UI code, but there is a `shared` dir that both UI and API pull from.

## Running

The repo is set up using [NPM Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces), so the installation must be done at the repo's root.  I like the structure that workspaces provide because it gives it a more micro service/frontend meaning for the repo, if this was meaningful code.  This project uses Node v16.14.2 and npm v8.7.0.

- `cd core`
- `npm ci`
- `npm run ui`
- `npm run api`
