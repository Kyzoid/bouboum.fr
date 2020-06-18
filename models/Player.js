const sequelize = require("../controllers/Sequelize.js");
const { DataTypes, Model } = require("sequelize");

class Player extends Model {}
Player.init(
  {
    name: {
        type: DataTypes.STRING,
        validate: {
            len: [3, 100]
        },
        unique: true,
        allowNull: false
    },
  },
  {
    sequelize,
    modelName: "player",
    paranoid: true,
  }
);

module.exports = Player;