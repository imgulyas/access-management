# DAML Access Management toy system

Resources, access to them and the approval process are encoded as smart contract templates in DAML.

The frontend lets you request access to resources and approve requests in a friendly way.

## How to build and run

* Install [DAML SDK 1.31](https://docs.daml.com/getting-started/installation.html)
* Install npm
* `daml start` in root of repo to build the backend and start the in-memory ledger
* `npm install && npm start` in ui folder to build and start frontend

## How to toy with it

* Login as Alice, admin1, admin2 or admin3 to play around
* change the `setup` script in AccessManagement.daml to change resource preconditions and users