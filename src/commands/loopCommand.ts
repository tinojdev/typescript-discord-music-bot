import { CommandInterface } from "../interfaces/CommandInterface";
import {getQueue, SongQueue } from "../utils/SongQueue";

export const loopCommand: CommandInterface = {
    name: "loop",
    description: "Loop the current song",
    aliases: [],
    argsDescription: undefined,
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
        if (!queue.songLooping) {
            queue.loop();
            message.channel.send("Looping the current song 🔁");
        } else {
            queue.loop();
            message.channel.send("No longer looping.");
        }
        


    },
}