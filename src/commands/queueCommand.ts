import { CommandInterface } from "../interfaces/CommandInterface";
import { getQueue, secondsToString, SongQueue } from "../utils/SongQueue";
import { EmbedBuilder, EmbedField } from "discord.js";
import logger from "../logger";

export const queueCommand: CommandInterface = {
    name: "queue",
    description: "Displays the current queue.",
    aliases: ["q"],
    argsDescription: "[Amount of songs to show]?",
    runFromMessage: async (message, args) => {
        if (!message.member?.voice.channelId) {
            message.channel.send("You need to be in a voice channel!");
            return;
        }
        if (!message.guildId) {
            return;
        }
        const queue: SongQueue | undefined = getQueue(message.guildId);
        if (!queue) {
            message.channel.send("There is no bot playing in this channel!");
            return;
        }
        //User defined max amount of songs to show
        let userMax: number;
        // Default value if user doesn't specify max amount
        const defaultMax = 5;
        const songs = queue.getQueue();
        const songsLeft = songs?.length || 0;

        try {
            if (args[0]) {
                userMax = Number(args[0]);
                if (userMax > 24) message.channel.send("Hit the discord max only 24 songs are shown!");
                userMax = Math.min(userMax, 24);
            } else {
                userMax = defaultMax;
            }
        } catch (error) {
            message.channel.send("Invalid argument");
            return;
        }
        const maxAmount = Math.min(songsLeft, userMax);

        const current = queue.getCurrentlyPlaying();
        const totalLength = queue.getTotalLengthOfQueue();
        const timeLeftInCurrent = current.seconds - queue.getTimePlayedInCurrent();

        const fields: EmbedField[] = [];
        // 200 = the amount that the boilerplate text takes
        let charAmount = 200;
        // Maximum char amount in a discord embed
        const maxCharAmount = 6000;
        let done = false;
        let i = 1;

        if (songsLeft == 0) {
            fields.push({ name: "Queued next:", value: "Nothing in queue!", inline: false });
            done = true;
        } else {
            fields.push({
                name: "Queued next:",
                value:
                    `1. [${songs![0].title}](${songs![0].url})` +
                    ` | **__${secondsToString(songs![0].seconds)}__** | ` +
                    "By: " +
                    "`" +
                    songs![0].addedBy +
                    "`" +
                    "\n",
                inline: false,
            });
        }

        while (!done && i < maxAmount) {
            const song = songs![i];
            const valueString =
                i +
                1 +
                `. [${song.title}](${song.url})` +
                ` | **__${secondsToString(song.seconds)}__** | ` +
                "By: " +
                "`" +
                song.addedBy +
                "`" +
                "\n";
            charAmount += valueString.length;
            if (charAmount > maxCharAmount) {
                done = true;
                message.channel.send(`Hit the discord char limit, only ${Math.min(i + 1, userMax)} songs are shown.`);
                break;
            }
            fields.push({ name: "\u200b", value: valueString, inline: false });
            i++;
        }

        fields.push({
            name: `${songsLeft} songs in queue | ${secondsToString(totalLength)} total time left`,
            value: "🦧🦧🦧",
            inline: false,
        });
        const embed = new EmbedBuilder();
        embed.setTitle("Currently playing:");
        embed.setDescription(`[${current.title}](${current.url})`);
        embed.setColor(15198183);
        embed.setThumbnail(current.thumbnail);
        embed.setFields(fields);

        message.channel.send({ embeds: [embed] }).catch((error) => {
            const e = <Error>error;
            logger.error(`Error in sending embed: ${e.name}, \n${e.message}`);
        });
    },
};
