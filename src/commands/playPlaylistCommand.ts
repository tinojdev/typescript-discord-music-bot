import { CommandInterface } from "../interfaces/CommandInterface";
import { getQueue, SongQueue } from "../utils/SongQueue";
import { searchPlaylistFromArgs, searchPlaylistFromId } from "../utils/searchSongs";


export const playPlaylistCommand: CommandInterface = {
    name: "playplaylist",
    description: "Play a song from an url or from text!",
    aliases: ["pp"],
    argsDescription: "[query]",
    runFromMessage: async (message, args) => {

        if (!message.member?.voice.channelId) {
            message.channel.send("You need to be in a voice channel!")
            return;
        }

        const searchResult = await searchPlaylistFromArgs(args, message.author.username);
        if (!searchResult) {
            message.channel.send("Couldn't find any playlists :((");
            return;
        }
        message.channel.send("Found a playlist: " + searchResult.title + ", with " + searchResult.songAmount + " songs!");

        await searchPlaylistFromId(searchResult);

        if (!searchResult.songs) {
            message.channel.send("Dollar store error");
            return;
        }

        searchResult.songs.forEach(element => {
            element.addedBy = message.author.username;
        });

        if (!message.guildId) {return;}
        const queue: SongQueue | undefined = getQueue(message.guildId);

        if (queue) {
            searchResult.songs.forEach(e => queue.addSong(e))
        } else {
            try {
                const queue = new SongQueue(message);
                searchResult.songs.forEach(e => queue.addSong(e));
                queue.playNext();
                message.channel.send(`Playing ${searchResult.songs[0].title}!`);
            } catch (err) {
                console.warn("Error in queue creation: " + err);
            }
        }
    },
}
