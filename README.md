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


#### Sauvegardes
Un CRON pg_dump la base de données PostgreSQL sur le serveur de production tous les jours à 01h00

Faire un dump de la base de données : pg_dump
```sh
$ docker exec -i db pg_dump -U dbuser --format=tar database | gzip > ~/backups/dump_$(date +%Y-%m-%d_%H-%M-%S).tar.gz
```
Récupérer le dump sur sa machine : rsync
```sh
$ rsync --archive user@ip:~/backups/ .
```
Restaurer les données : pg_restore
```sh
$ gunzip -c dump_2020-06-05_20-32-25.tar.gz | docker exec -i db pg_restore -U dbuser --no-owner --clean --verbose --dbname=database
```

## Collaborer
Si vous avez envie de coder, faites des PR.

## Licence
[MIT](https://choosealicense.com/licenses/mit/)
