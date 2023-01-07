export interface Song extends DatabaseSong {
    addedBy: string;
}

export interface DatabaseSong {
    title: string;
    url: string;
    seconds: number;
    thumbnail: string;
}

export interface SongPlaylist {
    title: string;
    songAmount: number;
    id: string;
    songs?: Song[];
    addedBy: string;
}