class Grid {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.squareSize = 24;
  }

  draw() {
    this.ctx.beginPath();

    for (let x = this.squareSize; x < this.canvas.width; x += this.squareSize) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
    }

    for (let y = this.squareSize; y < this.canvas.height; y += this.squareSize) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
    }

    this.ctx.strokeStyle = "#BD2424";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }
}

export default Grid;