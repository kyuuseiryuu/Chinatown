import Dealer from './Dealer';
import Player from './Player';
import { PlayState, PlayStateChangeHandler } from './types';

class Game {
  private dealer: Dealer = new Dealer();
  private players: Player[] = [];
  private seatSize: number = 5;
  private triggerCounter: number = 0;
  private giveBackSet: Set<number> = new Set();
  private currentRound: number = 0;
  private maxRounds: number = 6;
  private playState: PlayState = PlayState.WAITING;
  private gameStateChangeHandler?: (playState: PlayState) => void = () => {};
  private roundCardMap: [number, number][] = [
    [5, 3],
    [5, 3],
    [4, 2],
    [4, 2],
    [4, 2],
    [4, 2],
  ];

  constructor(seatSize: number = 5, maxRounds: number = 6) {
    this.seatSize = seatSize;
    this.maxRounds = maxRounds;
  }

  getCurrentRound() {
    return this.currentRound;
  }

  getDealer() {
    return this.dealer;
  }

  getPlayState(): PlayState {
    return this.playState;
  }

  setGameStateChangeHandler(handler: PlayStateChangeHandler) {
    this.gameStateChangeHandler = handler;
  }

  hasSeats(): boolean {
    return this.players.length < this.seatSize;
  }

  nextState() {
    this.triggerCounter = 0;
    switch (this.playState) {
      case PlayState.WAITING:
        this.playState = PlayState.DEALING;
        break;
      case PlayState.DEALING:
        this.playState = PlayState.BETTING;
        break;
      case PlayState.BETTING:
        this.playState = PlayState.COUNTING;
        break;
      case PlayState.COUNTING:
        this.playState = PlayState.DEALING;
        break;
    }
    this.gameStateChangeHandler?.(this.playState);
  }

  join(player: Player) {
    if (this.hasSeats()) {
      this.players.push(player);
      if (this.players.length === this.seatSize) {
        this.currentRound = 0;
        this.nextState();
      }
    }
  }

  leave(player: Player) {
    const index = this.players.indexOf(player);
    if (index === -1) return;
    this.players.splice(index, 1);
    if (this.players.length < this.seatSize) {
      this.playState = PlayState.WAITING;
      this.gameStateChangeHandler?.(this.playState);
    }
  }

  getCurrentCardSize() {
    return this.roundCardMap[this.currentRound];
  }

  isGameOver(): boolean {
    return this.currentRound + 1 >= this.maxRounds;
  }

  overBetting(): boolean {
    if (this.playState !== PlayState.BETTING) {
      return false;
    }
    if (this.triggerCounter < this.seatSize - 1) {
      this.triggerCounter++;
      return true;
    }
    this.nextState();
    return true;
  }

  nextRound(): boolean {
    if (this.isGameOver() || this.currentRound + 1 === this.maxRounds) {
      this.playState = PlayState.OVER;
      this.gameStateChangeHandler?.(this.playState);
      return false;
    }
    if (this.playState !== PlayState.COUNTING) {
      return false;
    }
    if (this.triggerCounter < this.seatSize - 1) {
      this.triggerCounter++;
    } else {
      this.currentRound++;
      this.nextState();
      return true;
    }
    return true;
  }

  restart() {
    this.dealer = new Dealer();
    this.players = [];
    this.triggerCounter = 0;
    this.giveBackSet.clear();
    this.currentRound = 0;
    this.playState = PlayState.WAITING;
    this.gameStateChangeHandler?.(this.playState);
  }


}

export default Game;