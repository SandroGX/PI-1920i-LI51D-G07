'use strict'

function getBody(req, done)
{
    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk.toString(); });
    req.on('end', () => 
    {
        const body = JSON.parse(bodyStr);
        done(body);
    });
}

function noBody(req, done)
{
    req.on('data', chunk => { });
    req.on('end', () => 
    {
        done();
    });
}

module.exports = (app, services) =>
{
    app.get('/mostPopular', (req, res) => 
    {
        getBody(req, (body) => 
        {
            services.getMostPopularGames(body.limit, (games, error) => 
            {
                if (error)
                    res.status(500).json({ error: error }); //Internal Server Error
                else 
                    res.status(200).json({ games: games }); //OK
            });
        });
    });

    app.get('/search', (req, res) => 
    {
        getBody(req, (parameters) =>
        {
            if(!parameters.name || parameters.name.length == 0)
            {
                const answer = { error: '\'name\' property required in body' };
                res.status(400).json(answer); //Bad Request
                return;
            }
            services.searchGameByName(parameters.name, parameters.limit, (games, error) => 
            {
                if (error)
                    res.status(500).json({ error: error })//Internal Server Error
                else
                    res.status(200).json({ games: games });//OK
            });
        });
    });

    app.post('/game_groups', (req, res) => 
    {
        getBody(req, (group) => 
        {
            if(!group.name || !group.description || !group.games)
            {
                const answer = { error: 'a group must have a \'name\', a \'description\' and a \'games\' array' };
                res.status(400).json(answer);//Bad Request
                return;
            }
            services.addGroup(group, (groupId, error) => 
            {
                if (error) 
                    res.status(500).json({ error: error })//Internal Server Error
                else    
                    res.status(201).json({ group_Id: groupId });//Created
                
            });
        });
    });

    app.get('/game_groups', (req, res) => 
    {
        noBody(req, () => 
        {
            services.listGroups((groups, error) => 
            {
                if (error)
                    res.status(500).json({ error: error });//Internal Server Error
                else
                    res.status(200).json({ groups: groups });//OK
            });
        });
    });

    app.get('/game_groups/:group_id', (req, res) => 
    {
        noBody(req, () => 
        {
            services.getGroup(req.params.group_id, (group, error) => 
            {
                if (error) 
                    res.status(500).json({ error: error });//Internal Server Error
                else 
                    res.status(200).json({ group: group });
            });
        });
    });

    app.put('/game_groups/:group_id', (req, res) => 
    {
        getBody(req, (group) => 
        {
            if(!(group.name || group.description))
            {
                const answer = { error: 'you need at least a \'name\' or \'description\' property in body' };
                res.status(400).json(answer);//Bad Request
                return;
            }
            services.editGroup(req.params.group_id, group.name, group.description, (error) => 
            {
                if (error) 
                    res.status(500).json({ error: error });//Internal Server Error
                else 
                    res.status(204).end();//No Content
            });
        });
    });

    app.put('/game_groups/:group_id/games/:game_id', (req, res) => 
    {
        noBody(req, () => 
        {
            services.addGame(req.params.group_id, req.params.game_id, (error) => 
            {
                if (error)
                    res.status(500).json({ error: error });//Internal Server Error
                else
                    res.status(204).end();//No Content';
            });
        });
    });

    app.delete('/game_groups/:group_id/games/:game_id', (req, res) => 
    {
        noBody(req, () => 
        {
            services.removeGame(req.params.group_id, req.params.game_id, (error) => 
            {
                if (error)
                    res.status(500).json({ error: error });//Internal Server Error
                else
                    res.status(204).end();
            });
        });
    });

    app.get('/games/:game_id', (req, res) => 
    {
        noBody(req, () => 
        {
            services.getGame(req.params.game_id, (game, error) => 
            {
                if (error)
                    res.status(500).json({ error: error });//'Internal Server Error
                else 
                    res.status(200).json({ game: game });//OK
            });
        });
    });
}
