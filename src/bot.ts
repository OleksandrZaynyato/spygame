import { Bot } from "grammy";
import { registerStartHandler } from "./handlers/start";
import { registerLobbyHandler } from "./handlers/lobby";
import { registerGameHandler } from "./handlers/game";

const token = process.env.BOT_TOKEN;

if (!token) {
    throw new Error("BOT_TOKEN is missing.");
}

export const bot = new Bot(token);

registerStartHandler(bot);
registerLobbyHandler(bot);
registerGameHandler(bot);