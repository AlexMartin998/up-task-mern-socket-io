# UpTask - MERN & Socket.io - Back end

This is a full stak project developed with MERN Stack and Socket.io to give it a real time behavior to the CRUD operations of the tasks.

## Running the app

```
# install dependencies
npm i

# run in dev mode on port 3000
npm run dev

# generate production build
npm run build

# run generated content in dist folder on port 3000
npm run start
```

## Running the app with Docker

Running the app in a development environment with docker on port 3300

```
docker compose -f docker-compose-dev.yml up --build
```

## View demo

To see the real-time behavior you can log in with:

- User 1: `adrian@test.com` and password `test123`.
- User 2: `adrian2@test.com` and password `test123`.

[Demo](https://uptask-mern-io-adrianlx.netlify.app/)

## Testing

### Jest with supertest

```
npm run test
```

#### Use watch

```
npm run test-watch
```

### Mocha with chai and chai-http

```
npm run test-mocha
```
