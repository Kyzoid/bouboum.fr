const sqlite3 = require('sqlite3').verbose();

module.exports = class Database {
  constructor() {
    this.db = null;
  }

  open() {
    this.db = new sqlite3.Database('./data/db.sqlite', (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connecté à la base de données SQlite.');

      this.db.run('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(50) NOT NULL)', err => {
        if (err) return console.error(err.message);
        console.log('La table user a bien été créée.');
      });
      this.db.run('CREATE TABLE IF NOT EXISTS score (id INTEGER PRIMARY KEY AUTOINCREMENT, username_id VARCHAR(50) NOT NULL, total INT NOT NULL, win INT NOT NULL,  ratio REAL NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY(username_id) REFERENCES user(id))', err => {
        if (err) return console.error(err.message);
        console.log('La table score a bien été créée.');
      });
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

  selectScoreId(usernameId, createdAt) {
    const sql = `SELECT id FROM score WHERE username_id = (?) and created_at = (?)`;

    return new Promise((resolve, reject) => {
      this.db.all(sql, [usernameId, createdAt], (err, row) => {
        if (err) { reject("Read error: " + err.message) }
        resolve(row);
      });
    });
  }

  selectUsersAndScoreByDate(date) {
    const sql = `SELECT u.username, s.win, s.total, s.ratio FROM user u JOIN score s ON s.username_id = u.id WHERE s.created_at = ?`;

    return new Promise((resolve, reject) => {
      this.db.all(sql, [date], (err, row) => {
        if (err) { reject("Read error: " + err.message) }
        resolve(row);
      });
    });
  }

  async insertScore(score) {
    const username = score[0];
    await this.insertUser(username);
    let userId = await this.selectUserId(username);

    if (userId.length === 1) {
      const createdAt = score[score.length - 1];
      const scoreId = await this.selectScoreId(userId[0].id, createdAt);

      if (scoreId.length === 0) {
        const sql = `INSERT INTO score (username_id, total, win, ratio, created_at) VALUES (?, ?, ?, ?, ?)`;
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

  async selectAdminUser (username) {
    const sql = `SELECT password FROM admin WHERE username = ?`;
    return new Promise((resolve, reject) => {
      this.db.all(sql, username, (err, row) => {
        if (err) { reject("Read error: " + err.message) }
        resolve(row);
      });
    });
  }

  close() {
    this.db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connexion à la base de données fermée.');
    });
  }
};
