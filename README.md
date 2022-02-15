# Certificate reader for travel industry

This is an API resporstory for certificate reader project. To read more about the whole project and frontend: https://github.com/Dataatti/sertifikaattilukija/blob/main/README.md

## Features

Periodically fetch data from certificate issuers and serve the data to frontend.

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

| Variable                | Value                                                   |
| ----------------------- | ------------------------------------------------------- |
| DATABASE_CONNECTION_URL | PostgreSQL connection url                               |
| PORT                    | (Optional) Start server in specific port, default: 4242 |

### Application

Install project dependencies based on lockfile

```bash
  npm install
```

Run the development server

See [Starting server with vscode debugger](#starting-server-with-vscode-debugger)

### Starting server with vscode debugger

- Create `.vscode/launch.json`
- Add lines below to the file

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "runtimeVersion": "16.14.0",
      "type": "node",
      "request": "launch",
      "name": "Launch api server",
      "program": "${workspaceFolder}/server.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "outputCapture": "std",
      "cwd": "${workspaceFolder}/dist",
      "envFile": "${workspaceFolder}/.env"
    }
  ]
}
```

- Fill in missing env variables

### Run tests with jest

Jest tests are run against all pull and push requests by [a quality check Github action](https://github.com/Dataatti/sertifikaattilukija-api/blob/main/.github/workflows/run_tests.yml).

To run tests locally run

```bash
npm run test
```

## Data scraping and database

Company information is fetched from [PRH Open Data](https://avoindata.prh.fi/index_en.html)

The list of scraped certificate websites is based on the certificates that are part of Business Finland's [Sustainable Travel Finland](https://www.businessfinland.fi/suomalaisille-asiakkaille/palvelut/matkailun-edistaminen/vastuullisuus/sertifioinnit--ohjelmat) program.
