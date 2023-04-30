export enum WorkerOp {
  Disconnect = "DISCONNECT",
  DisconnectAll = "DISCONNECT_ALL",
  Join = "JOIN",
  OnVoiceServerUpdate = "ON_VOICE_SERVER_UPDATE",
  OnVoiceStateUpdate = "ON_VOICE_STATE_UPDATE",
  Play = "PLAY",
}

export enum WorkerEvent {
  ConnectionDestroy = "CONNECTION_DESTROY",
  VoiceStateUpdate = "VOICE_STATE_UPDATE",
}
