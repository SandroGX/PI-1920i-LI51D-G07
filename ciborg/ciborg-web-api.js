'use strict'

function getBody(req)
{
    return new Promise((resolve, reject) => {
        let bodyStr = '';
        req.on('data', chunk => { bodyStr += chunk.toString(); });
        req.on('end', () => 
        {
            req.body = JSON.parse(bodyStr);
            resolve(req.body);
        });
        req.on('error', (error) => {
            reject(error);
        });
    });
}

function noBody(req)
{
    return new Promise((resolve, reject) => {
        req.on('data', chunk => {  });
        req.on('end', () => 
        {
            resolve();
        });
        req.on('error', (error) => {
            reject(error);
        });
    });
}

module.exports = (app, services) =>
{
    app.get('/mostPopular', async(req, res) => 
    {
        try{
            await getBody(req);
            const games = await services.getMostPopularGames(req.body.limit);
            res.status(200).json({ games: games }); //OK
        } catch(error) {
            res.status(500).json({ error: error }); //Internal Server Error
        }
    });

    app.get('/search', async(req, res) => 
    {
        try {
            const parameters = await getBody(req);
            if(!parameters.name || parameters.name.length == 0)
            {
                const answer = { error: '\'name\' property required in body' };
                res.status(400).json(answer); //Bad Request
                return;
            }
            const games = await services.searchGameByName(parameters.name, parameters.limit);
            res.status(200).json({ games: games });//OK
        } catch(error) {
            res.status(500).json({ error: error })//Internal Server Error
        }
    });

    app.post('/game_groups', async(req, res) => 
    {
        try {
            const group = await getBody(req);
            if(!group.name || !group.description || !group.games)
            {
                const answer = { error: 'a group must have a \'name\', a \'description\' and a \'games\' array' };
                res.status(400).json(answer);//Bad Request
                return;
            }
            const groupId = await services.addGroup(group);
            res.status(201).json({ group_Id: groupId });//Created
        } catch(error) {
            res.status(500).json({ error: error })//Internal Server Error
        } 
    });

    app.get('/game_groups', async(req, res) => 
    {
        try {
            await noBody(req);
            const groups = await services.listGroups();
            res.status(200).json({ groups: groups });//OK
        } catch(error) {
            res.status(500).json({ error: error });//Internal Server Error
        }
    });

    app.get('/game_groups/:group_id', async(req, res) => 
    {
        try {
            await noBody(req);
            const group = await services.getGroup(req.params.group_id);
            res.status(200).json({ group: group });
        } catch(error) {
            res.status(500).json({ error: error });//Internal Server Error
        }
    });

    app.put('/game_groups/:group_id', async(req, res) => 
    {
        try {
            const group = await getBody(req);
            if(!(group.name || group.description))
            {
                const answer = { error: 'you need at least a \'name\' or \'description\' property in body' };
                res.status(400).json(answer);//Bad Request
                return;
            }
            await services.editGroup(req.params.group_id, group.name, group.description);
            res.status(204).end();//No Content
        } catch(error) {
            res.status(500).json({ error: error });//Internal Server Error
        } 
    });

    app.put('/game_groups/:group_id/games/:game_id', async(req, res) => 
    {
        try {
            await noBody(req);
            await services.addGame(req.params.group_id, req.params.game_id);
            res.status(204).end();//No Content'
        } catch(error) {
            res.status(500).json({ error: error });//Internal Server Error
        }
    });

    app.delete('/game_groups/:group_id/games/:game_id', async(req, res) => 
    {
        try {
            await noBody(req);
            await services.removeGame(req.params.group_id, req.params.game_id);
            res.status(204).end();
        } catch(error) {
            res.status(500).json({ error: error });//Internal Server Error
        }
            
    });

    app.get('/games/:game_id', async(req, res) => 
    {
        try {
            await noBody(req);
            const game = await services.getGame(req.params.game_id);
            res.status(200).json({ game: game });//OK
        } catch(error) {
            res.status(500).json({ error: error });//'Internal Server Error
        }
    });
}
