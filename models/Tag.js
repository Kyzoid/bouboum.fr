const sequelize = require("../lib/Sequelize.js");
const { DataTypes, Model } = require("sequelize");

class Tag extends Model {}
Tag.init(
  {
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
  },
  {
    sequelize,
    modelName: "tag",
    paranoid: true,
  }
);

module.exports = Tag;