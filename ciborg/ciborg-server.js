'use strict'

const PORT = 8888;

const http = require('http');
const app = require('express')();
const ciborgDb = require('./ciborg-db')('localhost', 9200, 'game_groups');
const gamesDb = require('./board-games-data')('https://www.boardgameatlas.com');
const ciborgServices = require('./ciborg-services')(ciborgDb, gamesDb);
const ciborgWebAPI = require('./ciborg-web-api')(app, ciborgServices);

http.createServer(app).listen(PORT);