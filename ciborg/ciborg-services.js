'use strict'

module.exports = (ciborgDb, gamesDb) => {
    const m = 
    {
        getMostPopularGames: async(limit) =>
        {
            try{
                return await gamesDb.getMostPopularGames(limit);
            } catch(error) {
                throw error;
            }
        },

        searchGameByName: async(name, limit) =>
        {
            try {
            return await gamesDb.searchGameByName(name, limit);
            } catch(error) {
                throw error;
            }
        },

        getGame: async(gameId) => 
        {
            try {
                return await gamesDb.getGame(gameId);
            } catch(error) {
                throw error;
            }
        },

        addGroup: async(group) =>
        {
            try {
                return await ciborgDb.addGroup(group);
            } catch(error) {
                throw error;
            }
        },
    
        getGroup: async(gID) =>
        {
            try{
                const group = await ciborgDb.getGroup(gID);
                const games = await gamesDb.getGamesName(group.games);
                group.games = games;
                return group;
            } catch(error) {
                throw error;
            }
        },

        deleteGroup: async(gID) =>
        {
            try {
                return await ciborgDb.deleteGroup(gID);
            } catch(error){
                throw error;
            }
        },
        
        editGroup: async(groupID, name, description) =>
        {
            try {
                return await ciborgDb.editGroup(groupID, name, description);
            } catch(error) {
                throw error;
            }
        },

        listGroups: async() => 
        {
            try {
                return await ciborgDb.listGroups();
            } catch(error) {
                throw error;
            }
        },

        addGame: async(groupID, gameID) =>
        {
            try {
                return await ciborgDb.addGame(groupID, gameID);
            } catch(error) {
                throw error;
            }
        },

        removeGame: async(groupID, gameID) =>
        {
            try {
                return await ciborgDb.removeGame(groupID, gameID);
            } catch(error){
                throw error;
            }
        },

    };

    return m;
};