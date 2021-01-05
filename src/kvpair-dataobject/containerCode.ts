/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ContainerRuntimeFactoryWithDefaultDataStore } from '@fluidframework/aqueduct';
import { KeyValueInstantiationFactory } from './DataObject';

/**
 * The ContainerRuntimeFactory is the container code for our scenario.
 *
 * This container code will create the single default data object on our behalf and make it available on the
 * Container with a URL of "/", so it can be retrieved via container.request("/").
 */
export const ContainerRuntimeFactory = new ContainerRuntimeFactoryWithDefaultDataStore(
    KeyValueInstantiationFactory,
    new Map([KeyValueInstantiationFactory.registryEntry])
);
