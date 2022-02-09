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
