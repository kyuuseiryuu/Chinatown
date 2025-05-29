class MapUtil {
  static makeArea(width: number, height: number) {
    return new Array(height).fill(0).map(() => new Array(width).fill(0));
  }

  static makeEanbleMap(area: number[][]) {
    console.log('makeEanbleMap', area);
  }
}

export default MapUtil;
