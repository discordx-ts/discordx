/* 
 Credits: https://github.com/DevSnowflake/discord-ytdl-core
 Modified by: Vijay Meena <indianoceanroleplay@gmail.com>
 Reason: for @discordx/music
*/

import pkg from "prism-media";
import type { Duplex, Readable } from "stream";
import ytdl from "ytdl-core";

const { FFmpeg, opus: Opus } = pkg;

// ytdl events
const evn = [
  "info",
  "progress",
  "abort",
  "request",
  "response",
  "error",
  "redirect",
  "retry",
  "reconnect",
];

interface YTDLStreamOptions extends ytdl.downloadOptions {
  encoderArgs?: string[];
  fmt?: string;
  opusEncoded?: boolean;
  seek?: number;
}

interface StreamOptions {
  encoderArgs?: string[];
  fmt?: string;
  opusEncoded?: boolean;
  seek?: number;
}

/**
 * Create an opus stream for your video with provided encoder args
 * @param url - YouTube URL of the video
 * @param options - YTDL options
 * @example const ytdl = require("discord-ytdl-core");
 * const stream = ytdl("VIDEO_URL", {
 *     seek: 3,
 *     encoderArgs: ["-af", "bass=g=10"],
 *     opusEncoded: true
 * });
 * VoiceConnection.play(stream, {
 *     type: "opus"
 * });
 */
const StreamDownloader = (url: string, options?: YTDLStreamOptions) => {
  if (!url) {
    throw new Error("No input url provided");
  }
  if (typeof url !== "string") {
    throw new SyntaxError(
      `input URL must be a string. Received ${typeof url}!`
    );
  }

  let FFmpegArgs: string[] = [
    "-analyzeduration",
    "0",
    "-loglevel",
    "0",
    "-f",
    `${options?.fmt ? options.fmt : "s16le"}`,
    "-ar",
    "48000",
    "-ac",
    "2",
  ];

  if (options?.seek) {
    FFmpegArgs.unshift("-ss", options.seek.toString());
  }

  if (options?.encoderArgs) {
    FFmpegArgs = FFmpegArgs.concat(options.encoderArgs);
  }

  const transcoder = new FFmpeg({
    args: FFmpegArgs,
  });

  const inputStream = ytdl(url, options);
  const output = inputStream.pipe(transcoder);
  if (options && !options.opusEncoded) {
    for (const event of evn) {
      inputStream.on(event, (...args) => output.emit(event, ...args));
    }
    inputStream.on("error", () => transcoder.destroy());
    output.on("close", () => transcoder.destroy());
    return output;
  }

  const opus = new Opus.Encoder({
    channels: 2,
    frameSize: 960,
    rate: 48e3,
  });

  const outputStream = output.pipe(opus);

  output.on("error", (e) => outputStream.emit("error", e));

  for (const event of evn) {
    inputStream.on(event, (...args) => outputStream.emit(event, ...args));
  }

  outputStream.on("close", () => {
    transcoder.destroy();
    opus.destroy();
  });
  return outputStream;
};

/**
 * Creates arbitraryStream
 *
 * @param stream - Any readable stream source
 * @param options - Stream options
 *
 * @example const streamSource = "https://listen.moe/kpop/opus";
 * let stream = ytdl.arbitraryStream(streamSource, {
 *     encoderArgs: ["-af", "asetrate=44100*1.25"],
 *     fmt: "mp3"
 * });
 *
 * stream.pipe(fs.createWriteStream("kpop.mp3"));
 */
const arbitraryStream = (
  stream: string | Readable | Duplex,
  options?: StreamOptions
) => {
  if (!stream) {
    throw new Error("No stream source provided");
  }

  let FFmpegArgs: string[];
  if (typeof stream === "string") {
    FFmpegArgs = [
      "-reconnect",
      "1",
      "-reconnect_streamed",
      "1",
      "-reconnect_delay_max",
      "5",
      "-i",
      stream,
      "-analyzeduration",
      "0",
      "-loglevel",
      "0",
      "-f",
      `${options?.fmt ? options.fmt : "s16le"}`,
      "-ar",
      "48000",
      "-ac",
      "2",
    ];
  } else {
    FFmpegArgs = [
      "-analyzeduration",
      "0",
      "-loglevel",
      "0",
      "-f",
      `${options?.fmt ? options.fmt : "s16le"}`,
      "-ar",
      "48000",
      "-ac",
      "2",
    ];
  }

  if (options?.seek) {
    FFmpegArgs.unshift("-ss", options.seek.toString());
  }

  if (options?.encoderArgs) {
    FFmpegArgs = FFmpegArgs.concat(options.encoderArgs);
  }

  let transcoder = new FFmpeg({
    args: FFmpegArgs,
  });
  if (typeof stream !== "string") {
    transcoder = stream.pipe(transcoder);
    stream.on("error", () => transcoder.destroy());
  }
  if (options && !options.opusEncoded) {
    transcoder.on("close", () => transcoder.destroy());
    return transcoder;
  }
  const opus = new Opus.Encoder({
    channels: 2,
    frameSize: 960,
    rate: 48e3,
  });

  const outputStream = transcoder.pipe(opus);
  outputStream.on("close", () => {
    transcoder.destroy();
    opus.destroy();
  });
  return outputStream;
};

StreamDownloader.arbitraryStream = arbitraryStream;

const DiscordYTDLCore = Object.assign(StreamDownloader, ytdl);

export { DiscordYTDLCore as ytdl };
