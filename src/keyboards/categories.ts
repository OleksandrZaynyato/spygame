import { InlineKeyboard } from "grammy";
import { categories } from "../data/categories";

export function categoriesKeyboard() {
    const keyboard = new InlineKeyboard();

    Object.keys(categories).forEach(category => {
        keyboard
            .text(
                category,
                `set_category:${category}`
            )
            .row();
    });

    keyboard.text("⬅️ Back", "back_to_lobby");

    return keyboard;
}