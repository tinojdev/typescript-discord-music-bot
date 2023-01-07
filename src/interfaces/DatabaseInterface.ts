import { DatabaseSong } from "./SongInterface";

export interface PrefixDatabase {
    [userId: string]: string;
}


export interface PlaylistDatabase {
    [serverId: string]: {
        [playlistName: string]: DatabaseSong[];
    }
}