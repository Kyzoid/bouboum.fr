class Spawn {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.squareSize = 24;

    this.positions = [
      [2, 0], [3, 0], [6, 0], [7, 0], [10, 0], [11, 0], [14, 0], [15, 0], [18, 0], [19, 0], [22, 0], [23, 0], [26, 0], [27, 0],
      [2, 1], [6, 1], [10, 1], [14, 1], [18, 1], [22, 1], [26, 1],
      [0, 3], [28, 3],
      [0, 4], [1, 4], [27, 4], [28, 4],
      [0, 7], [28, 7],
      [0, 8], [1, 8], [27, 8], [28, 8],
      [0, 10], [1, 10], [27, 10], [28, 10],
      [0, 11], [28, 11],
      [0, 14], [1, 14], [27, 14], [28, 14],
      [0, 15], [28, 15],
      [2, 17], [6, 17], [10, 17], [14, 17], [18, 17], [22, 17], [26, 17],
      [1, 18], [2, 18], [5, 18], [6, 18], [9, 18], [10, 18], [13, 18], [14, 18], [17, 18], [18, 18], [21, 18], [22, 18], [25, 18], [26, 18],
    ];
  }

  draw() {
    this.positions.forEach((positions) => {
      this.ctx.fillStyle = '#903636';
      this.ctx.fillRect(positions[0] * this.squareSize, positions[1] * this.squareSize, this.squareSize, this.squareSize);
    });
  }
}

export default Spawn;