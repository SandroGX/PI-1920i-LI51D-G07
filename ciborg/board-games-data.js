'use strict'

const request = require('./request-pr');

module.exports = (host) => {
    const m = {
        getMostPopularGames: async(limit) =>
        {
            try{
                limit = limit || 30;
                const res =  await request.get(`${host}/api/search?order_by=popularity&limit=${limit}&fields=name,id,description&${getClientIDQuery()}`); 
                if(res.statusCode >= 400) 
                    throw {message: `${host} couldn\'t get games`, response: res};   
                return JSON.parse(res.body).games;
            }
            catch(error){
                throw error;
            }
        },

        searchGameByName: async(name, limit) =>
        {
            try{
                limit = limit || 30;
                const res = await request.get(`${host}/api/search?name=${name}&limit=${limit}&fields=name,id,description&${getClientIDQuery()}`);
                if(res.statusCode >= 400) 
                    throw {message: `${host} couldn\'t get games`, response: res};
                return JSON.parse(res.body).games;
            }
            catch(error){
                throw error;
            }
        },

        getGame: async(id) =>
        {
            try{
                const res = await request.get(`${host}/api/search?ids=${id}&${getClientIDQuery()}`);
                if(res.statusCode >= 400) 
                    throw {message: `${host} couldn\'t get game`, response: res};
                return JSON.parse(res.body).games[0];
            }
            catch(error){
                throw error;
            }
        },

        getGamesName: async(ids) =>
        {
            try{
                if(!ids || ids.length == 0)
                    return [];

                const t = ids.reduce((acc, id, i) => acc + id + (i < ids.length-1 ? ',' : ''), '');
                const res = await request.get(`${host}/api/search?ids=${t}&${getClientIDQuery()}`);
                if(res.statusCode >= 400) 
                    throw {message: `${host} couldn\'t get game`, response: res};
                return JSON.parse(res.body).games.map(x => ({id: x.id, name: x.name}));
            }
            catch(error){
                throw error;
            }   
        }
    };

    return m;
}

//shouldn't be here
function getClientIDQuery()
{
    return 'client_id=D57NlHcQcE';
}