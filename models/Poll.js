const sequelize = require("../lib/Sequelize");
const { DataTypes, Model } = require("sequelize");
const Tag = require('./Tag');

class Poll extends Model {}
Poll.init(
  {
    title: {
        type: DataTypes.STRING,
        validate: {
            len: [3, 100]
        },
        unique: true,
        allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true
    },
    banner: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true
    },
    startAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: "poll",
    paranoid: true,
  }
);

Tag.hasMany(Poll, { foreignKey: 'tag_id'});
Poll.belongsTo(Tag, { foreignKey: 'tag_id'});

//Poll.sync({ force: true });

module.exports = Poll;