'use strict'

const assert = require('assert');
const bgd = require('../board-games-data')('https://www.boardgameatlas.com');

describe('board-games-data Test', () => {
    it('get by popularity should return something', async() =>
    {
        try{
            const games = await bgd.getMostPopularGames(null); 
            assert.deepEqual(games.length, 30);
        }
        catch(error){
            assert.fail(error);
        }
    });

    it('search by name should return something', async() => 
    {
        try{
            const games = await bgd.searchGameByName('m', null)
            assert.deepEqual(games.length, 30);
        }
        catch(error){
            assert.fail(error);
        }
    });

    it('get most popular by id', async() =>
    {
        try{
            const games = await bgd.getMostPopularGames(null);
            const game = await bgd.getGame(games[0].id);
            assert.deepEqual(games[0].id, game.id); 
        }
        catch(error){
            assert.fail(error);
        }
         
    });

    it('get most popular games names by id', async() => 
    {
        try{
            const games = await bgd.getMostPopularGames(1)
            const names = await bgd.getGamesName(games.map(x => x.id))
            assert.deepEqual(games.map(x => x.name), names.map(x => x.name));
        }
        catch(error){
            assert.fail(error);
        }
    });
});