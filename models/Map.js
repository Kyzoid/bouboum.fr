const sequelize = require("../controllers/Sequelize");
const { DataTypes, Model } = require("sequelize");
const Tag = require('./Tag');

class Map extends Model {}
Map.init(
  {
    name: {
        type: DataTypes.STRING,
        validate: {
            len: [3, 100]
        },
        unique: true,
        allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        len: [3, 12]
      },
      allowNull: false
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    map: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: "map",
    paranoid: true,
  }
);

Map.belongsToMany(Tag, { through: 'map_tags' });
Tag.belongsToMany(Map, { through: 'map_tags' });

module.exports = Map;