/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { getDefaultObjectFromContainer } from "@fluidframework/aqueduct";
import { getTinyliciousContainer } from "@fluidframework/get-tinylicious-container";

import { DiceRollerContainerRuntimeFactory } from "./containerCode";
import { IDiceRoller } from "./dataObject";
import { renderDiceRoller, ACFluid } from "./view";
import { createGenericDDS_TLC, getGenericDDS_TLC, IGenericDDS }  from "./GenericDDS";

import { aklog, akwarn, akerr, akinfo, aklogj, akdebug } from "./MyLog";


// In interacting with the service, we need to be explicit about whether we're creating a new document vs. loading
// an existing one.  We also need to provide the unique ID for the document we are creating or loading from.

// In this app, we'll choose to create a new document when navigating directly to http://localhost:8080.  For the ID,
// we'll choose to use the current timestamp.  We'll also choose to interpret the URL hash as an existing document's
// ID to load from, so the URL for a document load will look something like http://localhost:8080/#1596520748752.
// These policy choices are arbitrary for demo purposes, and can be changed however you'd like.

// @ts-ignore
let createNew = false;
if (location.hash.length === 0) {
    createNew = true;
    location.hash = 'c1n'; // Date.now().toString();
}
const documentId = location.hash.substring(1);
document.title = documentId;

function getModelDefinition(hash: string) {
    if (hash.length <= 1) hash = '#c1n';
    hash = hash.substring(1);

    let createNew = false;
    if (hash.endsWith('n')) {
        createNew = true;
        hash = hash.substring(0, hash.length - 1);
    }

    return {
        id: hash,
        createNew,
        modelDefn: 'checklist'
        // todo: initial data
    }
}

// @ts-ignore
async function start(): Promise<void> {

    // The getTinyliciousContainer helper function facilitates loading our container code into a Container and
    // connecting to a locally-running test service called Tinylicious.  This will look different when moving to a
    // production service, but ultimately we'll still be getting a reference to a Container object.  The helper
    // function takes the ID of the document we're creating or loading, the container code to load into it, and a
    // flag to specify whether we're creating a new document or loading an existing one.
    const modelDefinition = getModelDefinition(location.hash);
    (window as any).docId = modelDefinition.id;
    const container = await getTinyliciousContainer(modelDefinition.id, DiceRollerContainerRuntimeFactory, modelDefinition.createNew);

    // In this app, we know our container code provides a default data object that is an IDiceRoller.
    const diceRoller: IDiceRoller = await getDefaultObjectFromContainer<IDiceRoller>(container);
    (window as any).dc = diceRoller;

    // Given an IDiceRoller, we can render the value and provide controls for users to roll it.
    const div = document.getElementById("content") as HTMLDivElement;
    renderDiceRoller(diceRoller, div);

    // Reload the page on any further hash changes, e.g. in case you want to paste in a different document ID.
    window.addEventListener("hashchange", () => {
        location.reload();
    });
}

async function start2(): Promise<void> {
    let w = window as any;
    w.w = w;
    let appDefStr = JSON.stringify(ACFluid);
    w.appDefnStr = appDefStr;

    const modelDefinition = getModelDefinition(location.hash);
    let genericDDS: IGenericDDS;

    if (modelDefinition.createNew)
    {
        aklog("Creating new model for : " + modelDefinition.id);
        genericDDS = await createGenericDDS_TLC(modelDefinition.id, appDefStr);
    }
    else
    {
        aklog("Using exisiting model for : " + modelDefinition.id);
        genericDDS = await getGenericDDS_TLC(modelDefinition.id);
    }

    const logDDSValue = async () => {
        let o = await genericDDS?.getValueObject();
        aklogj("modelChanged", o);
    };

    genericDDS.on("modelChanged", logDDSValue);
    logDDSValue();

    w.g = {
        gfc: genericDDS,
        l : logDDSValue,
        c0: {
            title: "Checklist 0 - empty",
            items: []
        },
        c1: {
            title: "Checklist 1 - ak",
            items: 
            [
                {
                    _id: 'i1',
                    status: false,
                    text: 'c1 item 0',
                }
            ]
        },
        c1a: {
            title: "Checklist 1a - ak",
            items: 
            [
                {
                    _id: 'i1',
                    status: true,
                    text: 'c1a item 0',
                }
            ]
        },
        c2: {
            title: "Checklist 2 - amrut",
            items: 
            [
                {
                    _id: 'i1',
                    status: false,
                    text: 'c2 item 1',
                },
                {
                    _id: 'i2',
                    status: true,
                    text: 'c2 item 2',
                }

            ]
        },
        c2a: {
            title: "Checklist 2a - amrut",
            items: 
            [
                {
                    _id: 'i1',
                    status: false,
                    text: 'c2a item 1',
                },
                {
                    _id: 'i2',
                    status: true,
                    text: 'c2a item 2',
                }

            ]
        },
    };
    


    /*

    let v = await genericDDS.getValueObject();
    console.log(JSON.stringify(v, null, "\t"));

    await genericDDS.setValueObject(w.g.c1);
    v = await genericDDS.getValueObject();
    aklog(v);

    await genericDDS.setValueObject(w.g.c2);
    v = await genericDDS.getValueObject();
    aklog(v);

    await genericDDS.setValueObject(w.g.c1);
    v = await genericDDS.getValueObject();
    aklog(v);
    */
} 

//start().catch((error) => console.error(error));

start2().catch((error) => {
    akerr("App.ts top level error:", error);
});


// todo: GFCContainerRuntimeFactory (GFC = GenericFluidComponent)
