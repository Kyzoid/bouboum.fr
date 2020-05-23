class Editor {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    this.orangeSquare = document.getElementById('orange-square');
    this.blackSquare = document.getElementById('black-square');
    this.blueSquare = document.getElementById('blue-square');
    this.iceSquare = document.getElementById('ice-square');

    this.squareSize = 24;
    this.width = this.canvas.width / this.squareSize;
    this.height = this.canvas.height / this.squareSize;

    this.map = JSON.parse(localStorage.getItem('map')) || new Array(this.width*this.height).fill(0);
    
    // listeners
    this.canvas.addEventListener('click', (event) => this.drawSquare(event));
    console.log(document.getElementById('reset'))
    document.getElementById('reset').addEventListener('click', () => this.reset());
  }

  drawGrid() {
    for (let x = this.squareSize; x <= this.canvas.width; x += this.squareSize) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
    }

    for (let y = this.squareSize; y <= this.canvas.height; y += this.squareSize) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
    }

    this.ctx.strokeStyle = "#1A1A24";
    this.ctx.stroke();
    
  }

  toIndex(x, y) {
    return ((y * this.width) + x);
  }

  drawMap() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        switch (this.map[this.toIndex(x, y)]) {
          case 1:
            const blackSquare = this.blackSquare.cloneNode();
            this.ctx.drawImage(blackSquare, x*this.squareSize, y*this.squareSize);
            break;
          case 2:
            const blueSquare = this.blueSquare.cloneNode();
            this.ctx.drawImage(blueSquare, x*this.squareSize, y*this.squareSize);
            break;
          case 3:
            const orangeSquare = this.orangeSquare.cloneNode();
            this.ctx.drawImage(orangeSquare, x*this.squareSize, y*this.squareSize);
            break;
          case 4:
            const iceSquare = this.iceSquare.cloneNode();
            this.ctx.drawImage(iceSquare, x*this.squareSize, y*this.squareSize);
            break;
          default:
            this.ctx.fillStyle = '#36364B';
            break;
        }
      }
    }
  }

  toFixed(float) {
    return parseInt(float.toString().split('.')[0], 10);
  }

  drawSquare(event) {
    const { x, y } = this.getMousePos(event);
    const squareX = this.toFixed(x/this.squareSize);
    const squareY = this.toFixed(y/this.squareSize);
    this.map[this.toIndex(squareX, squareY)] = 1;
    localStorage.setItem('map', JSON.stringify(this.map))
  }

  getMousePos(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  reset() {
    const emptyArray = new Array(this.width*this.height).fill(0);
    localStorage.setItem('map', JSON.stringify(emptyArray));
    this.map = emptyArray;
   
  }
}

const canvas = document.getElementById('editor-area')
const editor = new Editor(canvas);

const main = () => {
  editor.drawMap();
  requestAnimationFrame(main);
}

requestAnimationFrame(main);