const sequelize = require("../lib/Sequelize");
const { DataTypes, Model } = require("sequelize");
const Poll = require('./Poll');
const Map = require('./Map');

class Vote extends Model {}
Vote.init(
  {
    ip: {
        type: DataTypes.STRING,
        validate: {
            len: [3, 50]
        },
        unique: false,
        allowNull: false
    }
  },
  {
    sequelize,
    modelName: "vote"
  }
);

Poll.hasMany(Vote, { foreignKey: 'poll_id'});
Vote.belongsTo(Poll, { foreignKey: 'poll_id'});

Map.hasMany(Vote, { foreignKey: 'map_id'});
Vote.belongsTo(Map, { foreignKey: 'map_id'});

//Vote.sync({ force: true });

module.exports = Vote;