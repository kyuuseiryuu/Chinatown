import Game from "../lib/game/Game";
import Player from "../lib/game/Player";
import { PlayState, PlayStateChangeHandler } from "../lib/game/types";


const game = new Game();
const gameStateChangeHandler: PlayStateChangeHandler = (playState: PlayState) => {
  console.debug("Game state changed to: %s", playState);
  return;
  // switch (playState) {
  //   case PlayState.OVER: {
  //     players.forEach((player, i) => {
  //       console.log("Player %s, cards: %s", i, player.getCards());
  //     });
  //     break;
  //   }
  //   case PlayState.WAITING:
  //     console.log("Waiting for players to join...");
  //     break;
  //   case PlayState.DEALING: {
  //     console.log("Dealing cards...");
  //     let backCards: number[] = [];
  //     players.forEach((player, i) => {
  //       const [total, take] = game.getCurrentCardSize();
  //       const cards = game.getDealer().deal(total);
  //       const saved = cards.slice(0, take);
  //       const left = cards.slice(take);
  //       player.take(saved);
  //       console.log("Player %s take cards: %s, left: %s", i, saved, left);
  //       backCards = [...backCards, ...left];
  //     });
  //     game.getDealer().giveBack(backCards);
  //     console.log("Dealer back cards: %s, left cards: %s", backCards, game.getDealer().getLeftCardLength());
  //     game.nextState();
  //     break;
  //   }
  //   case PlayState.BETTING:
  //     console.log("Betting phase...");
  //     for (let i = 0; i < players.length; i++) {
  //       game.overBetting();
  //     }
  //     break;
  //   case PlayState.COUNTING:
  //     console.log("Counting phase %s...", game.getCurrentRound());
  //     for (let i = 0; i < players.length; i++) {
  //       game.nextRound();
  //     }
  //     break;
  // }
}

game.setGameStateChangeHandler(gameStateChangeHandler);
const players = new Array(5).fill(0).map(() => new Player());

describe("test Game", () => {
  test("Test game", () => {
    expect(game.getDealer()).toBeDefined();
    players.forEach((player) => {
      game.join(player);
    });
    expect(game.hasSeats()).toBe(false);
    expect(game.isGameOver()).toBe(false);
    expect(game.getCurrentRound()).toBe(0);
    expect(game.getPlayState()).toBe(PlayState.DEALING);
    game.nextState();
    expect(game.getPlayState()).toBe(PlayState.BETTING);
    for (let i = 0; i < players.length; i++) {
      game.overBetting();
    }
    expect(game.getPlayState()).toBe(PlayState.COUNTING);
    for (let i = 0; i < players.length; i++) {
      game.nextRound();
    }
    expect(game.getCurrentRound()).toBe(1);
    expect(game.getPlayState()).toBe(PlayState.DEALING);
    game.nextState();
    expect(game.getPlayState()).toBe(PlayState.BETTING);
    for (let i = 0; i < players.length; i++) {
      game.overBetting();
    }
    expect(game.getPlayState()).toBe(PlayState.COUNTING);
    for (let i = 0; i < players.length; i++) {
      game.nextRound();
    }
    expect(game.getCurrentRound()).toBe(2);
    game.nextState();
    expect(game.getPlayState()).toBe(PlayState.BETTING);
    for (let i = 0; i < players.length; i++) {
      game.overBetting();
    }
    expect(game.getPlayState()).toBe(PlayState.COUNTING);
    for (let i = 0; i < players.length; i++) {
      game.nextRound();
    }
    expect(game.getCurrentRound()).toBe(3);
    game.nextState();
    expect(game.getPlayState()).toBe(PlayState.BETTING);
    for (let i = 0; i < players.length; i++) {
      game.overBetting();
    }
    expect(game.getPlayState()).toBe(PlayState.COUNTING);
    for (let i = 0; i < players.length; i++) {
      game.nextRound();
    }
    expect(game.getCurrentRound()).toBe(4);
    game.nextState();
    expect(game.getPlayState()).toBe(PlayState.BETTING);
    expect(game.nextRound()).toBe(false);
    for (let i = 0; i < players.length; i++) {
      game.overBetting();
    }
    expect(game.getPlayState()).toBe(PlayState.COUNTING);
    for (let i = 0; i < players.length; i++) {
      game.nextRound();
    }
    game.nextState();
    expect(game.getCurrentCardSize()).toBeDefined();
    expect(game.getPlayState()).toBe(PlayState.BETTING);
    for (let i = 0; i < players.length; i++) {
      game.overBetting();
    }
    expect(game.overBetting()).toBe(false);
    for (let i = 0; i < players.length; i++) {
      game.nextRound();
    }
    expect(game.getCurrentRound()).toBe(5);
    expect(game.isGameOver()).toBe(true);
    game.leave(players[0]);
    expect(game.hasSeats()).toBe(true);
    game.join(players[0]);
    expect(game.hasSeats()).toBe(false);
    game.leave(new Player());
    expect(game.hasSeats()).toBe(false);
    expect(game.getCurrentRound()).toBe(0);
    expect(game.isGameOver()).toBe(false);
    expect(game.getPlayState()).toBe(PlayState.DEALING);
    game.restart();
    expect(game.getCurrentRound()).toBe(0);
    expect(game.isGameOver()).toBe(false);
    expect(game.getPlayState()).toBe(PlayState.WAITING);
    expect(game.hasSeats()).toBe(true);
  });
});