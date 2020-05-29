const sequelize = require("../controllers/Sequelize.js");
const { DataTypes, Model } = require("sequelize");
const Player = require('./Player');

class ScoreAaaah extends Model { }
ScoreAaaah.init(
  {
    total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    guiding: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    win: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    win_ratio: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    guiding_ratio: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    kill: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "score_aaaah",
    paranoid: true,
  }
);

Player.hasOne(ScoreAaaah, { foreignKey: 'player_id'});
ScoreAaaah.belongsTo(Player, { foreignKey: 'player_id'});

//ScoreAaaah.sync({ force: true });

module.exports = ScoreAaaah;