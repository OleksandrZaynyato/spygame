import { Context } from "grammy";
import { lobbyService } from "../services/lobby.service";
import { lobbyKeyboard } from "../keyboards/lobby";

export async function renderLobby(ctx: Context) {
    const lobby = lobbyService.getLobby();

    const players =
        lobby.players.length === 0
            ? "—"
            : lobby.players.join("\n");

    await ctx.reply(
        `🎮 Spy Game

Players:
${players}

Imposters: ${lobby.imposters}

Category: ${lobby.category || "Not selected"}`,
        {
            reply_markup: lobbyKeyboard(),
        }
    );
}