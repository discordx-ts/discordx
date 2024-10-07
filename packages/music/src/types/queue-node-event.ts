/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { ParentProcessDataPayload } from "./communication-parent.js";

export enum QueueEvent {
  ParentProcessEvent = "PARENT_PROCESS_EVENT",
}

export interface QueueEventPayloads {
  [QueueEvent.ParentProcessEvent]: ParentProcessDataPayload;
}
