import { Message } from "discord.js";
import { CommandList } from "../commands/_CommandList";
import { CommandInterface } from "../interfaces/CommandInterface";
import Config from "../config";
import { Database } from "../utils/database";
import { sanitizeString } from "../utils/utils";

export const onMessageCreate = async (message: Message) => {
    if (message.author.bot) return;

    const msgContent = message.content;
    const args = message.content.split(" ").map((arg) => sanitizeString(arg));
    const userPrefix = await Database.getPrefixForUser(message.author.id);
    const defaultPrefix = Config.getDefaultPrefix();

    // Determnine the correct prefix since user can use the default prefix or custom prefix
    let prefix: string;
    if (msgContent.startsWith(userPrefix)) prefix = userPrefix;
    else if (msgContent.startsWith(defaultPrefix)) prefix = defaultPrefix;
    else return;

    // The first word with prefix omitted, eg. for argument !play Song name -> play
    const command = args[0]!.substring(prefix.length).toLowerCase();
    args.splice(0, 1);
    var funcToExec: CommandInterface["runFromMessage"] | undefined = undefined;
    // Go through each command name and alias for possible matches
    for (let i = 0; i < CommandList.length; i++) {
        const element = CommandList[i];
        if (element.name == command) {
            funcToExec = element.runFromMessage;
            break;
        }
        for (let j = 0; j < element.aliases.length; j++) {
            const alias = element.aliases[j];
            if (alias == command) {
                funcToExec = element.runFromMessage;
                break;
            }
        }
    }
    if (!funcToExec) {
        try {
            message.channel.send("Error no such command!");
        } catch (err) {}
        return;
    }
    await funcToExec(message, args);
    return;
};
