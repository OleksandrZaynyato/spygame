import type {Game, Lobby} from "../models/game";
import { categories } from "../data/categories";
import { randomInt } from "crypto";

class LobbyService {
    private lobby: Lobby = {
        players: [],
        imposters: 1,
        category: "",
    };

    private game: Game | null = null;

    // ---------- Lobby ----------

    getLobby() {
        return this.lobby;
    }

    addPlayer(name: string) {
        if (!name.trim()) return;

        if (this.lobby.players.includes(name)) return;

        this.lobby.players.push(name);
    }

    removePlayer(name: string) {
        this.lobby.players =
            this.lobby.players.filter(
                player => player !== name
            );
    }

    setCategory(category: string) {
        if (!categories[category]) return;

        this.lobby.category = category;
    }

    setImposters(count: number) {

        const maxImposters = Math.floor(
            this.lobby.players.length / 2
        );


        if (count < 1) return;

        if (count > maxImposters) {
            return;
        }


        this.lobby.imposters = count;
    }

    resetLobby() {
        this.lobby = {
            players: [],
            imposters: 1,
            category: "",
        };

        this.game = null;
    }

    // ---------- Game ----------

    startGame() {
        if (this.lobby.players.length < 3)
            throw new Error("Need at least 3 players.");

        if (!this.lobby.category)
            throw new Error("Choose a category.");

        const words = categories[this.lobby.category];

        const word = words[randomInt(words.length)];

        const imposters: number[] = [];

        while (imposters.length < this.lobby.imposters) {
            const randomPlayer = randomInt(this.lobby.players.length);

            if (!imposters.includes(randomPlayer)) {
                imposters.push(randomPlayer);
            }
        }

        this.game = {
            players: [...this.lobby.players],
            category: this.lobby.category,
            word,
            imposters,
            viewedPlayers: [],
        };

        return this.game;
    }

    getGame() {
        return this.game;
    }

    revealCard(playerIndex: number) {
        if (!this.game)
            throw new Error("Game hasn't started.");

        if (!this.game.viewedPlayers.includes(playerIndex)) {
            this.game.viewedPlayers.push(playerIndex);
        }

        return this.game.imposters.includes(playerIndex)
            ? "IMPOSTER"
            : this.game.word;
    }

    endGame() {
        const game = this.game;

        this.game = null;

        return game;
    }
}

export const lobbyService = new LobbyService();