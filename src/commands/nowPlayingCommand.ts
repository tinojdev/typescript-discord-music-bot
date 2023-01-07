import { EmbedBuilder } from "discord.js";
import { CommandInterface } from "../interfaces/CommandInterface";
import { secondsToString, SongQueue, getQueue } from "../utils/SongQueue";
import { Song } from "../interfaces/SongInterface";

function makeEmbed(songQueue: SongQueue, song: Song): EmbedBuilder {
    const embed = new EmbedBuilder()
        .setColor(15198183)
        .setTitle("Now playing:")
        .setDescription(`[${song.title}](${song.url}) \nLooping: ${songQueue.songLooping ? "✅" : "❌"}`)
        .setThumbnail(song.thumbnail);

    const totalLength = song.seconds;
    const timeRemaining = songQueue.getTimePlayedInCurrent();
    const percentage = timeRemaining / totalLength;
    const progress = Math.round(percentage * 20);
    const emptyProgress = 20 - progress;
    const progressText = "▇".repeat(progress);
    const emptyProgressText = "—".repeat(emptyProgress);
    const percentageText = Math.round(percentage * 100) + "%";

    const progressBar = `[${progressText}${emptyProgressText}] ${percentageText}`;

    embed.addFields({
        name: `Time played ${secondsToString(timeRemaining)} / ${secondsToString(totalLength)}`,
        value: progressBar,
    });

    return embed;
}

export const nowPlayingCommand: CommandInterface = {
    name: "now playing",
    description: "Displays the current song.",
    aliases: ["np"],
    argsDescription: undefined,
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
        const current = queue.getCurrentlyPlaying();
        const embed = makeEmbed(queue, current);
        message.channel.send({ embeds: [embed] });
    },
};
