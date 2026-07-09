import { Bot } from "grammy";
import { lobbyService } from "../services/lobby.service";
import { renderLobby } from "../utils/render";
import { removePlayerKeyboard } from "../keyboards/lobby";
import { impostersKeyboard } from "../keyboards/lobby";
import { categoriesKeyboard } from "../keyboards/categories";
import { revealKeyboard } from "../keyboards/reveal";

const waitingForName = new Set<number>();

export function registerLobbyHandler(bot: Bot) {

    // Button click
    bot.callbackQuery("add_player", async (ctx) => {
        const userId = ctx.from.id;

        waitingForName.add(userId);

        await ctx.answerCallbackQuery();

        await ctx.reply(
            "✏️ Enter your name:"
        );
    });

    // User sends name
    bot.on("message:text", async (ctx, next) => {
        const userId = ctx.from.id;

        if (!waitingForName.has(userId)) {
            return next();
        }

        const name = ctx.message.text;

        lobbyService.addPlayer(name);

        waitingForName.delete(userId);

        await renderLobby(ctx);
    });

    bot.callbackQuery("remove_player", async (ctx) => {
        const lobby = lobbyService.getLobby();

        if (lobby.players.length === 0) {
            await ctx.answerCallbackQuery({
                text: "No players to remove"
            });

            return;
        }

        await ctx.editMessageText(
            "Choose player to remove:",
            {
                reply_markup: removePlayerKeyboard(
                    lobby.players
                )
            }
        );

        await ctx.answerCallbackQuery();
    });

    bot.callbackQuery(/^remove_player:(.+)$/, async (ctx) => {
        const playerName = ctx.match[1];

        lobbyService.removePlayer(playerName);

        await ctx.answerCallbackQuery({
            text: `${playerName} removed`
        });
        await renderLobby(ctx);
    });

    bot.callbackQuery("imposters", async (ctx) => {
        await ctx.editMessageText(
            "Choose amount of imposters:",
            {
                reply_markup: impostersKeyboard()
            }
        );
        await ctx.answerCallbackQuery();
    });

    bot.callbackQuery(/^set_imposters:(\d+)$/, async (ctx) => {
        const amount = Number(ctx.match[1]);

        lobbyService.setImposters(amount);

        await ctx.answerCallbackQuery({
            text: `Imposters: ${amount}`
        });

        await renderLobby(ctx);
    });

    bot.callbackQuery("category", async (ctx) => {
        await ctx.editMessageText(
            "Choose category:",
            {
                reply_markup: categoriesKeyboard()
            }
        );
        await ctx.answerCallbackQuery();
    });

    bot.callbackQuery(/^set_category:(.+)$/, async (ctx) => {
        const category = ctx.match[1];

        lobbyService.setCategory(category);

        await ctx.answerCallbackQuery({
            text: `Category: ${category}`
        });
        await renderLobby(ctx);
    });

    bot.callbackQuery("start_game", async (ctx) => {
        try {
            const game =
                lobbyService.startGame();
            await ctx.editMessageText(
                "🕵️ Choose your card:",
                {
                    reply_markup:
                        revealKeyboard(game.players)
                }
            );
        } catch (error) {

            await ctx.answerCallbackQuery({
                text:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong",
                show_alert: true
            });
        }
    });

    bot.callbackQuery("back_to_lobby", async (ctx) => {
        await renderLobby(ctx);
        await ctx.answerCallbackQuery();
    });
}