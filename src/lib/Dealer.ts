const SIZE = 86;

class Dealer {
  private cards: Set<number> = new Set();
  constructor() {
    const cards = new Array(SIZE).fill(0).map((_, index) => index + 1);
    this.cards = new Set(cards);
    this.shuffle();
  }

  public shuffle() {
    const cards = Array.from(this.cards);
    cards.sort(() => Math.random() - 0.5);
    this.cards = new Set(cards);
  }

  public deal(size: number) {
    const cards = Array.from(this.cards);
    const start = Math.floor(Math.random() * (cards.length - size));
    const end = start + size;
    const result = cards.slice(start, end);
    this.cards = new Set(cards.slice(0, start).concat(cards.slice(end)));
    this.shuffle();
    return result;
  }

  public giveBack(cards: number[]) {
    this.cards = new Set([...this.cards, ...cards]);
    this.shuffle();
  }

  public getLeftCardLength() {
    return this.cards.size;
  }

}

export default Dealer;
