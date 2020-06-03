# Bouboum Ranking

Statistiques du classement Bouboum.

## Développement

Certbot et Webserver sont des services utilisés pour le déploiement en production.
```sh
$ docker-compose up -d nodejs redis db
```

Lancer Webpack
```sh
$ docker-compose exec app npm run webpack:dev
```

## Production
Pour configurer la production :
- Renommer la config ssl en nginx.conf.
- Modifier les variables d'environnements dans le .env et celles dans le docker-compose.yml.
- Modifier le Dockerfile pour que ça lance start:prod.
- Lancer webpack:prod si ça n'a pas déjà été fait.

#### Docker
Démarrer un service
```sh
$ docker-compose up -d --force-recreate --no-deps <service>
```
Stop un service
```sh
$ docker-compose stop <service>
ou
$ docker-compose rm -fsv <service>
```

Volumes
```sh
$ docker volume ls
$ docker volume rm <name>
```

## Collaborer
Si vous avez envie de coder, faites des PR.

## Licence
[MIT](https://choosealicense.com/licenses/mit/)
