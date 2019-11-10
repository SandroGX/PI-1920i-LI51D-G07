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

module.exports = (router, services) =>
{
    router.get('/mostPopular', (req, res) => 
    {
        getBody(req, (body) => 
        {
            services.getMostPopularGames(body.limit, (games, error) => 
            {
                if (error) {
                    res.status = 500;
                    res.statusMessage = 'Internal Server Error';
                    res.headers = {
                        'Content-type': 'application/json'
                    }
                    
                    const answer = { error: error };
                    
                    res.end(JSON.stringify(answer));
                    
                } else {
                    
                    res.status = 200;
                    res.statusMessage = 'OK';
                    res.headers = {
                        'Content-type': 'application/json'
                    }
                    
                    const answer = { games: games };
                    
                    res.end(JSON.stringify(answer));
                }
            });
        });
    });

    router.get('/search', (req, res) => 
    {
        getBody(req, (parameters) =>
        {
            if(!parameters.name || parameters.name.length == 0)
            {
                res.status = 400;
                res.statusMessage = 'Bad Request';
                res.headers = {
                    'Content-type': 'application/json'
                }
                
                const answer = { error: '\'name\' property required in body' };
                
                res.end(JSON.stringify(answer));
                return;
            }
            services.searchGameByName(parameters.name, parameters.limit, (games, error) => 
            {
                if (error) {
                    res.status = 500;
                    res.statusMessage = 'Internal Server Error';
                    res.headers = {
                        'Content-type': 'application/json'
                    }
                    
                    const answer = { error: error };
                    
                    res.end(JSON.stringify(answer));
                    
                } else {
                    
                    res.status = 200;
                    res.statusMessage = 'OK';
                    res.headers = {
                        'Content-type': 'application/json'
                    }
                    
                    const answer = { games: games };
                    
                    res.end(JSON.stringify(answer));
                }
            });
        });
    });

    router.post('/game_groups', (req, res) => 
    {
        getBody(req, (group) => 
        {
            if(!group.name || !group.description || !group.games)
            {
                res.status = 400;
                res.statusMessage = 'Bad Request';
                res.headers = {
                    'Content-type': 'application/json'
                }
                
                const answer = { error: 'a group must have a \'name\', a \'description\' and a \'games\' array' };
                
                res.end(JSON.stringify(answer));
                return;
            }
            services.addGroup(group, (groupId, error) => 
            {
                if (error) {
                    res.status = 500;
                    res.statusMessage = 'Internal Server Error';
                    res.headers = {
                        'Content-type': 'application/json'
                    }
                    
                    const answer = { error: error };
                    
                    res.end(JSON.stringify(answer));
                    
                } else {
                    
                    res.status = 201;
                    res.statusMessage = 'Created';
                    res.headers = {
                        'Content-type': 'application/json'
                    }
                    
                    const answer = { group_Id: groupId };
                    
                    res.end(JSON.stringify(answer));
                }
            });
        });
    });

    router.get('/game_groups', (req, res) => 
    {
        noBody(req, () => 
        {
            services.listGroups((groups, error) => 
            {
                if (error) {
                    res.status = 500;
                    res.statusMessage = 'Internal Server Error';
                    res.headers = {
                        'Content-type': 'application/json'
                    }
                    const answer = { error: error };
                    res.end(JSON.stringify(answer));
                    
                } else {
                    
                    res.status = 200;
                    res.statusMessage = 'OK';
                    res.headers = {
                        'Content-type': 'application/json'
                    }
                    const answer = { groups: groups };
                    res.end(JSON.stringify(answer));
                }
            });
        });
    });

    router.get('/game_groups/:group_id', (req, res) => 
    {
        noBody(req, () => 
        {
            services.getGroup(req.routerParameters.group_id, (group, error) => 
            {
                if (error) {
                    res.status = 500;
                    res.statusMessage = 'Internal Server Error';
                    res.headers = {
                        'Content-type': 'application/json'
                    }
                    const answer = { error: error };
                    res.end(JSON.stringify(answer));
                    
                } else {
                    
                    res.status = 200;
                    res.statusMessage = 'OK';
                    res.headers = {
                        'Content-type': 'application/json'
                    }
                    const answer = { group: group };
                    res.end(JSON.stringify(answer));
                }
            });
        });
    });

    router.put('/game_groups/:group_id', (req, res) => 
    {
        getBody(req, (group) => 
        {
            if(!(group.name || group.description))
            {
                res.status = 400;
                res.statusMessage = 'Bad Request';
                res.headers = {
                    'Content-type': 'application/json'
                }
                
                const answer = { error: 'you need at least a \'name\' or \'description\' property in body' };
                
                res.end(JSON.stringify(answer));
                return;
            }
            services.editGroup(req.routerParameters.group_id, group.name, group.description, (error) => 
            {
                if (error) {
                    res.status = 500;
                    res.statusMessage = 'Internal Server Error';
                    res.headers = {
                        'Content-type': 'application/json'
                    }
                    
                    const answer = { error: error };
                    
                    res.end(JSON.stringify(answer));
                    
                } else {
                    
                    res.status = 204;
                    res.statusMessage = 'No Content';
                    res.headers = {
                        'Content-type': 'application/json'
                    }
                    
                    res.end();
                }
            });
        });
    });

    router.put('/game_groups/:group_id/games/:game_id', (req, res) => 
    {
        noBody(req, () => 
        {
            services.addGame(req.routerParameters.group_id, req.routerParameters.game_id, (error) => 
            {
                if (error) {
                    res.status = 500;
                    res.statusMessage = 'Internal Server Error';
                    res.headers = {
                        'Content-type': 'application/json'
                    }
                    
                    const answer = { error: error };
                    
                    res.end(JSON.stringify(answer));
                    
                } else {
                    
                    res.status = 204;
                    res.statusMessage = 'No Content';
                    res.headers = {
                        'Content-type': 'application/json'
                    }
                    
                    res.end();
                }
            });
        });
    });

    router.delete('/game_groups/:group_id/games/:game_id', (req, res) => 
    {
        noBody(req, () => 
        {
            services.removeGame(req.routerParameters.group_id, req.routerParameters.game_id, (error) => 
            {
                if (error) {
                    res.status = 500;
                    res.statusMessage = 'Internal Server Error';
                    res.headers = {
                        'Content-type': 'application/json'
                    }
                    
                    const answer = { error: error };
                    
                    res.end(JSON.stringify(answer));
                    
                } else {
                    
                    res.status = 204;
                    res.statusMessage = 'No Content';
                    res.headers = {
                        'Content-type': 'application/json'
                    }
                    
                    res.end();
                }
            });
        });
    });

    router.get('/games/:game_id', (req, res) => 
    {
        noBody(req, () => 
        {
            services.getGame(req.routerParameters.game_id, (game, error) => 
            {
                if (error) {
                    res.status = 500;
                    res.statusMessage = 'Internal Server Error';
                    res.headers = {
                        'Content-type': 'application/json'
                    }
                    const answer = { error: error };
                    res.end(JSON.stringify(answer));
                    
                } else {
                    
                    res.status = 200;
                    res.statusMessage = 'OK';
                    res.headers = {
                        'Content-type': 'application/json'
                    }
                    const answer = { game: game };
                    res.end(JSON.stringify(answer));
                }
            });
        });
    });
}
