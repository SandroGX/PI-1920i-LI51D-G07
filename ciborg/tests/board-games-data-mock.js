'use strict'

const request = require('request');

module.exports = function () {

    const games = [];

    for(let i = 0; i < 100; ++i){
        games.push({id: i, name: 'name'+i, description: 'description'+i});
    }

    const m = {
        getMostPopularGames: (limit, done) =>
        {
            limit = limit || 30;
            done(games.filter(x => x != null).slice(0, limit), null);
        },

        searchGameByName: (name, limit, done) =>
        {
            limit = limit || 30;
            done(games.filter(x => x != null && x.name.includes(name)).slice(0, limit));
        },

        getGame: (id, done) =>
        {
            if(games[id])
                done(games[id], null);
            else done(null, {error: 'some error'})
        },

        getGamesName: (ids, done) =>
        {
            const names = games.filter(x=> x != null && ids.includes(x.id)).map(x => x.name);
            done(names, null);
        }
    };

    return m;
}