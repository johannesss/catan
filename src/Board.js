import * as constants from '@/constants';
import Tile from '@/Tile';
import groupBy from 'lodash/groupBy';
import values from 'lodash/values';

export default class Board {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.tileCounts = constants.TILES_FOUR_PLAYERS;
    this.availableNumbers = [
      3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 2, 12
    ];
    this.availableTiles = [
      ...Array(3).fill(constants.TILE_BRICK),
      ...Array(3).fill(constants.TILE_ORE),
      ...Array(4).fill(constants.TILE_WOOL),
      ...Array(4).fill(constants.TILE_GRAIN),
      ...Array(4).fill(constants.TILE_LUMBER),
      constants.TILE_DESERT
    ];

    this.tileSize = this.canvas.width / (this.tileCounts.length * 2);
    this.tileWidth = Math.ceil(Math.sqrt(3) * this.tileSize);
    this.tileHeight = 2 * this.tileSize;
    this.tileAngleHeight = this.tileHeight - (this.tileHeight * 0.75);
    this.tileRectHeight = this.tileHeight - (this.tileAngleHeight * 2);
    this.tileGridHeight = this.tileHeight + (this.tileRectHeight + this.tileAngleHeight) * (this.tileCounts.length - 1);
    this.tiles = this.generateTiles();

    this.canvas.onmousemove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      let mouseX = e.clientX - rect.left;
      let mouseY = e.clientY - rect.top;

      // translate to center
      mouseX = mouseX - this.canvas.width / 2;
      mouseY = mouseY - this.tileHeight / 2;
      mouseY = mouseY - (this.canvas.height / 2 - this.tileGridHeight / 2);

      this.walkTiles(tile => {
        if (tile.isIntersected(mouseX, mouseY)) {
          console.log(tile.type.name, tile.number);
        }
      });
    }
  }

  generateTiles() {
    const tiles = [];
    this.tileCounts.forEach((tileCount, rowIndex) => {
      const arr = Array(tileCount).fill(1);
      const offsetX = (this.tileWidth * tileCount - this.tileWidth) * 0.5;

      arr.forEach((_, colIndex) => {
        const type = this.takeRandomTile();
        let number;

        if (type.name === constants.TILE_DESERT.name) {
          number = null;
        } else {
          number = this.takeRandomNumber();
        }

        const tileX = colIndex * this.tileWidth - offsetX;
        const tileY = rowIndex * (this.tileHeight - this.tileAngleHeight);

        const tile = new Tile(
          this.canvas, this.ctx, type, number, tileX, tileY, this.tileSize, rowIndex, colIndex
        );

        tiles.push(tile);
      });
    });

    return values(groupBy(tiles, 'rowIndex'));
  }

  takeRandomTile() {
    const index = Math.floor(Math.random() * this.availableTiles.length);

    return this.availableTiles.splice(index, 1)[0];
  }

  takeRandomNumber() {
    const index = Math.floor(Math.random() * this.availableNumbers.length);

    return this.availableNumbers.splice(index, 1)[0];
  }

  walkTiles(callback) {
    this.tiles.forEach((row) => {
      row.forEach((tile) => {
        callback(tile);
      });
    });
  }

  draw() {
    this.ctx.fillStyle = constants.COLOR_WATER;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.canvas.width / 2, this.tileHeight / 2);
    this.ctx.translate(0, this.canvas.height / 2 - this.tileGridHeight / 2);

    this.walkTiles((tile) => tile.draw());
  }
}