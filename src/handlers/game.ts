import { Bot } from "grammy";
import { lobbyService } from "../services/lobby.service.js";
import { hideWordKeyboard } from "../keyboards/reveal.js";
import { revealKeyboard } from "../keyboards/reveal.js";
import { renderLobby } from "../utils/render.js";

export function registerGameHandler(bot: Bot) {


    bot.callbackQuery(/^reveal:(\d+)$/, async (ctx) => {

        const playerIndex =
            Number(ctx.match[1]);


        try {

            const card =
                lobbyService.revealCard(
                    playerIndex
                );


            await ctx.editMessageText(
                card === "IMPOSTER"
                    ? "🚨 IMPOSTER"
                    : `🕵️ Word:\n\n${card}`,
                {
                    reply_markup:
                        hideWordKeyboard()
                }
            );


        } catch (error) {

            await ctx.answerCallbackQuery({
                text:
                    error instanceof Error
                        ? error.message
                        : "Error",
                show_alert: true
            });

        }


        await ctx.answerCallbackQuery();

    });



    bot.callbackQuery("hide_word", async (ctx) => {

        const game =
            lobbyService.getGame();


        if (!game) {
            await ctx.answerCallbackQuery({
                text: "No active game"
            });

            return;
        }


        await ctx.editMessageText(
            "🕵️ Choose your card:",
            {
                reply_markup:
                    revealKeyboard(
                        game.players
                    )
            }
        );


        await ctx.answerCallbackQuery();

    });

    bot.callbackQuery("end_game", async (ctx) => {

        const game =
            lobbyService.endGame();


        if (!game) {
            await ctx.answerCallbackQuery({
                text: "No active game"
            });

            return;
        }


        const imposters =
            game.imposters
                .map((index: number) => game.players[index])
                .join(", ");


        await ctx.editMessageText(
            `🏁 Game ended!

Word:
${game.word}

Imposter:
🚨 ${imposters}`
        );


        await ctx.reply(
            "Starting lobby again..."
        );


        await renderLobby(ctx);


        await ctx.answerCallbackQuery();
    });
}