import Grid from './grid.js';
import Spawn from './spawn.js';

const infoModal = document.getElementById('info');

class Editor {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.grid = document.getElementById('grid-area');
    this.spawn = document.getElementById('spawn-area');
    (new Grid(this.grid)).draw();
    (new Spawn(this.spawn)).draw();

    this.orangeSquare = document.getElementById('orange-square');
    this.blackSquare = document.getElementById('black-square');
    this.blueSquare = document.getElementById('blue-square');
    this.iceSquare = document.getElementById('ice-square');

    this.squareSize = 24;
    this.width = this.canvas.width / this.squareSize;
    this.height = this.canvas.height / this.squareSize;
    this.squareType = 2;

    this.map = JSON.parse(localStorage.getItem('map')) || new Array(this.width * this.height).fill(0);

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
    this.rightClick = false;
    window.addEventListener('mousedown', (event) => {
      if (event.which === 3) this.rightClick = true;
      this.isDrawing = true;
    });
    window.addEventListener('mouseup', () => { this.isDrawing = false; this.rightClick = false; });
    this.canvas.addEventListener('mousemove', () => this.drawSquare(event, false));
    this.canvas.addEventListener('click', (event) => this.drawSquare(event, true));
    this.canvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      this.rightClick = true;
      this.drawSquare(event, true);
      return false;
    }, false);

    document.getElementById('reset').addEventListener('click', () => this.reset());
    document.getElementById('grid').addEventListener('click', () => this.grid.classList.toggle('hidden'));
    document.getElementById('spawns').addEventListener('click', () => this.spawn.classList.toggle('hidden'));
    document.getElementById('download').addEventListener('click', () => this.downloadMap());
    document.getElementById('submit').addEventListener('click', () => this.submit());
    document.getElementById('import-map').addEventListener('change', () => this.importMap());
    document.addEventListener('keydown', (event) => this.keyDownHandler(event));
  }

  keyDownHandler(event) {
    if (event.keyCode >= 49 && event.keyCode <= 52) {
      const inputSquareTypes = document.querySelectorAll('#canvas-squares .radio-container > input');
      inputSquareTypes.forEach(element => element.checked = false);
      switch (event.keyCode) {
        case 49:
          inputSquareTypes[1].checked = true;
          break;
        case 50:
          inputSquareTypes[2].checked = true;
          break;
        case 51:
          inputSquareTypes[3].checked = true;
          break;
        case 52:
          inputSquareTypes[4].checked = true;
          break;
        default:
          break;
      }
    }
  }

  importMap() {
    const file = document.getElementById('import-map').files[0];

    if (file.type === "text/plain" && file.size === 1102) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result.indexOf('#') > -1) {
          const mapFormatted = this.convertToNewFormat(reader.result);
          localStorage.setItem('map', `[${mapFormatted}]`);
          this.map = JSON.parse(localStorage.getItem('map'));
          this.drawMap();
          document.getElementById('import-map').value = '';
        } else {
          this.infoModal('Le fichier que vous essayez d\'importer n\'est pas au format Extinction.', 'error');
        }
      };
      reader.readAsText(file);
    } else {
      this.infoModal('Le fichier que vous avez importé n\'est pas au format texte ou est trop volumineux (max. 1102 octets).', 'error');
    }
  }

  infoModal(content, type) {
    infoModal.textContent = content;
    infoModal.classList.remove('border-red-700');
    infoModal.classList.remove('text-red-extinction');
    infoModal.classList.remove('border-green-700');
    infoModal.classList.remove('text-green-extinction');

    if (type === 'error') {
      infoModal.classList.add('border-red-700');
      infoModal.classList.add('text-red-extinction');
    }

    if (type === 'success') {
      infoModal.classList.add('border-green-700');
      infoModal.classList.add('text-green-extinction');
    }

    if (infoModal.classList.contains('hidden')) {
      infoModal.classList.remove('hidden');
    }
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
    } else {
      this.infoModal('Vous devez mettre un titre à votre carte pour pouvoir la télécharger.', 'error');
    }
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
  }

  toFixed(float) {
    return parseInt(float.toString().split('.')[0], 10);
  }

  drawSquare(event, simpleClick) {
    if (this.isDrawing || simpleClick) {
      const { x, y } = this.getMousePos(event);
      const squareX = this.toFixed(x / this.squareSize);
      const squareY = this.toFixed(y / this.squareSize);
      let cannotDraw = 0;
      this.spawnPositions.forEach(spawn => {
        if (spawn[0] === squareX && spawn[1] === squareY) {
          cannotDraw = 1;
        }
      }); ""

      if (!cannotDraw) {
        this.map[this.toIndex(squareX, squareY)] = this.rightClick ? 0 : this.getSquareType();
        localStorage.setItem('map', JSON.stringify(this.map));
        this.drawMap();
      }
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
    const name = document.getElementById('title');
    const author = document.getElementById('author');

    const timeDiff = ((new Date() - new Date(localStorage.getItem('submittedAt'))) / 1000);

    if (timeDiff >= 120) {
      if (name.value && author.value && name.value.length >= 3 && author.value.length >= 3) {
        const regex = new RegExp(/^[\wàâçéèêëîïôûùüÿ:=&"'.()\[\]\- ]+$/, 'gi');
        if (regex.test(name.value)) {
          fetch('/editeur/download', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ map: this.convertToOldFormat(), name: name.value })
          }).then(res => res.json())
            .then(response => {
              const path = `/temp/${response.filename}_${response.timestamp}.txt`;
              const canvasBase64 = this.canvas.toDataURL();
              fetch('/editeur/map', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name.value, author: author.value, image: canvasBase64, map: JSON.stringify(this.map), path: path })
              }).then(res => {
                if (res.status === 201) {
                  this.infoModal('Votre carte a été soumise avec succès !', 'success');
                  localStorage.setItem('submittedAt', new Date());
                }

                if (res.status === 409) {
                  res.json().then(res => {
                    this.infoModal(res.message, 'error');
                  });
                }
              });
            });
        } else {
          this.infoModal('Le titre de votre carte ne doit pas contenir de caractères spéciaux.', 'error');
        }
      } else {
        this.infoModal('L\'auteur et le titre de votre carte doit contenir au moins 3 caractères.', 'error');
      }
    } else {
      const infoTimeDiff = timeDiff.toFixed(0);
      const infoTimeRemaining = (120 - timeDiff).toFixed(0);
      this.infoModal(`Vous avez déjà soumis une carte il y a ${infoTimeDiff} secondes. Merci de bien vouloir patienter encore ${infoTimeRemaining} secondes avant d'en soumettre une autre.`, 'error');
    }
  }
}

const canvas = document.getElementById('editor-area')
const editor = new Editor(canvas);
editor.drawMap();