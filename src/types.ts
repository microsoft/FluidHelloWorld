/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ISharedMap } from "@fluidframework/map";

/**
 * Render Dice into a given HTMLElement as a text character, with a button to roll it.
 * @param data - The Data to be rendered
 * @param div - The HTMLElement to render into
 */
export type IRenderView = (data: ISharedMap, div: HTMLDivElement) => void;
