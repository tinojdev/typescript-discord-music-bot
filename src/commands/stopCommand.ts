import { CommandInterface } from "../interfaces/CommandInterface";
import { getQueue, SongQueue } from "../utils/SongQueue";

export const stopCommand: CommandInterface = {
    name: "stop",
    description: "Clears the queue and stops the bot",
    aliases: [],
    argsDescription: undefined,
    runFromMessage: async (message, args) => {
        if (!message.member?.voice.channelId) {
            message.channel.send("You need to be in a voice channel!")
            return;
        }
        if (!message.guildId) {return;}
        const queue: SongQueue | undefined = getQueue(message.guildId);
        if (!queue) {
            message.channel.send("There is no bot playing in this channel!");
            return;
        }
        queue.stop();
        message.channel.send("Cleared the queue and exited the voice channel 👍");
    },
}
