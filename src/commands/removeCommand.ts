import { CommandInterface } from "../interfaces/CommandInterface";
import { getQueue, SongQueue } from "../utils/SongQueue";

export const removeCommand: CommandInterface = {
    name: "remove",
    description: "Remove a song from the queue. Optionally remove a range of songs.",
    aliases: ["rm"],
    argsDescription: "[from | song number] [to]?",
    runFromMessage: async (message, args) => {

        if (!message.member?.voice.channelId) {
            message.channel.send("You need to be in a voice channel!")
            return;
        }
        if (!message.guildId) {return;}
        const queue: SongQueue | undefined = getQueue(message.guildId);

        if(!queue) {
            message.channel.send("There is no bot playing in this channel!");
            return;
        }
        const startPos = Number(args[0]);
        if (!startPos && startPos != 0) {
            message.channel.send("Invalid argument for start position!");
            return;
        }
        const hasEndPos = args[1] != undefined;
        const endPos = hasEndPos ? Number(args[1]) : undefined;


        const [error, success] = queue.remove(startPos, endPos);

        if (!success) {
            message.channel.send(error!);
            return;
        }
        if (hasEndPos) {
            message.channel.send(`Songs from ${startPos} to ${endPos} have been removed`);
        } else {
            message.channel.send(`Song from position ${startPos} has been removed`);
        }

    },
}