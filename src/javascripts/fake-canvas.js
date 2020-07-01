class FakeCanvas {
  constructor() {
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.map = null;

    this.squareSize = 24;
    this.width = this.canvas.width / this.squareSize;
    this.height = this.canvas.height / this.squareSize;

    this.orangeSquare = document.getElementById('orange-square');
    this.blackSquare = document.getElementById('black-square');
    this.blueSquare = document.getElementById('blue-square');
    this.iceSquare = document.getElementById('ice-square');
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

  setMap(map, convert) {
    if (convert) {
      this.map = JSON.parse(`[${this.convertToNewFormat(map)}]`);
    } else {
      this.map = JSON.parse(map);
    }

    this.drawMap();
  }

  getMap() {
    return this.map;
  }

  getBase64() {
    return this.canvas.toDataURL();
  }
};

const fakeCanvas = new FakeCanvas();

const importMaps = (event) => {
  const files = event.target.files;
  Object.values(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result.indexOf('#') > -1) {

        if (!reader.result.endsWith('#')) {
          reader.result += '#';
        }

        const mapId = file.name.match(/(\d+)/g)[0];

        fakeCanvas.setMap(reader.result, true);

        const map = {
          name: `Carte ${mapId}`,
          author: 'Extinction',
          image: fakeCanvas.getImage(),
          map: fakeCanvas.getMap(),
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

const refreshMapsImage = async (event) => {
  const maps = await fetch('/maps', { method: 'GET' }).then(res => res.json());
  let mapsRepared = 0;
  maps.forEach((map, index) => {
      fakeCanvas.setMap(map.map, false);
      const base64 = fakeCanvas.getBase64();
      
      fetch(`/maps/${map.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: base64 })
      }).then((res) => {
        if (res.status === 200) {
          console.log(`Colonnes "image" actualisées : ${++mapsRepared}`);
        }
      });
  });
};

const repareMaps = async () => {
  const maps = await fetch('/maps', { method: 'GET' }).then(res => res.json());
  let mapsRepared = 0;
  maps.forEach((map, index) => {
      if (map.map.includes('#')) {

        fakeCanvas.setMap(map.map, true);

        const convertedMap = JSON.stringify(fakeCanvas.getMap());

        fetch(`/maps/${map.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ map: convertedMap })
        }).then((res) => {
          if (res.status === 200) {
            console.log(`Colonnes "map" réparées : ${++mapsRepared}`);
          }
        });
      }
  });
};

document.getElementById('import-maps').addEventListener('change', importMaps);
document.getElementById('refresh-maps-image').addEventListener('click', refreshMapsImage);
document.getElementById('repare-maps').addEventListener('click', repareMaps);
