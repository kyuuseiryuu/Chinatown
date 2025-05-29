
import Player from "./Player";

export interface Shop {
  readonly name: string;
  readonly maxItems: number;
}

export type DIAABLED_AREA = 'x';

export type AreaItem = number | DIAABLED_AREA | Shop

export type Area = AreaItem[][];

export interface AreaMap {
  area: Array<Area>;
  enableMap: Array<Area>;
}

export interface DroppedItem {
  area: number;
  x: number;
  y: number;
  item: Shop;
  belone: Player;
}

export enum PlayState {
  WAITING,
  DEALING,
  BETTING,
  COUNTING,
  OVER,
}

export type PlayStateChangeHandler = (playState: PlayState) => void;