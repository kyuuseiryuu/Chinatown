import { PlayState } from "./types";

class Player {
  private cards: Set<number> = new Set();


  public clearCards() {
    this.cards.clear();
  }

  public take(cards: number[]) {
    this.cards = new Set([...this.cards, ...cards]);
  }

  public getCards() {
    return [...this.cards].sort((a, b) => a - b);
  }

}

export default Player;
