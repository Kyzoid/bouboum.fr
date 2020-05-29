class Editor {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.orangeSquare = document.getElementById('orange-square');
    this.blackSquare = document.getElementById('black-square');
    this.blueSquare = document.getElementById('blue-square');
    this.iceSquare = document.getElementById('ice-square');

    this.squareSize = 24;
    this.width = this.canvas.width / this.squareSize;
    this.height = this.canvas.height / this.squareSize;
    this.squareType = 2;

    this.map = JSON.parse(localStorage.getItem('map')) || new Array(this.width * this.height).fill(0);

    this.showGrid = true;
    this.showSpawns = true;
    this.spawnPositions = [
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

    // listeners
    this.isDrawing = false;
    window.addEventListener('mousedown', () => this.isDrawing = true);
    window.addEventListener('mouseup', () => this.isDrawing = false);
    this.canvas.addEventListener('mousemove', () => this.drawSquare(event, false));
    this.canvas.addEventListener('click', (event) => this.drawSquare(event, true));

    document.getElementById('reset').addEventListener('click', () => this.reset());
    document.getElementById('grid').addEventListener('click', (event) => this.gridHandler(event));
    document.getElementById('spawns').addEventListener('click', (event) => this.spawnsHandler(event));
    document.getElementById('download').addEventListener('click', () => this.downloadMap());
    document.getElementById('submit').addEventListener('click', () => this.submit());
    document.getElementById('import-map').addEventListener('change', () => this.importMap());
  }

  importMap() {
    const file = document.getElementById('import-map').files[0];
    console.log(file)
    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = () => {
        const mapFormatted = this.convertToNewFormat(reader.result);
        localStorage.setItem('map', `[${mapFormatted}]`);
        this.map = JSON.parse(localStorage.getItem('map'));
        this.drawMap();
      };
      reader.readAsText(file);
    } else {
      console.log("Le fichier que vous avez importé n'est pas au format text/plain ou est trop volumineux (max. 1103 bytes).");
    }
  }

  spawnsHandler() {
    this.showSpawns = event.target.checked;
    this.drawMap();
  }

  downloadMap() {
    const mapValue = this.convertToOldFormat();
    const mapName = document.getElementById('title').value;
    if (mapName) {
      fetch('/editeur/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ map: mapValue, name: mapName })
      })
        .then(res => res.json())
        .then(res => {
          const downloadMapElement = document.getElementById('download-map');
          downloadMapElement.setAttribute('href', `/temp/${res.filename}_${res.timestamp}.txt`);
          downloadMapElement.setAttribute('download', `${res.filename}.txt`);
          downloadMapElement.click();
        });
    }
  }

  drawSpawns() {
    this.spawnPositions.forEach((positions) => {
      this.ctx.fillStyle = '#903636';
      this.ctx.fillRect(positions[0] * this.squareSize, positions[1] * this.squareSize, this.squareSize, this.squareSize);
    })
  }

  gridHandler(event) {
    this.showGrid = event.target.checked;
    this.drawMap();
  }

  drawGrid() {
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

  toIndex(x, y) {
    return ((y * this.width) + x);
  }

  drawMap() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        switch (this.map[this.toIndex(x, y)]) {
          case 1:
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
            //const blackSquare = this.blackSquare.cloneNode();
            //this.ctx.drawImage(blackSquare, x*this.squareSize, y*this.squareSize);
            break;
          case 2:
            this.ctx.fillStyle = '#15737C';
            this.ctx.fillRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
            //const blueSquare = this.blueSquare.cloneNode();
            //this.ctx.drawImage(blueSquare, x*this.squareSize, y*this.squareSize);
            break;
          case 3:
            this.ctx.fillStyle = '#B4770E';
            this.ctx.fillRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
            //const orangeSquare = this.orangeSquare.cloneNode();
            //this.ctx.drawImage(orangeSquare, x*this.squareSize, y*this.squareSize);
            break;
          case 4:
            this.ctx.fillStyle = '#BBEBF7';
            this.ctx.fillRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
            //const iceSquare = this.iceSquare.cloneNode();
            //this.ctx.drawImage(iceSquare, x*this.squareSize, y*this.squareSize);
            break;
        }
      }
    }

    if (this.showGrid) {
      this.drawGrid();
    }

    if (this.showSpawns) {
      this.drawSpawns();
    }

  }

  toFixed(float) {
    return parseInt(float.toString().split('.')[0], 10);
  }

  drawSquare(event, simpleClick) {
    if (this.isDrawing || simpleClick) {

      const { x, y } = this.getMousePos(event);
      const squareX = this.toFixed(x / this.squareSize);
      const squareY = this.toFixed(y / this.squareSize);
      this.map[this.toIndex(squareX, squareY)] = this.getSquareType();
      localStorage.setItem('map', JSON.stringify(this.map));
      this.drawMap();
    }
  }

  getSquareType() {
    const radios = document.querySelectorAll('input[type="radio"]');
    Object.values(radios).forEach((radio) => {
      if (radio.checked) {
        this.squareType = parseInt(radio.value, 10);
      }
    });
    return this.squareType;
  }

  getMousePos(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  reset() {
    const emptyArray = new Array(this.width * this.height).fill(0);
    localStorage.setItem('map', JSON.stringify(emptyArray));
    this.map = emptyArray;
    this.drawMap();
  }

  convertToOldFormat() {
    let oldMapFormat = "";
    let index = 0;
    let colNumber = 1;

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        oldMapFormat += this.map[this.toIndex(x, y)];
        index++;
        if (index / colNumber === 19) {
          colNumber++;
          oldMapFormat += '#';
        } else {
          oldMapFormat += ',';
        }
      }
    }

    return oldMapFormat;
  }

  convertToNewFormat(map) {
    const mapSplit = map.split('#').map(col => col.split(','));
    mapSplit.pop();

    const newMapFormat = [];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        newMapFormat.push(mapSplit[x][y]);
      }
    }

    return newMapFormat;
  }

  submit() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const canvasBase64 = this.canvas.toDataURL();
    document.getElementById('preview').setAttribute('src', canvasBase64);
    // TODO fetch post to submit route
  }
}

const canvas = document.getElementById('editor-area')
const editor = new Editor(canvas);
editor.drawMap();