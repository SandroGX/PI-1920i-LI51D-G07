'use strict'

const request = require('request');

module.exports = function() 
{
    let groups = [];
    const m = 
    {
        addGroup: (group, done) =>
        {
            groups.push(group);
            done(groups.length-1, null);
        },
    
        getGroup: (gID, done) =>
        {
            if(groups[gID])
                done(JSON.parse(JSON.stringify(groups[gID])), null);
            else done(null, {error: 'resource not found'})
        },

        deleteGroup: (gID, done) =>
        {
            if(groups[gID]) {
                groups[gID] = null;
                done(null);
            } else done({error: 'resource not found'});
        },
        
        editGroup: (groupID, name, description, done) =>
        {
            if(!groups[groupID])
                done({error: 'resource not found'});
            groups[groupID].name = name || groups[groupID].name;
            groups[groupID].description = description || groups[groupID].description;
            done(null);
        },

        listGroups: (done) => 
        {
            done(groups.filter(x => x != null).map(x => ({ id: groups.indexOf(x), ...x})), null);
        },

        addGame: (groupID, gameID, done) =>
        {
            if(!groups[groupID])
                done({error: 'resource not found'});
            groups[groupID].games.push(gameID);
            done(null);
        },

        removeGame: (groupID, gameID, done) =>
        {
            if(!groups[groupID] || !groups[groupID].games.includes(gameID))
                done({error: 'resource not found'});
            groups[groupID].games.splice(groups[groupID].games.indexOf(gameID), 1);
            done(null);
        },

        clearIndex: (done) =>
        {
            groups = [];
            done(null);
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