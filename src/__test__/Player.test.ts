import Player from "../lib/game/Player";

describe("test Player", () => {
  test("Test Player", () => {
    const player = new Player();
    player.take([11, 22, 33]);
    player.take([1, 2, 3]);
    expect(player.getCards()).toEqual([1, 2, 3, 11, 22, 33]);
    player.clearCards();
    expect(player.getCards()).toEqual([]);
  });
});