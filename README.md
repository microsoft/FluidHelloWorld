# @fluid-example/hello-world

This repository contains a simple app that enables all connected clients to roll a dice and view the result. For a
walkthrough of this example and how it works, check out the [tutorial documentation](https://aka.ms/fluid/tutorial).

## Requirements

Node 14.19+

## Getting Started

After cloning the repository, install dependencies and start the application

```bash
npm install
npm start
```

### Running `AzureClient` against local service instance

To run against a remote Azure Client service instance, we make use of `InsecureTokenProvider`.
The `InsecureTokenProvider` requires we pass in two values to its constructor, a key string and an `IUser` type object identifying the current user.

```typescript
import { AzureClient } from "@fluidframework/azure-client";
import { InsecureTokenProvider } from "@fluidframework/test-client-utils";
const clientProps = {
    connection: {
        type: "remote",
        tenantId: "" /*REPLACE WITH YOUR TENANT ID*/,
        tokenProvider: new InsecureTokenProvider("" /*REPLACE WITH YOUR PRIMARY KEY*/, {
            userId: "userId",
            userName: "Test User",
        }),
        endpoint: "" /*REPLACE WITH YOUR AZURE ENDPOINT*/,
    },
};

const azureClient = new AzureClient(clientProps);
```

To run application with a live Azure instance, replace the missing tenant id, primary key, and endpoint corresponding to the code snippet above. Next, install dependencies and start the application

```bash
npm install
npm start:azure
```
