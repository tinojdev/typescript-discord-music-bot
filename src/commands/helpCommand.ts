import { EmbedBuilder } from "discord.js";
import { CommandInterface } from "../interfaces/CommandInterface";
import Config from "../config";
import { Database } from "../utils/database";
import { CommandList } from "./_CommandList";

export const helpCommand: CommandInterface = {
    name: "help",
    description: "Displays all of the available commands.",
    aliases: ["h"],
    argsDescription: undefined,
    runFromMessage: async (message, args) => {
        const embed: EmbedBuilder = new EmbedBuilder().setColor(15198183).setTitle("Commands:");

        const commands = CommandList;
        const prefix =
            "[" + (await Database.getPrefixForUser(message.author.id)) + " or " + Config.getDefaultPrefix() + "]";
        commands.forEach((c) => {
            var value = c.description;
            if (c.aliases) {
                value += "\nAliases: " + c.aliases.toString();
            }
            var name = prefix + c.name + (c.argsDescription ? " " + <string>c.argsDescription : "");
            embed.addFields({ name, value });
        });

        message.channel.send({ embeds: [embed] });
    },
};
