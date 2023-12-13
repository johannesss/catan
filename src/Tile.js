export default class Tile {
  constructor(canvas, ctx, type, number, x, y, size, rowIndex, colIndex) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.type = type;
    this.number = number;
    this.x = x;
    this.y = y;
    this.size = size;
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.vertices = [];
  }

  drawHexagon() {
    const angle = (Math.PI * 2) / 6; // angle between each point

    this.ctx.save();
    this.ctx.beginPath();

    // draw the hexagon
    for (let i = 0; i < 6; i++) {
      const xPos = this.x + this.size * Math.cos(i * angle + Math.PI / 6);
      const yPos = this.y + this.size * Math.sin(i * angle + Math.PI / 6);

      this.vertices.push({ x: xPos, y: yPos });

      if (i === 0) {
        this.ctx.moveTo(xPos, yPos); // move to the first point
      } else {
        this.ctx.lineTo(xPos, yPos); // draw lines to other points
      }
    }

    this.ctx.fillStyle = this.type.color;
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.stroke();
  }

  isIntersected(x, y) {
    let intersects = false;
    for (let i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
      const xi = this.vertices[i].x, yi = this.vertices[i].y;
      const xj = this.vertices[j].x, yj = this.vertices[j].y;

      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) intersects = !intersects;
    }
    return intersects;
  }

  draw() {
    this.drawHexagon();

    this.ctx.fillStyle = 'black';
    const fontSize = this.canvas.width * .035;
    this.ctx.font = fontSize.toString() +  'px monospace';

    this.ctx.textAlign = 'center';
    const text = this.number ? this.number.toString() : '';
    this.ctx.fillText(text, this.x, this.y + fontSize / 2);
  }
}