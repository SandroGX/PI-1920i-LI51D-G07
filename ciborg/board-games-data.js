'use strict'

const request = require('request');

module.exports = function (host) {
    const m = {
        getMostPopularGames: (limit, done) =>
        {
            limit = limit || 30;
            request(`${host}/api/search?order_by=popularity&limit=${limit}&fields=name,id,description&${getClientIDQuery()}`, function (error, response, body)
            {
                if(error) {
                    done(null, error);
                    return;
                }
                if(response.statusCode >= 400) {
                    done(null, {error: `${host} couldn\'t get games`, response: response});
                    return;
                }

                done(JSON.parse(body).games, null);
            });
        },

        searchGameByName: (name, limit, done) =>
        {
            limit = limit || 30;
            request(`${host}/api/search?name=${name}&limit=${limit}&fields=name,id,description&${getClientIDQuery()}`, function (error, response, body)
            {
                if(error) {
                    done(null, error);
                    return;
                }
                if(response.statusCode >= 400) {
                    done(null, {error: `${host} couldn\'t get games`, response: response});
                    return;
                }

                done(JSON.parse(body).games, null);
            });
        },

        getGame: (id, done) =>
        {
            request(`${host}/api/search?ids=${id}&${getClientIDQuery()}`, function (error, response, body)
            {
                if(error) {
                    done(null, error)
                    return;
                }
                if(response.statusCode >= 400) {
                    done(null, {error: `${host} couldn\'t get game`, response: response});
                    return;
                }

                done(JSON.parse(body).games[0], null);
            });
        },

        getGamesName: (ids, done) =>
        {
            if(!ids || ids.length == 0)
            {
                done([], null);
                return;
            }
            const t = ids.reduce((acc, id, i) => acc + id + (i < ids.length-1 ? ',' : ''), '');
            request(`${host}/api/search?ids=${t}&${getClientIDQuery()}`, function (error, response, body)
            {
                if(error) {
                    done(null, error)
                    return;
                }
                if(response.statusCode >= 400) {
                    done(null, {error: `${host} couldn\'t get game`, response: response});
                    return;
                }

                done(JSON.parse(body).games.map(x => ({id: x.id, name: x.name})), null);
            });
        }
    };

    return m;
}

//shouldn't be here
function getClientIDQuery()
{
    return 'client_id=D57NlHcQcE';
}