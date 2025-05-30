# GHGA Data Portal

This repository contains the Angular 19 front-end application for the GHGA data portal.

<!-- toc -->

- [GHGA Data Portal](#ghga-data-portal)
  - [Local testing](#local-testing)
    - [API requests \& the backend](#api-requests--the-backend)
    - [Authentication](#authentication)
  - [Code scaffolding](#code-scaffolding)
  - [Building](#building)
  - [Package Manager](#package-manager)
  - [Linter, Commits, and Documentation](#linter-commits-and-documentation)
    - [Ease of use](#ease-of-use)
  - [Testing](#testing)
    - [Unit-tests](#unit-tests)
    - [End-to-End tests](#end-to-end-tests)
      - [Issues relating to headed execution](#issues-relating-to-headed-execution)
  - [The Architecture Matrix](#the-architecture-matrix)
  - [References](#references)
  - [License](#license)

<!-- tocstop -->

## Local testing

To start a local development server, run:

```bash
dev_launcher
```

Once the server is running, open your browser and navigate to `http://localhost:8080/`. The application will automatically reload whenever you modify any of the source files.

By default, this will not use a proxy configuration; the API will be provided via the mock service worker, and the authentication will be faked as well.

### API requests & the backend

If you want to test the application against the backend provided by the staging deployment, then run:

```bash
dev_launcher --with-backend
```

In this case, a proxy configuration will be used that proxies all API endpoints to the staging environment, while the application itself is still served by the development server. You can change the name of the staging backend via the environment variable `data_portal_base_url`; by default it will be `data.staging.ghga.dev`.

If the staging backend requires an additional Basic authentication, you can set it in the environment variable `data_portal_basic_auth`.

### Authentication

If you want to test authentication using the real OIDC provider, then run:

```bash
dev_launcher --with-oidc
```

---

**NOTE**

The development server will serve the application via SSL in this mode, using the certificate created in `.devcontainer/cert.pem`. You should add the corresponding CA certificate `.devcontainer/ca-cert.pem` to the trusted certificates of your development computer or web browser to avoid the warnings when loading the page.

---

In this mode, the `data_portal_oidc_client_id` and the other OIDC settings must be set properly as required by the OIDC provider.

You will also need to change the hosts file on your host computer so that localhost points to the staging backend. If you use the default staging backend, then you can browse the application at `https://data.staging.ghga.dev`.

To test against the real backend and with the real OIDC provider, you can start the development server like this:

```bash
dev_launcher --with-backend --with-oidc
```

It is recommended to put the necessary settings, particularly the credentials that should be kept secret, in the `local.env` file inside the `.devcontainer` directory. It should look something like this:

```env
data_portal_base_url=https://data.staging.ghga.dev
data_portal_basic_auth=USERNAME:PASSWORD
data_portal_oidc_client_id=THE_OIDC_CLIENT_ID
```

## Code scaffolding

The Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

or

```bash
ng g c component-name
```

for short.

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile the project and store the build artifacts in the `dist/` directory. By default, the production build optimizes the application for performance and speed.

## Package Manager

This project uses pnpm to install dependencies, which is a replacement for the much slower npm. Run

```bash
pnpm install
```

to install the dependencies.

---

**NOTE**

You should not have a `package-lock.json` but instead a `pnpm-lock.yaml`. You can still use npm for running other commands or to install global packages but not to add dependencies or to install all dependencies.

---

## Linter, Commits, and Documentation

The repository is set up in such a way to only allow linted commits. That means commits are blocked by Husky if they cause linter errors (currently, warnings are accepted). This ensures that code quality standards are maintained without building up technical debt that has to be fixed later on.

To ensure deterministic behavior, the pre-commit hook _does not_ attempt to fix linter errors. Most of the time, you will be fine by simply running `ng lint --fix`, which attempts to automatically fix most of the issues. If we ran that in the hook, however, you would be committing different code than the one you checked. So if you cannot commit your code, run lint fix. If that doesn't resolve all the issues (which you can see by running `ng lint`), resolve those issues and try again.

### Ease of use

For comfort, we are adding these shorthands: `pnpm run lint`, `pnpm run lf` (for `lint --fix`), and `pnpm run docs` (to build and serve the documentation). Apart from seeing the linter warnings when you (try to) commit or run the linter manually, your IDE should also show you these warnings in the code, and fixing (the auto-fixable ones) should be offered in the context menu on hover or via `Ctrl-.`.

## Testing

### Unit-tests

We are using [Jest](https://jestjs.io/) for unit testing in this project. If possible, the queries and matchers from the [Testing Library](https://testing-library.com/) should be used. See the documentation for the [Angular Testing Library](https://testing-library.com/docs/angular-testing-library/intro/) and [jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/).

The unit tests are not included in the linting process and can be executed separately by running `npm run test`. These three variants of running the tests are provided:

- `npm run test:coverage` - also collect and report test coverage information
- `npm run test:parallel` - use parallel processes (currently slower, probably due to inefficient transpilation)
- `npm run test:watch` - continually watch files for changes and rerun tests related to changed files

You can also use the VS Code extension for Jest to run tests interactively using the test explorer in the side bar.

Note that modernizing the unit testing tooling is on the roadmap of the Angular team for 2025. We may need to change some parts of the tooling when the official solution is provided.

### End-to-End tests

We are using [Playwright](https://playwright.dev/) for end-to-end (e2e) testing in this project. See the [documentation for Playwright](https://playwright.dev/docs/) for details.

- `npm run e2e` - run e2e-tests in headless mode
- `npm run e2e:headed` - run e2e tests in headed mode
- `npm run e2e:debug` - run e2e tests in headed mode with Playwright inspector
- `npm run e2e:report` - open HTML report for e2e tests

Like for unit testing, you can also [use the VS Code extension for Playwright](https://playwright.dev/docs/getting-started-vscode) to run tests interactively using the test explorer in the side bar. VS Code is able to support different test providers (like Jest and Playwright) along with each other.

#### Issues relating to headed execution

In order for the headed execution to work in the dev container, an X11 server must be running on the host.

On macOs, you can use [XQuartz](https://www.xquartz.org/). On Windows with WSL 2, you can use the built-in WSLg as X11 server. See [here](https://github.com/microsoft/wslg/wiki/Diagnosing-%22cannot-open-display%22-type-issues-with-WSLg) if that is not working properly.

The directory `/tmp/.X11-unix` should exist and should be mounted on the corresponding host directory, which is `/mnt/wslg/.X11-unix` for WSLg. If you run `ls /tmp/.X11-unix`, it should show `X0`. If that is not the case, you may need to add or modify volume mounts manually in the `docker-compose.local.yml` file, of which a suitable version is created for you on startup.

## The Architecture Matrix

This application is built as a modularized frontend monolith (a "modulith") using vertical slices and layers as module boundaries, which are enforced using the linter.

The vertical slices correspond to the different feature areas or bounded contexts within the application, such as _metadata_ or _access-requests_. Additionally, we have a vertical slice called _portal_ that contains all overarching features, such as the home page (which displays a metadata summary) and the user profile page (which shows the user's access requests). Another slice, called _shared_, provides UI components or utilities used across all feature areas. Authentication and user session handling are implemented in a separate slice called _auth_.

The horizontal layers are named _features_ (for feature components, i.e., smart components), _ui_ (for presentational components, i.e., dumb components), _services_ (for accessing domain objects and corresponding application logic), _models_ (for interfaces of domain objects), and _utils_ (for feature-specific utility functions). The _services_ layer primarily contains Angular services, while the _utils_ layer includes pure pipes, guards, and custom utility functions.

This results in the following architecture matrix:

| portal   | metadata | access-requests | ... | auth     | shared   |
| -------- | -------- | --------------- | --- | -------- | -------- |
| features | features | features        | ... | features | features |
| ui       | ui       | ui              | ... | ui       | ui       |
| services | services | services        | ... | services | services |
| models   | models   | models          | ... | models   | models   |
| utils    | utils    | utils           | ... | utils    | utils    |

To create a clean architecture, the following rules are checked when importing modules from the architecture matrix:

- Modules within a vertical slice must only import modules from the same slice, as these slices represent bounded contexts.
- An exception is that all vertical slices are allowed to use modules from the _shared_ vertical slice.
- Another exception is that the _portal_ slice is allowed to use feature components from other feature areas.
- Additionally, the three bottom layers of the _auth_ slice may be used in other slices.
- Each module is only allowed to use modules from the layers below it.
- An exception is that the _ui_ layer may not use modules from the _services_ layer.

## References

- [Playwright](https://playwright.dev/) and the docs for it [docs for it](https://playwright.dev/docs/).
- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
- [Pnpm](https://pnpm.io/) and [the docs for it](https://pnpm.io/motivation).
- [Jest](https://jestjs.io/) for unit tests. [Testing Library](https://testing-library.com/) for queries with an [Angular integration](https://testing-library.com/docs/angular-testing-library/intro/) and [jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/).

## License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for more details.
