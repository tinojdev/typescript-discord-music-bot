/**
 * A database integration
 */
import path from "path";
import { PrefixDatabase, PlaylistDatabase } from "../interfaces/DatabaseInterface";
import { readFile, writeFile } from "fs/promises";
import { existsSync, writeFileSync } from "fs";
import Config from "../config";
import { DatabaseSong } from "../interfaces/SongInterface";

export const dbPath = path.join(__dirname, "../../database");
export const dbPrefixPath = path.join(dbPath, "prefixes.json");
export const dbPlaylistPath = path.join(dbPath, "playlists.json");

const dbPaths = [dbPrefixPath, dbPlaylistPath];
/**
 * Commands to interact with cold storage, aka .json files
 */
namespace ColdStorage {
    /**
     * Creates nescessary migrations, aka creates .json files for each database.
     */
    const migrate = () => {
        dbPaths.forEach((db) => {
            if (!existsSync(db)) {
                writeFileSync(db, "{}", "utf-8");
            }
        });
    };
    migrate();

    const getFileAsJson = async (path: string): Promise<any> => {
        return readFile(path, "utf-8");
    };
    /**
     * Cache of prefix database that maps user ids to prefix strings.
     * Created on first time that a prefix is requested
     */
    export let prefixCache: PrefixDatabase | undefined = undefined;
    export let playlistCache: PlaylistDatabase | undefined = undefined;
    export const loadPrefixCache = async () => {
        const prefixDb = <PrefixDatabase>await JSON.parse(await getFileAsJson(dbPrefixPath));
        prefixCache = prefixDb;
    };
    export const loadPlaylistCache = async () => {
        const playlistDb = <PlaylistDatabase>await JSON.parse(await getFileAsJson(dbPlaylistPath));
        playlistCache = playlistDb;
    };

    export const getPrefix = async (userId: string): Promise<string> => {
        if (!prefixCache) {
            await loadPrefixCache();
        }
        const userPrefix = prefixCache![userId];
        if (!userPrefix) return Config.getDefaultPrefix();
        return userPrefix;
    };

    export const setPrefix = async (userId: string, newPrefix: string) => {
        if (!prefixCache) {
            await loadPrefixCache();
        }
        prefixCache![userId] = newPrefix;
        const jsonString = JSON.stringify(prefixCache);
        await writeFile(dbPrefixPath, jsonString);
        await loadPrefixCache();
    };
}

export namespace Database {
    export const getPrefixForUser = async (userId: string): Promise<string> => {
        return ColdStorage.getPrefix(userId);
    };

    export const setPrefixForUser = async (userId: string, newPrefix: string) => {
        ColdStorage.setPrefix(userId, newPrefix);
    };

    export const getPlaylistForServer = async (serverId: string, newPlaylist: DatabaseSong[]) => {};

    export const getPlaylist = async (serverId: string) => {};

    export const setPlaylist = async (serverId: string, newPlaylist: DatabaseSong[]) => {};
}
