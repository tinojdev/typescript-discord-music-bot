import { Message, TextChannel, VoiceChannel } from "discord.js";
import { Song } from "../interfaces/SongInterface";
import {
    entersState,
    joinVoiceChannel,
    VoiceConnection,
    AudioPlayer,
    AudioPlayerStatus,
    createAudioResource,
    AudioPlayerPlayingState,
    VoiceConnectionStatus,
    DiscordGatewayAdapterCreator,
} from "@discordjs/voice";
import play from "play-dl";
import logger from "../logger";

/**
 * Map that holds all of the queues based on guildId
 */
const CurrentQueues: { [guildId: string]: SongQueue } = {};
/**
 * Get a queue by the guildId
 */
export const getQueue = (guildId: string): SongQueue | undefined => {
    return CurrentQueues[guildId];
};

/**
 * Add a queue
 */
export const addQueue = (queue: SongQueue): void => {
    CurrentQueues[queue.guildId] = queue;
};
/**
 * Remove a queue by guildId
 */
export const removeQueue = (guildId: string): void => {
    delete CurrentQueues[guildId];
};
/**
 * Transforms seconds to a readable string representation
 * @param seconds amount of seconds
 * @returns a string with format of "hh:mm:ss"
 */
export const secondsToString = function secondsToString(seconds: number): string {
    const h = Math.floor(seconds / 3600)
        .toString()
        .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, "0");
    const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    if (h == "00") return m + ":" + s;
    return h + ":" + m + ":" + s;
};

/**
 * Songqueue is a class that represents the bot in the voice call. Essentially a voice connection with local state
 */
export class SongQueue {
    /**Array of songs which are in queue, doesn't include the currently playing song*/
    songs: Array<Song> = [];
    /**Represents the voice connection to the  channel*/
    connection!: VoiceConnection;
    /**Used to play audio resources*/
    musicPlayer!: AudioPlayer;
    /**The voice channel in which the bot plays songs*/
    voiceChannel: VoiceChannel;
    /**Id of the message channel where this bot was initialized in*/
    msgChannel: TextChannel;
    /**Id of the channel */
    guildId: string;
    /** The song which is played currently*/
    currentlyPlaying!: Song;
    songLooping: Boolean = false;

    constructor(msg: Message) {
        if (!msg.member?.voice.channel?.id) {
            logger.error("Error in creation of Songqueue: no voice channel id");
            throw Error("Error in creation");
        }

        if (!msg.member.voice.channel.isVoiceBased()) {
            logger.error("Error in creation of Songqueue: channel is not a voice channel");
            throw Error("Error in creation");
        }
        if (!msg.guildId) {
            logger.error("Error in creation of songqueue: no guildId");
            throw Error("Error in creation");
        }
        this.guildId = msg.guildId;
        this.msgChannel = <TextChannel>msg.channel;
        this.voiceChannel = <VoiceChannel>msg.member.voice.channel;

        try {
            this.connect(this.voiceChannel);
        } catch (error: any) {
            logger.error(`Error in connecting to voice channel: ${error.name}\n${error.message}`);
        }

        addQueue(this);
    }
    connect(channel: VoiceChannel) {
        logger.debug(`Connecting to voice channel: ${channel.name}`);

        this.connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guildId,
            adapterCreator: channel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
        });

        this.connection.on("error", (error) => {
            logger.error(`Error in the connection: ${error.name}\n${error.message}`);
        });

        // Remove this queue once it disconnects from the voicechannel
        this.connection.on("stateChange", (oldState, newState) => {
            if (newState.status == VoiceConnectionStatus.Disconnected) {
                removeQueue(this.guildId);
            }
        });

        this.musicPlayer = new AudioPlayer();
        this.musicPlayer.on("error", (e) => {
            this.skip();
            logger.error(`Error in the music player: 
            name: ${e.name},
            msg: ${e.message}`);
        });

        // Gets run after a song finishes
        this.musicPlayer.on("stateChange", (oldState, newState) => {
            if (oldState.status == AudioPlayerStatus.Playing && newState.status == AudioPlayerStatus.Idle) {
                if (this.songLooping) {
                    this.songs.unshift(this.currentlyPlaying);
                }
                this.playNext();
            }
        });

        this.connection.subscribe(this.musicPlayer);
    }

    addSong(song: Song) {
        this.songs.push(song);
    }
    addSongs(songs: Song[]) {
        songs.forEach((song) => this.songs.push(song));
    }
    dequeueSong(): Song | undefined {
        return this.songs.shift();
    }
    async playNext() {
        const songToPlay = this.dequeueSong();
        if (!songToPlay) {
            removeQueue(this.guildId);
            this.connection.destroy();
            return;
        }
        this.currentlyPlaying = songToPlay;
        const source = await play.stream(songToPlay.url, {
            discordPlayerCompatibility: true,
            quality: 2,
            // encoderArgs: ["-af", "bass=g=40, aresample=3000"]
        });
        // TODO: Add a timeout to the start and try again if fails

        const resource = createAudioResource(source.stream, { inputType: source.type });
        this.musicPlayer.play(resource);
        entersState(<AudioPlayer>this.musicPlayer, AudioPlayerStatus.Playing, 3000).catch((error) => {
            logger.error(`Error in entering to playing state! ${error.name}\n${error.message}`);
            this.msgChannel.send(`Error in playing ${songToPlay.title}!`).catch((error) => {});
        });

        logger.debug(`Playing ${songToPlay.title}`);
    }
    getQueue(): Array<Song> | undefined {
        if (!this.songs) {
            return undefined;
        }
        return this.songs;
    }
    skip() {
        this.playNext();
    }
    stop() {
        this.songs.splice(0, this.songs.length);
        this.skip();
    }
    loop() {
        if (this.songLooping) {
            this.songLooping = false;
        } else {
            this.songLooping = true;
        }
    }
    shuffle() {
        for (let i = this.songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.songs[i], this.songs[j]] = [this.songs[j], this.songs[i]];
        }
    }
    /**
     * Move a song in the queue
     * @param startPos starting index of the song to move (1-len)
     * @param endPos ending index of the song to move (1-len)
     * @returns error message and true if succesful
     */
    move(startPos: number, endPos: number): [string | undefined, boolean] {
        const songs = this.songs;
        if (startPos < 1) return ["Starting position must be 1 or over", false];
        if (startPos > songs.length) return ["Starting position must be less than the length of the queue", false];
        if (endPos < 1) return ["Ending position must be 1 or over", false];
        if (endPos > songs.length)
            return [`Ending position must be less than the length of the queue (length: ${songs.length})!`, false];
        if (startPos == endPos) return [undefined, true];

        const sIndex = startPos - 1;
        const eIndex = endPos - 1;
        const elemToMove = songs[sIndex];

        if (eIndex > sIndex) {
            for (let i = sIndex; i <= eIndex; i++) songs[i] = songs[i + 1];
            songs[eIndex] = elemToMove;
        } else {
            for (let i = sIndex; i >= eIndex; i--) songs[i] = songs[i - 1];
            songs[eIndex] = elemToMove;
        }

        return [undefined, true];
    }
    /**
     * Remove a song or songs from the queue
     * @param startPos index of the song to remove (1-len)
     * @param endPos ending index of the possible range (1-len)
     * @returns error message and true if succesful
     */
    remove(startPos: number, endPos?: number): [string | undefined, boolean] {
        const songs = this.songs;
        if (startPos < 1) return ["Song number must be 1 or over", false];
        if (startPos > songs.length) return ["No such song!", false];
        if (endPos != undefined && endPos <= startPos)
            return ["Ending position must be bigger than starting position", false];
        if (endPos != undefined && endPos > songs.length)
            return [`Ending position must be less than the length of the queue (length: ${songs.length})!`, false];

        const sIndex = startPos - 1;

        if (endPos) {
            songs.splice(sIndex, endPos - sIndex);
        } else {
            songs.splice(sIndex, 1);
        }
        return [undefined, true];
    }

    getCurrentlyPlaying(): Song {
        return this.currentlyPlaying;
    }
    getTimePlayedInCurrent(): number {
        const status = <AudioPlayerPlayingState>this.musicPlayer.state;
        if (status.playbackDuration == undefined) return 0;
        else return status.playbackDuration / 1000;
    }
    getTotalLengthOfQueue(): number {
        var total: number = this.currentlyPlaying.seconds - this.getTimePlayedInCurrent();
        for (let i = 0; i < this.songs.length; i++) {
            const song = this.songs[i];
            total += song.seconds;
        }

        return total;
    }
}
