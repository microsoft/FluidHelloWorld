/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { getTinyliciousContainer } from "@fluidframework/get-tinylicious-container";

import {
  IKeyValueDataObject,
  ContainerRuntimeFactory,
} from "./kvpair-dataobject";
import { renderDiceRoller } from "./jsView";

let createNew = false;
if (location.hash.length === 0) {
  createNew = true;
  location.hash = Date.now().toString();
}
const documentId = location.hash.substring(1);
document.title = documentId;

async function start(): Promise<void> {
  // Get Fluid Container (creates new if new url)
  const container = await getTinyliciousContainer(
    documentId,
    ContainerRuntimeFactory,
    createNew
  );
  // Our dataObject is available at the URL "/".
  await container.request({ url: "/" }).then((response) => {
    if (response.status === 200) {
      renderDiceRoller(
        response.value as IKeyValueDataObject,
        document.getElementById("content") as HTMLDivElement
      );
    } else {
      console.log("Error loading");
    }
  });
}

start().catch((error) => console.error(error));
