const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

(async ()=>{
  const args = process.argv.slice(2);
  const username = args[0];
  const password = args[1];

  if (username && password) {
    // password hash is made on the Admin Model hook
    Admin.create({ name: username, password: password })
      .then(res => {
        console.log(`L'utilisateur ${username} a bien été créé.`);
      });
  } else {
    console.log("Veuillez préciser le nom d'utilisateur et son mot de passe !");
  }
})();