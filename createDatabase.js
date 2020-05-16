const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data/db.sqlite', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connecté à la base de données SQlite.');
});

db.run('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(50) NOT NULL)', err => {
  if (err) return console.error(err.message);
  console.log('La table user a bien été créée.');
});
db.run('CREATE TABLE IF NOT EXISTS score_bouboum (id INTEGER PRIMARY KEY AUTOINCREMENT, username_id INTEGER NOT NULL, total INT NOT NULL, win INT NOT NULL,  ratio REAL NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY(username_id) REFERENCES user(id))', err => {
  if (err) return console.error(err.message);
  console.log('La table score_bouboum a bien été créée.');
});
db.run('CREATE TABLE IF NOT EXISTS score_aaaah (id INTEGER PRIMARY KEY AUTOINCREMENT, username_id INTEGER NOT NULL, total INT NOT NULL, guiding INT NOT NULL, win INT NOT NULL,  win_ratio REAL NOT NULL, guiding_ratio REAL NOT NULL, kills INTEGER NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY(username_id) REFERENCES user(id))', err => {
  if (err) return console.error(err.message);
  console.log('La table score_aaaah a bien été créée.');
});
db.run('CREATE TABLE IF NOT EXISTS admin (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(50) NOT NULL, password VARCHAR(255) NOT NULL)', err => {
  if (err) return console.error(err.message);
  console.log('La table admin a bien été créée.');
});

db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connexion à la base de données fermée.');
});