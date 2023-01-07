import { CommandInterface } from "../interfaces/CommandInterface";
import { readFileSync, writeFileSync } from "fs";
import { channel } from "diagnostics_channel";
import { Database } from "../utils/database";


export interface configInterface {
    bot_token: string;
    prefixes: string[];
    max_prefixes: number;
    max_prefix_chars: number;
}


export const prefixCommand: CommandInterface = {
    name: "prefix",
    description: "Add and remove a prefix or list all prefixes",
    aliases: [],
    argsDescription: "[set, help] [new prefix]",
    runFromMessage: async (message, args) => {
        let action: "set" | "help" | undefined = undefined
        switch (args[0]) {
            case "set":
                action = "set";
                break;
            case "help":
                action = "help";
                break;
            default:
                action = undefined;
                break;
        }
        if (action == undefined) {
            message.channel.send(`Error use "set" or "help`);
            return;
        }
        if (action == "help") {
            const userPrefix = await Database.getPrefixForUser(message.author.id);
            message.channel.send("Your current prefix is '" + userPrefix + "', use prefix set [new prefix] to set a new custom prefix");
            return;
        }

        const newPrefix: string | undefined = args[1];
        if (!newPrefix) {
            message.channel.send("You need to give the new prefix!");
            return;
        }
        Database.setPrefixForUser(message.author.id, newPrefix!);

        message.channel.send("Succesfully changed your prefix to '" + newPrefix + "' 👍");
        
    },
}