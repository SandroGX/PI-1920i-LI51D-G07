'use strict'

const request = require('request');

module.exports = function(host, port, indexName) 
{
    const baseUrl = `http://${host}:${port}/${indexName}`

    const sendUpdateScript = function(id, script, done)
    {
        request.post
        (
            {
                uri: `${baseUrl}/_update/${id}`,
                headers: { 'content-type': 'application/json'},
                body: JSON.stringify({ script })
            },
            function (error, response, body)
            {
                if(error) {
                    done({}, error)
                    return;
                }
                if(response.statusCode >= 400) {
                    done({error: 'database couldn\'t respond'});
                    return;
                }

                done(null);
            }
        );
    }

    const m = 
    {
        addGroup: (group, done) =>
        {
            request.post(
            {
                uri: `${baseUrl}/_doc`,
                headers: { 'content-type': 'application/json'},
                body: JSON.stringify(group)
            },
            function (error, response, body)
            {
                if(error) {
                    done({}, error)
                    return;
                }
                if(response.statusCode >= 400) {
                    done({}, {error: 'database couldn\'t respond'});
                    return;
                }

                done(JSON.parse(body)._id, null);
            });
        },
    
        getGroup: (gID, done) =>
        {
            request.get(`${baseUrl}/_doc/${gID}`, function (error, response, body)
            {
                if(error) {
                    done(null, error)
                    return;
                }
                if(response.statusCode >= 400) {
                    done(null, {error: 'database couldn\'t respond'});
                    return;
                }

                done(JSON.parse(body)._source, null);
            });
        },

        deleteGroup: (gID, done) =>
        {
            request.delete(`${baseUrl}/_doc/${gID}`, function (error, response)
            {
                if(error) {
                    done(error)
                    return;
                }
                if(response.statusCode >= 400) {
                    done({error: 'database couldn\'t respond'});
                    return;
                }

                done(null);
            });
        },
        
        editGroup: (groupID, name, description, done) =>
        {
            const script = {
                lang: 'painless',
                params: {
                    name: name,
                    description: description
                },
                source: (name ? 'ctx._source.name = params.name;' : '') +
                (description ? 'ctx._source.description = params.description;' : '')
            };

            sendUpdateScript(groupID, script, done);
        },

        listGroups: (done) => 
        {
            request.get(`${baseUrl}/_search`, function (error, response, body)
            {
                if(error) {
                    done(null, error)
                    return;
                }
                if(response.statusCode >= 400) {
                    done(null, {error: 'database couldn\'t respond'});
                    return;
                }

                const answer = JSON.parse(body);
                const hits = answer && answer.hits && answer.hits.hits || [];
                const groups = hits.map(hit => ({ name: hit._source.name, id: hit._id, description: hit._source.description }));
                
                done(groups, null);
            });
        },

        addGame: (groupID, gameID, done) =>
        {
            const script = {
                lang: 'painless',
                params: {
                    game: gameID
                },
                source: 
                'if (!ctx._source.games.contains(params.game))' +
                    '{ ctx._source.games.add(params.game) }'
            };

            sendUpdateScript(groupID, script, done);
        },

        removeGame: (groupID, gameID, done) =>
        {
            const script = {
                lang: 'painless',
                params: {
                    game: gameID
                },
                source: 
                'if (ctx._source.games.contains(params.game))' +
                    '{ ctx._source.games.remove(ctx._source.games.indexOf(params.game)) }'
            };

            sendUpdateScript(groupID, script, done);
        },

        clearIndex: (done) =>
        {
            request.delete(`${baseUrl}`, function (error, response, body)
            {
                if(error) {
                    done(error);
                    return;
                }
                if(response.statusCode >= 400) {
                    done({error: 'database couldn\'t respond'});
                    return;
                }

                done(null);
            });
        }
    };
    return m;
}

/*
{
    name: "",
    description: "",
    games: [] //ids
}
*/