'use strict'

const assert = require('assert');
const bgd = require('../board-games-data')('https://www.boardgameatlas.com');

describe('board-games-data Test', function() {
    it('get by popularity should return something', function(done){
        bgd.getMostPopularGames(null, (games, err) => {
            assert.deepEqual(err, null);
            assert.deepEqual(games.length, 30);
            done();
        });
    });

    it('search by name should return something', function(done){
        bgd.searchGameByName('m', null, (games, err) => {
            assert.deepEqual(err, null);
            assert.deepEqual(games.length, 30);
            done();
        });
    });

    it('get most popular by id', function(done){
        bgd.getMostPopularGames(null, (games, error1) => {
            bgd.getGame(games[0].id, (game, error2) => {
                assert.deepEqual(error1, null);
                assert.deepEqual(error2, null);
                assert.deepEqual(games[0].id, game.id);
                done();
            });
        });
    });

    it('get most popular games names by id', function(done){
        bgd.getMostPopularGames(1, (games, error1) => {
            bgd.getGamesName(games.map(x => x.id), (names, error2) => {
                assert.deepEqual(error1, null);
                assert.deepEqual(error2, null);
                assert.deepEqual(games.map(x => x.name), names.map(x => x.name));
                done();
            });
        });
    });
});