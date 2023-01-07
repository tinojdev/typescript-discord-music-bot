import { Client, GatewayIntentBits } from "discord.js";
import { onMessageCreate } from "./events/onMessageCreate";

global.AbortController = require("abort-controller");
(async () => {
    const BOT = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.MessageContent,
        ],
    });

    BOT.on("ready", (c) => console.log(`Connected to Discord as ${c.user.username}!`));

    BOT.on("messageCreate", async (message) => await onMessageCreate(message));

    BOT.on("error", async (err) => {
        console.log("Discord bot ran into an error");
        console.log(err);
    });
    await BOT.login(process.env.BOT_TOKEN);

    /* process.on("unhandledRejection", (error: any) => {
        logger.error("Promise rejection:");
        logger.error(error);
    }); */
})();
