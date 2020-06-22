# houseplant-tracker

A simple app to help make sure plants get watered.

## Get started

Install the dependencies...

```bash
cd houseplant tracker
npm install
```

Start a postgres server in docker

```bash
docker run --rm --name houseplant-tracker-test -e POSTGRES_PASSWORD=replaceme -d -p 5432:5432 postgres
```

Run the db migrations

```bash
npx prisma migrate up --experimental
```

Seed the test data

```bash
node ./src/seed.js
```

Then start [Rollup](https://rollupjs.org) to run the frontend dev server:

```bash
npm run dev
```

Start the backend server in a separate shell (Runs on port 3000)

```bash
node ./src/server.js
```

Navigate to [localhost:5000](http://localhost:5000).

## Running tests

```bash
npm run test
```

## Format code

```bash
npm run format
```

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. 

