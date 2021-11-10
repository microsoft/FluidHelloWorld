# @fluid-example/hello-world

This repository is based on the simple app example [FluidHelloWorld](https://github.com/microsoft/FluidHelloWorld)
of Microsoft that enables all connected clients to roll a dice and view the result. 

For a
walkthrough of this example and how it works, check out the [tutorial documentation](https://aka.ms/fluid/tutorial).

Purpose of this fork is to experiment with recording and sharing the sequence of dice values over all connected clients.

## Naive simplistic implementation
![Roll dice and show sequence](README_artifacts/RollDiceWithSequence.png)

The first naive simplistic implementation is by recording the array of dice values as a key-value in the `diceMap` of type `SharedMap` with the key `dice-values-key`. But every client who rolls the dice will execute the steps:

1. Retrieve the dice values
2. Append the new value
3. Save the updates set of dice values

If two customers do this at the same time the latest will win and overwrite the value of the other user.

This version is available in the branch https://github.com/svdoever/FluidHelloWorld/tree/feature/simplistic-sequence

## Requirements

Node 12.17+

## Getting Started

After cloning the repository, install dependencies and start the application

```bash
npm install
npm start
```