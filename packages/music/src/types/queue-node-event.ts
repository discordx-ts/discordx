import type { ParentProcessDataPayload } from "./communication-parent.js";

export enum QueueEvent {
  ParentProcessEvent = "PARENT_PROCESS_EVENT",
}

export interface QueueEventPayloads {
  [QueueEvent.ParentProcessEvent]: ParentProcessDataPayload;
}
