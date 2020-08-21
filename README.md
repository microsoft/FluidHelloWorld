# @fluid-example/hello-world

This repository contains a simple app that enables all connected clients to roll a dice and view the result.
For a walkthrough of this example and how it works, check out the [tutorial documentation](TBD).

## Getting Started

After cloning the repository, install dependencies with:

```bash
npm i
```

Clients collaborating on Fluid connect to a service that orchestrates the collaboration.  This example uses a locally-running test service, which can be started with:

```bash
npm run start:server
```

The client code is hosted on a separate server.  With the test service running, open a separate terminal to start the test server for the client code with:

```bash
npm start
```

Once both servers are running, navigate to http://localhost:8080 to try out the example.  This will generate an id in the URL hash (e.g. http://localhost:8080/#1596520748752) which you can then open in a separate tab to observe changes propagating between clients.
