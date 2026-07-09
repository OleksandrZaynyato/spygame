import { InlineKeyboard } from "grammy";

export function revealKeyboard(players: string[]) {
    const keyboard = new InlineKeyboard();

    players.forEach((player, index) => {
        keyboard
            .text(
                player,
                `reveal:${index}`
            )
            .row();
    });

    keyboard.text(
        "🏁 End game",
        "end_game"
    );

    return keyboard;
}


export function hideWordKeyboard() {
    return new InlineKeyboard()
        .text(
            "🙈 Hide word",
            "hide_word"
        );
}