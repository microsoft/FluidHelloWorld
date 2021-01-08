# @fluid-example/hello-world

This repository contains a simple app that enables all connected clients to roll a dice and view the result.
For a walkthrough of this example and how it works, check out the [tutorial documentation](https://aka.ms/fluid/tutorial).

## Getting Started

After cloning the repository, install dependencies and start the application

```bash
npm install
npm start
```

## Tutorial

In this walkthrough, we’ll learn about using the Fluid Framework by building a simple DiceRoller application together. To get started, make sure you have cloned this repo and followed the steps above.

In our DiceRoller app we’ll show users a die with a button to roll it. When the die is rolled, we’ll use Fluid Framework to sync the data across clients so everyone sees the same result. We’ll do this using the following steps.

1. Choose a DataObject to store our Fluid state
2. Create a container to hold an instance of that Fluid state
3. Write a view to render and modify that Fluid state

### Choosing a DataObject

A Fluid [DataObject](https://fluidframework.com/docs/glossary/#dataobject) is "designed to organize distributed data structures into semantically meaningful groupings for your scenario, as well as, providing an API surface to your data".

In subsequent demos we will look at building custom DataObjects, but for many use cases (including this dice roller) the built in KeyValuePair DataObject will work perfectly.

The KVPair DataObject provides the basic functionality to set and get data of any type on a given key, and inform your application when the data in that key changes.

#### Using KeyValuePair DataObject

```ts
// Set the string 'some data' to the key 'MyDataKey'
kvpair.set('MyDataKey', 'some data');

// Retrieve the string stored in 'MyDataKey'
kvpair.get('MyDataKey'); // returns string 'some data'

// Set a 'changed' event that logs the event when any data changes
kvpair.on('changed', (event) => console.log(event));

// Changed callback is called each time a key's value is changed
kvpair.set('MyDataKey', 'some new data'); // logs { key: 'MyDataKey', path: '/', previousValue: 'some data' }
```

### Creating a Fluid Container

Fluid [Containers](https://fluidframework.com/docs/glossary/#container) are your applications entry point to the Fluid Framework.

To create our container we combine a unique ID (pulled from a hash in the URL) with the container factory that includes DataObject we want to use. Since these containers are created on the client, the client needs to determine if the document is existing or new, so in the absence of that URL hash, we'll pass in `true` for the 3rd parameter, `createNew`.

```ts
const container = await getTinyliciousContainer(docId, containerFactory, createNew);
```
