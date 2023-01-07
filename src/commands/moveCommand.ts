import { CommandInterface } from "../interfaces/CommandInterface";
import { getQueue, SongQueue } from "../utils/SongQueue";

export const moveCommand: CommandInterface = {
    name: "move",
    description: "Move a song from one position to another",
    aliases: ["mv"],
    argsDescription: "[from] [to]",
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
        const endPos = Number(args[1]);

        if (!startPos || !endPos) {
            message.channel.send("Invalid arguments!");
            return;
        }


        const [error, success] = queue.move(startPos, endPos);

        if (!success) {
            message.channel.send(error!);
            return;
        }
        message.channel.send(`Song from position ${startPos} has been moved to ${endPos}!`);

    },
}