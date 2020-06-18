const {sequelize, Tag, Map} = require('../models/index.js');

const tags = ['officielle', 'injouable', 'épervier', 'artistique', 'fun'];

tags.forEach((tag, index) => {
    Tag.create({ name: tag })
        .then(res => {
            console.log(res);
            console.log(`Le tag ${tag} a bien été créé.`);
            console.log(index, tags.length);
    }).catch(error => {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.log(`Le tag ${tag} existe déjà.`);
        } else {
            console.log(`Une erreur est survenue pour le tag ${tag}`);
        }
    });
});
