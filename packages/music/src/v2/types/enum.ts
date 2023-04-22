export enum WorkerOp {
  onVoiceStateUpdate,
  onVoiceServerUpdate,
  play,
  join,
  disconnect,
  disconnectAll,
}

export enum WorkerEvent {
  VOICE_STATE_UPDATE,
  CONNECTION_DESTROY,
}
