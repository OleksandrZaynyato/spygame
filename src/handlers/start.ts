import { Bot } from "grammy";
import { renderLobby } from "../utils/render.js";

export function registerStartHandler(bot: Bot) {
    bot.command("start", async (ctx) => {
        await renderLobby(ctx);
    });
}