'use strict'

module.exports = (ciborgDb, gamesDb) => {
    const m = 
    {
        getMostPopularGames: (limit, done) =>
        {
            gamesDb.getMostPopularGames(limit, done);
        },

        searchGameByName: (name, limit, done) =>
        {
            gamesDb.searchGameByName(name, limit, done);
        },

        getGame: (gameId, done) => 
        {
            gamesDb.getGame(gameId, done);
        },

        addGroup: (group, done) =>
        {
            ciborgDb.addGroup(group, done);
        },
    
        getGroup: (gID, done) =>
        {
            ciborgDb.getGroup(gID, (group, error1) => 
            {
                if(error1){
                    done(null, error1);
                    return;
                }
                gamesDb.getGamesName(group.games, (games, error2) => {
                    if(error2){
                        done(null, error2);
                        return;
                    }
                    group.games = games;
                    done(group, null);
                });
            });
        },

        deleteGroup: (gID, done) =>
        {
            ciborgDb.deleteGroup(gID, done);
        },
        
        editGroup: (groupID, name, description, done) =>
        {
            ciborgDb.editGroup(groupID, name, description, done);
        },

        listGroups: (done) => 
        {
            ciborgDb.listGroups(done);
        },

        addGame: (groupID, gameID, done) =>
        {
            ciborgDb.addGame(groupID, gameID, done);
        },

        removeGame: (groupID, gameID, done) =>
        {
            ciborgDb.removeGame(groupID, gameID, done);
        },

    };

    return m;
};