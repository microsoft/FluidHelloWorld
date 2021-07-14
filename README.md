# @fluid-example/hello-world

This repository contains a simple app that enables all connected clients to roll a dice and view the result. For a
walkthrough of this example and how it works, check out the [tutorial documentation](https://aka.ms/fluid/tutorial).

## Requirements

Node 12.17+

## Getting Started

After cloning the repository, install dependencies and start the application

```bash
npm install
npm start
```

## Tutorial

In this walkthrough, you'll learn about using the Fluid Framework by building a simple DiceRoller application together.
To get started, make sure you have cloned this repo and followed the steps above.

In our DiceRoller app you'll show users a die with a button to roll it. When the die is rolled, you'll use Fluid Framework
to sync the data across clients so everyone sees the same result. you'll do this using the following steps.

1. Choose a Fluid data structure to store our Fluid state.
2. Create a container to hold an instance of that Fluid state.
3. Write a view to render and modify that Fluid state.

### Choosing a data structure

Fluid's distributed data structures underpin all Fluid apps. While distributed data structures are low-level data
structures, they provide familiar APIs and consistent merge behavior, and can serve a number of needs directly.

Fluid also provides DataObjects, which are designed to organize distributed data structures into semantically meaningful
groupings as well as provide an API surface to your data.

In subsequent demos you will look at building custom DataObjects, but for many use cases (including this dice roller) the
built in distributed data structures will work perfectly.

#### Using SharedMap distributed data structure

The SharedMap distributed data structure provides the basic functionality to set and get data of any JSON-serializable
type on a given key, and inform your application when the data in that key changes.

```ts
// Set the string 'some data' to the key 'MyDataKey'
myMap.set('MyDataKey', 'some data');

// Retrieve the string stored in 'MyDataKey'
myMap.get('MyDataKey'); // returns string 'some data'

// Set a 'changed' event that logs the event when any data changes
myMap.on('changed', (event) => console.log(event));

// Changed callback is called each time a key's value is changed
myMap.set('MyDataKey', 'some new data'); // logs { key: 'MyDataKey', path: '/', previousValue: 'some data' }
```

### Creating and loading a Fluid container

[Fluid containers](https://fluidframework.com/docs/glossary/#container) are your application's entry point to the Fluid
Framework.

In order to create or load a Fluid container you need to know its ID. Typically applications will use a service or user
interaction to create and retrieve these IDs, similar to a file picker or loading a saved game instance.

For demo purposes the `getContainerId` function simplifies ID creation by generating and returning a hash of the current
timestamp as the new container ID. If the URL already has a hash, it assumes that a container with that ID has already
been created and returns that hash value as the ID. The function also returns `isNew`, a Boolean value indicating
whether the container is to be created or loaded.

### Accessing Fluid data

Fluid requires a backing service to enable collaborative communication. Before you can access any Fluid data, you need
to make a call to the service to retrieve or create a container.

`FrsClient` is the service client used in this example. `FrsClient` supports deployed Azure Fluid Relay service
instances for production purposes, as well as a local, in-memory service instance, called Tinylicious, for development
purposes. It also provides methods to create a Fluid container with a set of initial distributed data structures or
DataObjects that are defined in the `containerSchema`.

The service connection and container configurations will vary depending on the service. `FrsClient` requires only an ID
for a container, but other service clients may have different requirements.

The `containerSchema` defines the name of the container and a set of `initialObjects`. `initialObjects` is a map that
defines Fluid objects that will be created when the container is first created. The key provided can be used to access
the initialObject from the container like so: `fluidContainer.initialObjects.myKey`.

```ts
const { id, isNew } = getContainerId();

// This configures the FrsClient to use a local in-memory service called Tinylicious.
// You can run Tinylicious locally using 'npx tinylicious'.
const localConfig: FrsConnectionConfig = {
    tenantId: "local",
    tokenProvider: new InsecureTokenProvider("tenantId", { id: "userId" }),
    // if you're running Tinylicious on a non-default port, you'll need change these URLs
    orderer: "http://localhost:7070",
    storage: "http://localhost:7070",
};
const client = new FrsClient(localConfig);

const containerConfig: FrsContainerConfig = { id };
const containerSchema: ContainerSchema = {
    name: "hello-world-demo-container",
    initialObjects: { dice: SharedMap }
};

const { fluidContainer } = isNew
    ? await client.createContainer(containerConfig, containerSchema)
    : await client.getContainer(containerConfig, containerSchema);

renderView(
    fluidContainer.initialObjects.dice as ISharedMap,
    document.getElementById('content') as HTMLDivElement
);
```
