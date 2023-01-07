import { CommandInterface } from "../interfaces/CommandInterface";
import { getQueue, SongQueue } from "../utils/SongQueue";
import { searchSongFromArgs } from "../utils/searchSongs";

export const playCommand: CommandInterface = {
    name: "play",
    description: "Play a song from an url or from text!",
    aliases: ["p", "jeff"],
    argsDescription: "[query or url]",
    runFromMessage: async (message, args) => {
        if (!message.member?.voice.channelId) {
            message.channel.send("You need to be in a voice channel!");
            return;
        }
        if (args.length == 0) {
            message.channel.send("You have not provided an url or a song name!");
            return;
        }
        const searchResult = await searchSongFromArgs(args, message.author.username);

        if (!searchResult) {
            message.channel.send("Couldn't find any songs :((");
            return;
        }

        if (!message.guildId) {
            return;
        }
        const queue: SongQueue | undefined = getQueue(message.guildId);

        if (queue) {
            queue.addSong(searchResult);
            message.channel.send(`Added ${searchResult.title} to the queue!`);
        } else {
            try {
                const queue = new SongQueue(message);
                queue.addSong(searchResult);
                queue.playNext();
                message.channel.send(`Playing ${searchResult.title}!`);
            } catch (err) {
                console.warn("Error in queue creation: " + err);
            }
        }
    },
};
