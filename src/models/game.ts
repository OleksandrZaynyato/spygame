export interface Lobby {
    players: string[];
    imposters: number;
    category: string;
}

export interface Game {
    players: string[];
    category: string;
    word: string;
    imposters: number[];
    viewedPlayers: number[];
}