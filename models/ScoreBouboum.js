const sequelize = require("../controllers/Sequelize.js");
const { DataTypes, Model } = require("sequelize");
const Player = require('./Player');

class ScoreBouboum extends Model { }
ScoreBouboum.init(
  {
    total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    win: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ratio: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "score_bouboum",
    paranoid: true,
  }
);

Player.hasOne(ScoreBouboum, { foreignKey: 'player_id'} );
ScoreBouboum.belongsTo(Player, { foreignKey: 'player_id'});

ScoreBouboum.sync();

module.exports = ScoreBouboum;