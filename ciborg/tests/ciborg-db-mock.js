'use strict'

module.exports = function() 
{
    let groups = [];
    const m = 
    {
        addGroup: async(group) =>
        {
            groups.push(group);
            return groups.length-1;
        },
    
        getGroup: async(gID) =>
        {
            if(groups[gID])
                return JSON.parse(JSON.stringify(groups[gID]));
            else throw {message: 'resource not found'};
        },

        deleteGroup: async(gID) =>
        {
            if(groups[gID]) {
                groups[gID] = null;
                return;
            }
            else throw {message: 'resource not found'};
        },
        
        editGroup: async(groupID, name, description) =>
        {
            if(!groups[groupID])
                throw {message: 'resource not found'};
            groups[groupID].name = name || groups[groupID].name;
            groups[groupID].description = description || groups[groupID].description;
            return;
        },

        listGroups: async() => 
        {
            return groups.filter(x => x != null).map(x => ({ id: groups.indexOf(x), ...x}));
        },

        addGame: async(groupID, gameID) =>
        {
            if(!groups[groupID])
                throw {error: 'resource not found'};
            groups[groupID].games.push(gameID);
            return;
        },

        removeGame: async(groupID, gameID) =>
        {
            if(!groups[groupID] || !groups[groupID].games.includes(gameID))
                throw {error: 'resource not found'};
            groups[groupID].games.splice(groups[groupID].games.indexOf(gameID), 1);
            return;
        },

        clearIndex: async() =>
        {
            groups = [];
            return;
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