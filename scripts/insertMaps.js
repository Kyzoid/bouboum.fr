const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas')
const { sequelize, Tag, Map } = require('../models/index.js');

class FakeCanvas {
  constructor() {
    this.canvas = createCanvas(696, 456);
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

const directoryPath = path.join(__dirname, 'mondes');
//passsing directoryPath and callback function
fs.readdir(directoryPath, (err, files) => {
  //handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }
  //listing all files using forEach
  files.forEach((file) => {
    // Do whatever you want to do with the file
    fs.readFile(`${directoryPath}/${file}`, 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      }
      const mapId = file.match(/(\d+)/g)[0];

      if (!data.endsWith('#')) {
        data += '#';
      }

      fakeCanvas.setMap(data);

      Map.create({
        name: `Carte ${mapId}`,
        author: 'Extinction',
        image: fakeCanvas.getImage(),
        map: data,
        path: `/temp/mondes/monde_${mapId}.txt`
      })
        .then(async (map) => {
          console.log(`La map ${map.name} a bien été créé.`);
          const tag = await Tag.findByPk(1);
          map.addTag(tag);
        }).catch(error => {
          if (error.name === 'SequelizeUniqueConstraintError') {
            console.log(`La map ${map.name} existe déjà.`);
          } else {
            console.log(`Une erreur est survenue pour la map ${map.name}`);
          }
        });
    });
  });
});
