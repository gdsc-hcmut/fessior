# Fessior

Core backend for Fessior Tools project

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

...

## Technology

### Routing

To custom the route, open file [app.module](./src/app.module.ts) and looking for **RouteModule** to add your route.

### Versioning

URI Versioning uses the version passed within the URI of the request, such as `https://example/v1/route` and `https://example/v1/route`

- In this repo, the default version is `v1`.
- We can set version for all routes within the controller which will override the default. See sample [here](./src/templates/templates.controller.ts)
- Also, we can set version for an individual route which will override other version. See sample [here](./src/templates/templates.controller.ts)

### Environment

To use an environment variable, we declare it within file [global.d](./typings/global.d.ts)

### Swagger

The OpenAPI specification is a language-agnostic definition format used to describe RESTful APIs.

While the application is running, open your browser and navigate to `http://localhost:3000/api-docs`. You should see the Swagger UI.
