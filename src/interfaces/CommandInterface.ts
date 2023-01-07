import { CommandInteraction, Message } from "discord.js";

export interface CommandInterface {
    name: string;
    description: string;
    aliases: Array<string>;
    argsDescription: string | undefined;
    runFromMessage: (message: Message, args: Array<string>) => Promise<void>;    
}
