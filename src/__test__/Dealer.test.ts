import Dealer from "../lib/game/Dealer";

const GET_SIZE = 5;
const LEAVE_SIZE = 3;
describe("test Dealer", () => {
  test('Test get cards', () => {
    const dealer = new Dealer();
    const totalCards = dealer.getLeftCardLength();
    const cards = dealer.deal(GET_SIZE);
    expect(cards.length).toBe(GET_SIZE);
    expect(dealer.getLeftCardLength()).toBe(totalCards - GET_SIZE);
    const giveBack = cards.slice(0, LEAVE_SIZE);
    dealer.giveBack(giveBack);
    expect(dealer.getLeftCardLength()).toBe(totalCards - (GET_SIZE - LEAVE_SIZE));
  });
  test("Test 5 player", () => {
    const dealer = new Dealer();
    const totalCards = dealer.getLeftCardLength();
    const savedCards = new Set<number>();
    for (let i = 0; i < 5; i++) {
      const cards = dealer.deal(GET_SIZE);
      const save = cards.slice(0, LEAVE_SIZE);
      const giveBackCards = cards.slice(LEAVE_SIZE);
      save.forEach((card) => savedCards.add(card));
      dealer.giveBack(giveBackCards);
    }
    expect(savedCards.size).toBe(5 * LEAVE_SIZE);
    expect(dealer.getLeftCardLength()).toBe(totalCards - (5 * LEAVE_SIZE));
  })
});