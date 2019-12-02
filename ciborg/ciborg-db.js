'use strict'

const request = require('./request-pr');

module.exports = function(host, port, indexName) 
{
    const baseUrl = `http://${host}:${port}/${indexName}`

    const sendUpdateScript = async(id, script) =>
    {
        try {
            const res = await request.post
            ({
                uri: `${baseUrl}/_update/${id}`,
                headers: { 'content-type': 'application/json'},
                body: JSON.stringify({ script })
            });

            if(res.statusCode >= 400)
                throw {message: 'database couldn\'t respond', response: res};
                
        } catch(error) {
            throw error;
        }
    }

    const m = 
    {
        addGroup: async(group) =>
        {
            try {
                const res = await request.post(
                {
                    uri: `${baseUrl}/_doc`,
                    headers: { 'content-type': 'application/json'},
                    body: JSON.stringify(group)
                });

                if(res.statusCode >= 400)
                    throw {message: 'database couldn\'t respond', response: res};

                return JSON.parse(res.body)._id;
            } catch(error) {
                throw error;
            }
        },
    
        getGroup: async(gID) =>
        {
            try {
                const res = await request.get(`${baseUrl}/_doc/${gID}`);
                
                if(res.statusCode >= 400)
                    throw {message: 'database couldn\'t respond', response: res};

                return JSON.parse(res.body)._source;
            } catch(error) {
                throw error;
            }
        },

        deleteGroup: async(gID) =>
        {
            try {
                const res = await request.delete(`${baseUrl}/_doc/${gID}`);
                            
                if(res.statusCode >= 400)
                    throw {message: 'database couldn\'t respond', response: res};
            } catch(error) {
                throw error;
            }
            
        },
        
        editGroup: async(groupID, name, description) =>
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

            try {
                await sendUpdateScript(groupID, script);
            } catch(error) {
                throw error;
            }
        },

        listGroups: async() => 
        {
            try {
                const res = await request.get(`${baseUrl}/_search`);
                
                if(res.statusCode >= 400)
                    throw {message: 'database couldn\'t respond', response: res};

                const answer = JSON.parse(res.body);
                const hits = answer && answer.hits && answer.hits.hits || [];
                const groups = hits.map(hit => ({ name: hit._source.name, id: hit._id, description: hit._source.description }));
                
                return groups;
            } catch(error) {
                throw error;
            }
            
        },

        addGame: async(groupID, gameID) =>
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

            try {
                await sendUpdateScript(groupID, script);
            } catch(error) {
                throw error;
            }
        },

        removeGame: async(groupID, gameID) =>
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

            try {
                await sendUpdateScript(groupID, script);
            } catch(error) {
                throw error;
            }
        },

        clearIndex: async() =>
        {
            const res = await request.delete(`${baseUrl}`);
            try
            {
                if(res.statusCode >= 400)
                    throw {message: 'database couldn\'t respond', response: res};
            } catch(error) {
                throw error;
            }
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