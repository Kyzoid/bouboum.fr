# Bouboum Ranking

Map editor, polls, rankings and statistics related to [extinction-minijeux.fr](https://extinction-minijeux.fr/).

## Installation

Use [npm](https://www.npmjs.com/) to install dependencies.
```sh
$ npm install
```

Use [docker](https://www.docker.com/) to set-up your dev environment (you only need nodejs, redis and db containers for developments).
```sh
$ docker-compose up -d nodejs redis db
```

Use [webpack](https://webpack.js.org/) to watch and compile assets.
```sh
$ docker-compose exec nodejs npm run webpack:dev
```

## Contributing
Pull requests are welcome. Please open an issue first to discuss what you would like to change.

## Licence
[MIT](https://choosealicense.com/licenses/mit/)
