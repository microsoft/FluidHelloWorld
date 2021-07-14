/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Each Fluid document needs a unique ID. Typically applications will leverage a service to create
 * and retrive these IDs, similar to a file picker or loading a saved game instance.
 *
 * For demo purposes the getContainerId function simplifies ID creation by generating and returning
 * a hash of the current timestamp as the new document ID. If the URL already has a hash,
 * we assume that a document with that ID has already been created and we return that
 * hash value as the ID.
 */
export const getContainerId = (): { id: string; isNew: boolean } => {
    let isNew = false;
    if (location.hash.length === 0) {
        isNew = true;
        location.hash = Date.now().toString();
    }
    const id = location.hash.substring(1);
    return { id, isNew };
};
