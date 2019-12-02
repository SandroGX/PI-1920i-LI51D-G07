'use strict'


module.exports = () => {

    const games = [];

    for(let i = 0; i < 100; ++i){
        games.push({id: i, name: 'name'+i, description: 'description'+i});
    }

    const m = {
        getMostPopularGames: async(limit) =>
        {
            limit = limit || 30;
            return games.filter(x => x != null).slice(0, limit);
        },

        searchGameByName: async(name, limit) =>
        {
            limit = limit || 30;
            return games.filter(x => x != null && x.name.includes(name)).slice(0, limit);
        },

        getGame: async(id) =>
        {
            if(games[id])
                return games[id];
            else throw 'some error';
        },

        getGamesName: async(ids) =>
        {
            return games.filter(x=> x != null && ids.includes(x.id)).map(x => x.name);
        }
    };

    return m;
}