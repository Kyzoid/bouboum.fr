const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Database = require('../controllers/Database');
const fs = require('fs');
const { exec } = require('child_process');

const {
  SESS_NAME = 'sid',
} = process.env;

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/admin/login');
  } else {
    next();
  }
};

const redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/admin/');
  } else {
    next();
  }
}

router.get('/', redirectLogin, (req, res, next) => {
  res.render('admin');
});

router.post('/synchronization', redirectLogin, (req, res, next) => {
  exec(`npm run sync ${req.body.game}`, (error, stdout, stderr) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (stderr) {
      res.status(500).send(stderr);
    } else {
      res.status(200).send(stdout);
    }
  });
});

router.get('/data', redirectLogin, (req, res, next) => {
  const game = req.query.game || 'bouboum';
  const file = `./data/${game}.txt`;
  fs.readFile(file, (err, data) => {
    if (err) { throw new Error('fs.readFile() error.') }
    res.set('Content-Disposition', `attachment; filename=ranking_${game}.txt`);
    res.status(200).send(data);
  });
});

router.post('/add-data', redirectLogin, (req, res, next) => {
  try {
    const data = req.body;
    if (Object.keys(data).length) {
      const file = `./data/${req.body.ranking}.txt`;
      if (req.body.type === 'write') {
        fs.writeFile(file, data.data, err => {
          if (err) { throw new Error('fs.writeFile() error.') }
          res.sendStatus(200);
        });
      } else {
        fs.appendFile(file, data.data, err => {
          if (err) { throw new Error('fs.appendFile() error.') }
          res.sendStatus(200);
        });
      }

    } else {
      throw new Error('req.body is empty.')
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/login', redirectHome, (req, res, next) => {
  res.render('auth', { err: "" });
});

router.post('/login', redirectHome, async (req, res, next) => {
  const { username, password } = req.body;
  
  if (username && password) {
    const database = new Database();
    database.open();
    const adminUser = await database.selectAdminUser(username);
    database.close();
    console.log(adminUser)
    if (password && adminUser.length) {
      if ( await bcrypt.compare(password, adminUser[0].password) ) {
        req.session.userId = adminUser[0].id;
        res.redirect('/admin/');
      } else {
        res.render('auth', { err: 'Tu crois aller où comme ça ?!' });
      }
    } else {
      res.render('auth', { err: 'T\'es en train d\'écrire n\'importe quoi...' });
    }
  } else {
    res.render('auth', { err: 'Merci de bien vouloir remplir le formulaire !' });
  }

});

router.get('/logout', redirectLogin, (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/admin/');
    }

    res.clearCookie(SESS_NAME);
    res.redirect('/');
  });
});

module.exports = router;
