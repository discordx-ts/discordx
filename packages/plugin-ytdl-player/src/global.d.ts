/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

interface SpotifyTrack {
  artist: string;
  duration: number;
  name: string;
  previewUrl: string;
  uri: string;
}

interface Spotify {
  getTracks: (url: string) => Promise<SpotifyTrack[]>;
}

declare module "spotify-url-info" {
  function spotify(fetch: any): Spotify;
  export = spotify;
}
