const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

class Database {
  constructor() {
    this.db = null;
  }

  async open() {
    const args = process.argv.slice(2);
    const username = args[0];
    const password = args[1];

    this.db = new sqlite3.Database('./data/db.sqlite', (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connecté à la base de données SQlite.');
    });

    if (username && password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      this.insertAdminUser(username, hashedPassword)
        .then(res => {
          console.log(`L'utilisateur ${username} a bien été ajouté à la base de données.`)
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      console.log("Vous n'avez passé aucun argument !")
    }


  }

  async insertAdminUser(user, password) {
    const sql = `INSERT INTO admin (username, password) VALUES (?, ?)`;
    return new Promise((resolve, reject) => {
      this.db.run(sql, [user, password], (err) => {
        if (err) { reject("Insert error: " + err.message) }
        else {
          resolve(1);
        }
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

const database = new Database();
database.open().then(res => { database.close() });
