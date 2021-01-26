# @fluid-example/hello-world

This repository contains a simple app that enables all connected clients to roll a dice and view the result.
For a walkthrough of this example and how it works, check out the [tutorial documentation](https://aka.ms/fluid/tutorial).

## Getting Started

After cloning the repository, install dependencies with:

```bash
npm install
```

You can then run the example with:

```bash
npm start
```

This will open a browser window to the example.  You can navigate to the same URL in a second window to see changes propagating between clients.

**NOTE**: Since the dice are represented by ASCII, they may appear differently depending on your browser.

To webpack the bundle and output the result in `./dist`, you can run:

```bash
npm run build
```
