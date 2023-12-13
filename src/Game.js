import Board from '@/Board';

export default class Game {
  constructor(width, height, debug = false) {
    this.width = width;
    this.height = height;
    this.debug = debug;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');

    this.board = new Board(this.canvas, this.ctx);

    this.board.draw();

    this.ctx.resetTransform();

    if (this.debug) {
      this.ctx.strokeStyle = 'red';
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.canvas.height / 2);
      this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(this.canvas.width / 2, 0);
      this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
      this.ctx.stroke();
    }

    document.body.appendChild(this.canvas);
  }
}