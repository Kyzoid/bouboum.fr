class FakeCanvas {
  constructor() {
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.map = null;

    this.squareSize = 24;
    this.width = this.canvas.width / this.squareSize;
    this.height = this.canvas.height / this.squareSize;
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
            break;
          case 2:
            this.ctx.fillStyle = '#15737C';
            this.ctx.fillRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
            break;
          case 3:
            this.ctx.fillStyle = '#B4770E';
            this.ctx.fillRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
            break;
          case 4:
            this.ctx.fillStyle = '#BBEBF7';
            this.ctx.fillRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
            break;
        }
      }
    }
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

  getImage() {
    return this.canvas.toDataURL();
  }

  setMap(map) {
    this.map = JSON.parse(`[${this.convertToNewFormat(map)}]`);
    this.drawMap();
  }

  getMap() {
    return this.map;
  }
};

const fakeCanvas = new FakeCanvas();

const handleChange = (event) => {
  const files = event.target.files;
  Object.values(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result.indexOf('#') > -1) {

        if (!reader.result.endsWith('#')) {
          reader.result += '#';
        }

        const mapId = file.name.match(/(\d+)/g)[0];

        fakeCanvas.setMap(reader.result);

        const map = {
          name: `Carte ${mapId}`,
          author: 'Extinction',
          image: fakeCanvas.getImage(),
          map: reader.result,
          path: `/temp/mondes/monde_${mapId}.txt`,
          createdAt: new Date('1970-01-01'),
        };

        fetch('/admin/insert-maps/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(map)
        })
        .then(res => res.json())
        .then(res => console.log(res));

      } else {
        console.log('Le fichier que vous essayez d\'importer n\'est pas au format Extinction.');
      }
    };
    reader.readAsText(file);
  });
};

document.getElementById('import-maps').addEventListener('change', handleChange);