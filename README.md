# Starting server in debug mode

- Create `.vscode/launch.json`
- Add lines below to the file

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "runtimeVersion": "16.1.0",
      "type": "node",
      "request": "launch",
      "name": "Launch api server",
      "program": "${workspaceFolder}/server.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "outputCapture": "std",
      "env": {
        "PORT": "4242",
        "DATABASE_CONNECTION_URL":
      }
    }
  ]
}

```

- Fill in missing env variables

# Certificate reader for travel industry

This is an API resporstory for certificate reader project. More about the whole project https://github.com/Dataatti/sertifikaattilukija/blob/main/README.md

## Features

Data endpoint provides a open endpoint where you can search for comany sertificates by their name, vat-number, municipality or by the certificates they have. [Documentation](https://github.com/Dataatti/sertifikaattilukija-api/blob/main/services/data.md)

## Tech Stack

The data is fetched by scraping certificate provider websites with [Node.js](https://nodejs.org/en/) functions and saved to a [PostgreSQL](https://www.postgresql.org/) database.

The data is fetched periodicly every sunday using [Breejs](https://github.com/breejs/bree) to help with scheduling.

## How to run

### Installation

Clone the repository

```bash
  git clone https://github.com/Dataatti/sertifikaattilukija-api.git
```

Change to the project directory

```bash
  cd sertifikaattilukija-api
```

### Environment variables

Environment variables have to be set before running the application.

Either copy .env.example to local .env file and update values

```bash
  cp .env.example .env
```

or set them in a environment specific way (if you are running the application in a cloud provider for example).

#### Variable list

| Variable            | Value                                            |
| ------------------- | ------------------------------------------------ |
| NEXT_PUBLIC_API_URL | Full url of the Sertifikaattilukija-api instance |

### Application

Install project dependencies based on lockfile

```bash
  npm ci
```

Run the development server

```bash
  npm run dev
```

Open http://localhost:3000 with your browser to see the result.

### Cypress E2E tests

Cypress tests are run against all pull requests by [a quality check Github action](/.github/workflows/quality_check.yml).

Run E2E tests headlessly

```bash
  npm run cypress
```

Open Cypress for developing E2E tests

```bash
  npm run cypress:open
```

## Data scraping and database

Data scraping and database are found in a separate repository in [sertifikaattilukija-api](https://github.com/Dataatti/sertifikaattilukija-api).

The list of scraped certificate websites is based on the certificates that are part of Business Finland's [Sustainable Travel Finland](https://www.businessfinland.fi/suomalaisille-asiakkaille/palvelut/matkailun-edistaminen/vastuullisuus/sertifioinnit--ohjelmat) program.
