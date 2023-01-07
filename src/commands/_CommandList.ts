import { CommandInterface } from "../interfaces/CommandInterface";
import { helpCommand } from "./helpCommand";
import { loopCommand } from "./loopCommand";
import { moveCommand } from "./moveCommand";
import { nowPlayingCommand } from "./nowPlayingCommand";
import { playCommand } from "./playCommand";
import { playPlaylistCommand } from "./playPlaylistCommand";
import { prefixCommand } from "./prefixCommand";
import { queueCommand } from "./queueCommand";
import { removeCommand } from "./removeCommand";
import { shuffleCommand } from "./shuffleCommand";
import { skipCommand } from "./skipCommand";
import { stopCommand } from "./stopCommand";
import { whiteCommand } from "./whiteCommand";

export const CommandList: CommandInterface[] = [
    helpCommand,
    prefixCommand,
    playCommand,
    playPlaylistCommand,
    whiteCommand,
    queueCommand,
    skipCommand,
    stopCommand,
    loopCommand,
    shuffleCommand,
    moveCommand,
    removeCommand,
    nowPlayingCommand,
];
