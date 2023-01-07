import { CommandInterface } from "../interfaces/CommandInterface";
import { getQueue, SongQueue } from "../utils/SongQueue";
import { searchPlaylistFromArgs, searchPlaylistFromId } from "../utils/searchSongs";

export const whiteCommand: CommandInterface = {
    name: "white",
    description: "Gets white people turnt!",
    aliases: ["w"],
    argsDescription: undefined,

    runFromMessage: async (message, args) => {
        if (!message.member?.voice.channelId) {
            message.channel.send("You need to be in a voice channel!");
            return;
        }

        const searchResult = await searchPlaylistFromArgs(
            ["PLYUrYPSO93bq0q_LrNx-K0CNWJc8wcgva"],
            message.author.username
        );

        if (!searchResult) {
            message.channel.send("Dollar store error");
            return;
        }

        message.channel.send("Getting white people turned up!");

        await searchPlaylistFromId(searchResult);

        if (!searchResult.songs) {
            message.channel.send("Dollar store error");
            return;
        }

        searchResult.songs.forEach((element) => {
            element.addedBy = message.author.username;
        });

        const queue: SongQueue | undefined = getQueue(message.channelId);
        3;
        if (queue) {
            searchResult.songs.forEach((e) => queue.addSong(e));

            message.channel.send(`Added ${searchResult.songs.length} song(s) to the queue!`);
        } else {
            try {
                const queue = new SongQueue(message);
                searchResult.songs.forEach((e) => queue.addSong(e));
                queue.shuffle();
                queue.playNext();
                message.channel.send(`Added ${searchResult.songs.length} song(s) to the queue!`);
                message.channel.send(`Playing ${queue.currentlyPlaying.title}!`);
            } catch (err) {
                console.warn("Error in queue creation: " + err);
            }
        }
    },
};
