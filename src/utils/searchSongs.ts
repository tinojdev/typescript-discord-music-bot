import ytsr, { Playlist, Video } from "ytsr";
import ytpl from "ytpl";
import { Song, SongPlaylist } from "../interfaces/SongInterface";

export async function searchSongFromArgs(args: string[], searchedBy: string): Promise<Song | undefined> {
    const query = args.join();

    const searchResult = await ytsr(query, {
        gl: "FI",
        hl: "en",
        limit: 25,
    });
    const s = searchResult.items.filter((i) => i.type == "video").map((j) => <Video>j);
    if (s.length == 0) {
        return undefined;
    }
    const result = s[0];
    const thumbnailUrl = result.bestThumbnail.url
        ? result.bestThumbnail.url
        : "https://live.staticflickr.com/2710/4147548418_626d61633e_z.jpg";
    const seconds = result.duration ? stringToSeconds(result.duration) : 0;

    const song: Song = {
        title: result.title,
        thumbnail: thumbnailUrl,
        url: result.url,
        seconds: seconds,
        addedBy: searchedBy,
    };
    return song;
}

export async function searchPlaylistFromArgs(args: string[], searchedBy: string): Promise<SongPlaylist | undefined> {
    const query = args.join();

    const searchResult = await ytsr(query, {
        gl: "FI",
        hl: "en",
        limit: 25,
    });
    const s = searchResult.items.filter((i) => i.type == "playlist").map((j) => <Playlist>j);
    if (s.length == 0) {
        return undefined;
    }
    const result = s[0];
    const playlist: SongPlaylist = {
        title: result.title,
        id: result.playlistID,
        songAmount: result.length,
        addedBy: searchedBy,
    };
    return playlist;
}

export async function searchPlaylistFromId(playlist: SongPlaylist): Promise<SongPlaylist> {
    const searchResult = await ytpl(playlist.id, {
        gl: "FI",
        hl: "en",
        limit: 200,
    });
    const results = searchResult.items.map((i) => {
        const res: Song = {
            addedBy: playlist.addedBy,
            seconds: i.durationSec ? i.durationSec : 0,
            thumbnail: i.bestThumbnail.url
                ? i.bestThumbnail.url
                : "https://live.staticflickr.com/2710/4147548418_626d61633e_z.jpg",
            title: i.title,
            url: i.url,
        };
        return res;
    });
    playlist.songs = results;
    return playlist;
}

// Converts a "hh:mm:ss" to an int of seconds
function stringToSeconds(args: string): number {
    const hms = args.split(":").map((a) => parseInt(a));
    var seconds = 0;
    if (hms.length == 2) {
        // Only has minutes and seconds
        seconds += 60 * hms[0];
        seconds += hms[1];
    } else if (hms.length == 3) {
        // Has hours aswell
        seconds += 60 * 60 * hms[0];
        seconds += 60 * hms[1];
        seconds += hms[2];
    }
    return seconds;
}
