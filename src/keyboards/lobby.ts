import { InlineKeyboard } from "grammy";

export function lobbyKeyboard() {
    return new InlineKeyboard()
        .text("➕ Add player", "add_player")
        .row()
        .text("➖ Remove player", "remove_player")
        .row()
        .text("🕵️ Imposters", "imposters")
        .text("📂 Category", "category")
        .row()
        .text("▶️ Start game", "start_game");
}


export function removePlayerKeyboard(players: string[]) {
    const keyboard = new InlineKeyboard();

    players.forEach(player => {
        keyboard
            .text(`❌ ${player}`, `remove_player:${player}`)
            .row();
    });

    keyboard.text("⬅️ Back", "back_to_lobby");

    return keyboard;
}


export function impostersKeyboard() {
    return new InlineKeyboard()
        .text("1", "set_imposters:1")
        .text("2", "set_imposters:2")
        .text("3", "set_imposters:3")
        .row()
        .text("⬅️ Back", "back_to_lobby");
}