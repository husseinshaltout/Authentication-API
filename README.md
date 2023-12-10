# Authentication API

A simple Authentication API with Express Js with Mongodb Database.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file (.env_template file could be renamed and used)

`NODE_ENV` \
`CORS_WHITELIST` \
`PORT` \
`LOG_LEVEL` \
`CLIENT_URL` \
`ACCESS_JWT_EXPIRY_DURATION_MINUTES` \
`ACCESS_JWT_SECRET` \
`REFRESH_JWT_EXPIRY_DURATION_MINUTES` \
`REFRESH_JWT_SECRET` \
`REFRESH_COOKIE_NAME` \
`REFRESH_COOKIE_PATH` \
`PEPPER` \
`SALT_ROUNDS` \
`DATABASE_URI` \
`DATABASE_PASSWORD` \

## Run Locally

Clone the project

```bash
  git clone https://github.com/husseinshaltout/Authentication-API.git
```

Go to the project directory

```bash
  cd Authentication-API
```

Install dependencies

```bash
  npm install
```

Watch mode

```bash
  npm run start:dev
```

Start on production server

```bash
  npm run start
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Build

To build, run the following command

```bash
  npm run build
```

## Usage/Examples

```bash
GET
http://localhost:3000/me
```

- Add Bearer Authorization to header for endpoint that requires token (can be identified from [REQUIREMENTS.md](./docs/REQUIREMENTS.md))

  `Authorization   Bearer <token>`

- JWT can be acquired after creating user from login endpoint

```bash
POST
http://localhost:3000/signin
```

## Authors

- [@husseinshaltout](https://www.github.com/husseinshaltout)
