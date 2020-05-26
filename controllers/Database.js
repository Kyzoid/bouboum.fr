const sqlite3 = require('sqlite3').verbose();

// TODO migrate to SQL
module.exports = class Database {
  constructor() {
    this.db = null;
  }

  open() {
    this.db = new sqlite3.Database('./data/db.sqlite', (err) => {
      if (err) {
        return console.error(err.message);
      }
      return true;
    });
  }

  selectUser(username) {
    const sql = `SELECT * FROM user WHERE username = ?`;

    return new Promise((resolve, reject) => {
      this.db.all(sql, [username], (err, row) => {
        if (err) { reject("Read error: " + err.message) }
        resolve(row);
      });
    });
  }

  async insertUser(username) {
    const row = await this.selectUser(username);

    if (row.length === 0) {
      const sql = `INSERT INTO user (username) VALUES (?)`;

      return new Promise((resolve, reject) => {
        this.db.run(sql, [username], (err) => {
          if (err) { reject("Insert error: " + err.message) }
          else {
            resolve(1);
          }
        });
      });
    }

    return 0;
  }

  selectUserId(username) {
    const sql = `SELECT id FROM user WHERE username = ?`;

    return new Promise((resolve, reject) => {
      this.db.all(sql, [username], (err, row) => {
        if (err) { reject("Read error: " + err.message) }
        resolve(row);
      });
    });
  }

  async selectAdminUser (username) {
    const sql = `SELECT id, password FROM admin WHERE username = ?`;
    return new Promise((resolve, reject) => {
      this.db.all(sql, username, (err, row) => {
        if (err) { reject("Read error: " + err.message) }
        resolve(row);
      });
    });
  }

  selectScoreId(usernameId, createdAt, game) {
    const table = `score_${game}`;
    const sql = `SELECT id FROM ${table} WHERE username_id = (?) and created_at = (?)`;

    return new Promise((resolve, reject) => {
      this.db.all(sql, [usernameId, createdAt], (err, row) => {
        if (err) { reject("Read error: " + err.message) }
        resolve(row);
      });
    });
  }

  // BOUBOUM --------------------------------------------------------------------
  

  selectBouboumUsersAndScoreByDate(date) {
    const table = 'score_bouboum';
    const sql = `SELECT u.username, s.win, s.total, s.ratio FROM user u JOIN ${table} s ON s.username_id = u.id WHERE s.created_at = ?`;

    return new Promise((resolve, reject) => {
      this.db.all(sql, [date], (err, row) => {
        if (err) { reject("Read error: " + err.message) }
        resolve(row);
      });
    });
  }

  async insertBouboumScore(score) {
    const table = 'score_bouboum';
    const username = score[0];
    await this.insertUser(username);
    let userId = await this.selectUserId(username);
    if (userId.length === 1) {
      const createdAt = score[score.length - 1];
      const scoreId = await this.selectScoreId(userId[0].id, createdAt, 'bouboum');

      if (scoreId.length === 0) {
        const sql = `INSERT INTO ${table} (username_id, total, win, ratio, created_at) VALUES (?, ?, ?, ?, ?)`;
        score[0] = userId[0].id;
        return new Promise((resolve, reject) => {
          this.db.run(sql, score, (err) => {
            if (err) { reject("Insert error: " + err.message) }
            else {
              resolve(1);
            }
          });
        });
      }
    }
  }

  // AAAAH --------------------------------------------------------------------

  selectAaaahUsersAndScoreByDate(date) {
    const table = 'score_aaaah';
    const sql = `SELECT u.username, s.win, s.total, s.guiding, s.guiding_ratio, s.kills FROM user u JOIN ${table} s ON s.username_id = u.id WHERE s.created_at = ?`;

    return new Promise((resolve, reject) => {
      this.db.all(sql, [date], (err, row) => {
        if (err) { reject("Read error: " + err.message) }
        resolve(row);
      });
    });
  }

  async insertAaaahScore(score) {
    const table = 'score_aaaah';
    const username = score[0];
    await this.insertUser(username);
    let userId = await this.selectUserId(username);
    if (userId.length === 1) {
      const createdAt = score[score.length - 1];
      const scoreId = await this.selectScoreId(userId[0].id, createdAt, 'aaaah');

      if (scoreId.length === 0) {
        const sql = `INSERT INTO ${table} (username_id, total, guiding, win, win_ratio, guiding_ratio, kills, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        score[0] = userId[0].id;
        return new Promise((resolve, reject) => {
          this.db.run(sql, score, (err) => {
            if (err) { reject("Insert error: " + err.message) }
            else {
              resolve(1);
            }
          });
        });
      }
    }
  }


  close() {
    this.db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      return true;
    });
  }
};
