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

In this walkthrough, we’ll learn about using the Fluid Framework by building a simple DiceRoller application together.
To get started, make sure you have cloned this repo and followed the steps above.

In our DiceRoller app we’ll show users a die with a button to roll it. When the die is rolled, we’ll use Fluid Framework
to sync the data across clients so everyone sees the same result. We’ll do this using the following steps.

1. Choose a Fluid data structure to store our Fluid state.
2. Create a container to hold an instance of that Fluid state.
3. Write a view to render and modify that Fluid state.

### Choosing a Data Structure

Fluid's distributed data structures underpin all Fluid apps. While distributed data structures are low-level data
structures, they provide familiar APIs and consistent merge behavior, and can serve a number of needs directly.

Fluid also provides DataObjects, which are designed to organize distributed data structures into semantically meaningful
groupings as well as provide an API surface to your data.

In subsequent demos we will look at building custom DataObjects, but for many use cases (including this dice roller) the
built in distributed data structures will work perfectly.

The SharedMap distributed data structure provides the basic functionality to set and get data of any JSON-serializable
type on a given key, and inform your application when the data in that key changes.

#### Using KeyValuePair DataObject

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

### Creating a Fluid Container

[Fluid containers](https://fluidframework.com/docs/glossary/#container) are your application's entry point to the Fluid
Framework. Containers can be initialized with a set of `initialObjects` that 

In order to create or load a Fluid container we need to know its ID. Typically applications will use a service or user
interaction to create and retrieve these IDs, similar to a file picker or loading a saved game instance.

For demo purposes the `getContainerId` function simplifies ID creation by generating and returning a hash of the current
timestamp as the new container ID. If the URL already has a hash, it assumes that a container with that ID has already
been created and returns that hash value as the ID. The function also returns `isNew`, a boolean value indicating
whether the container is to be created or loaded.

`TinyliciousClient` is the service client we will use to connect to a local Fluid server. It also provides methods to
create a Fluid container with a set of initial DataObjects or DDSes that are defined in the `containerSchema`.
`TinyliciousClient` needs to be initialized before use and can take an optional configuration object to changes settings
such as default port.

### Accessing Fluid Data

Before we can access any Fluid data, we need to make a call to the `TinyliciousClient` with necessary service
configuration and container schema.

- `serviceConfig` is will vary depending on the service. `TinyliciousClient` only requires an `id` for the container.
- `containerSchema` defines the name of the container and a set of `initialObjects`. `initialObjects` is a map that
  defines Fluid objects that will be created when the container is first created. The key provided can be used to access
  the initialObject from the container like so: `myContainerInstance.initialObjects.myKey`.

```ts
const { id, isNew } = getContainerId();

const serviceConfig = { id };

const containerSchema: ContainerSchema = {
    name: 'hello-world-demo-container',
    initialObjects: { dice: SharedMap }
};

const [fluidContainer] = isNew
    ? await TinyliciousClient.createContainer(serviceConfig, containerSchema)
    : await TinyliciousClient.getContainer(serviceConfig, containerSchema);

renderView(
    fluidContainer.initialObjects.dice as ISharedMap,
    document.getElementById('content') as HTMLDivElement
);
```
