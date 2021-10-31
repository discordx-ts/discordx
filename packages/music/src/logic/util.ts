import _ from "lodash";
import spotify from "spotify-url-info";
import ytpl from "ytpl";
import ytsr from "ytsr";

export class Util {
  static async search(
    input: string,
    type: "Video" | "Playlist",
    options?: ytsr.Options
  ): Promise<ytsr.Item[]> {
    const filters = await ytsr.getFilters(input);
    const search = filters.get("Type")?.get(type);
    if (!search || !search.url) {
      return [];
    }

    const result = await ytsr(search.url, options);
    return result.items;
  }

  static async getSong(input: string): Promise<ytsr.Video | undefined> {
    const filters = await ytsr.getFilters(input);
    const search = filters.get("Type")?.get("Video");
    if (!search || !search.url) {
      return;
    }

    const result = await ytsr(search.url, { limit: 1 });
    if (result.items.length < 1 || result.items[0]?.type !== "video") {
      return;
    }

    // Extract the video URL from the command
    const song = result.items[0];

    return song;
  }

  static async getSongs(inputs: string[]): Promise<ytsr.Video[]> {
    const results = await Promise.all(
      inputs.map((input) => this.getSong(input))
    );
    return _.compact(results);
  }

  static async getPlaylist(
    input: string,
    options?: ytsr.Options
  ): Promise<ytpl.Result | undefined> {
    const filters = await ytsr.getFilters(input);
    const search = filters.get("Type")?.get("Playlist");
    if (!search || !search.url) {
      return;
    }

    const result = await ytsr(search.url, options ?? { limit: 1 });
    const playlistData = result.items[0];
    if (!playlistData || playlistData.type !== "playlist") {
      return;
    }

    const playlist = await ytpl(playlistData.playlistID);
    if (!playlist.items.length) {
      return;
    }

    return playlist;
  }

  static async getSpotifyTracks(
    url: string
  ): Promise<spotify.Tracks[] | undefined> {
    try {
      return await spotify.getTracks(url);
    } catch (err) {
      return undefined;
    }
  }
}
