const sequelize = require("../lib/Sequelize");
const Admin = require("./Admin");
const Map = require("./Map");
const Player = require("./Player");
const ScoreAaaah = require("./ScoreAaaah");
const ScoreBouboum = require("./ScoreBouboum");
const Tag = require("./Tag");
const Poll = require("./Poll");
const Vote = require("./Vote");

sequelize
    .sync({ alter: true })
    .then((result) => console.log("Sync OK"))
    .catch((result) => console.error("Sync KO"));

module.exports = {
    sequelize,
    Admin,
    Map,
    Player,
    ScoreAaaah,
    ScoreBouboum,
    Tag,
    Poll,
    Vote
};
