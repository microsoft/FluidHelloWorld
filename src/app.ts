/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { TinyliciousService } from "@fluid-experimental/get-container";

import { Fluid } from '@fluid-experimental/fluid-static';
import { getContainerId } from './utils/getContainerId';
import { jsRenderView as renderView } from './view/jsView';
import { DiceRollerDO } from "./DiceDO";
if (typeof window === 'undefined') {
    require('dotenv').config()
}

const { containerId, isNew } = getContainerId();

async function start(): Promise<any> {
    const service = new TinyliciousService();

    const fluidContainer = isNew
        ? await Fluid.createContainer(service, containerId, [DiceRollerDO])
        : await Fluid.getContainer(service, containerId, [DiceRollerDO]);

    const keyValueDataObject: DiceRollerDO = isNew
        ? await fluidContainer.createDataObject(DiceRollerDO, 'kvpairId')
        : await fluidContainer.getDataObject('kvpairId');

    if (typeof window !== 'undefined') {
        renderView(keyValueDataObject, document.getElementById('content') as HTMLDivElement);
    } else {

        keyValueDataObject.RollDice();
    }
}

start().catch((error) => console.error(error));
