'use strict'

const assert = require('assert')
const db = require('../ciborg-db')('localhost', 9200, 'game_groups');

describe('ciborg-db-test', function()
{
    beforeEach(async() => 
    {
        try {
            await db.clearIndex();
        } catch(error) {  }
    });
    after(async() => 
    {
        try {
            await db.clearIndex();
        } catch(error) {  }
    });

    it('Add, Get, Delete Test', async() =>
    {
        const group = 
        {
            name: "groupTest1",
            description: "groupTest1_Description",
            games: [] 
        }

        try {
            const id = await db.addGroup(group);
            const group2 = await db.getGroup(id);
            await db.deleteGroup(id)

            assert.deepEqual(group2, group);
            try {
                await db.getGroup(id);
                assert.fail('group should have been deleted');
            } catch(error){
                assert.notDeepEqual(error, null);
            }
        } catch(error) {
            assert.fail(error);
        }
        
    });

    it('Add, Remove Game Test', async() => 
    {
        const groupTestName = 'groupToAddGame';
        const groupTestDescription = 'test to add game';
        const groupToAddGame = 
        {
            name: groupTestName,
            description: groupTestDescription,
            games: [] 
        }
        try {
            const id = await db.addGroup(groupToAddGame);
            const gameId = 122;
            await db.addGame(id, gameId);
            const group1 = await db.getGroup(id);
            await db.removeGame(id, gameId);
            const group2 = await db.getGroup(id);
            assert.deepEqual(group1.games.length, 1);
            assert.deepEqual(group1.games[0], gameId);
            assert.deepEqual(group2.games.length, 0); 
        }
        catch(error){
            assert.fail(error);
        }
    });

    //don't understand why it doesn't work honestly, only works in debug mode
    it('List groups Test', async() =>
    {
        const groupTestName = 'groupToList';
        const groupTestDescription = 'test list group';
        const groupToAddGame = 
        {
            name: groupTestName,
            description: groupTestDescription,
            games: [] 
        }
        
        try {
            const id = await db.addGroup(groupToAddGame);
            const groups = await db.listGroups();
            assert.deepEqual(groups.length, 1);
            assert.deepEqual(groups[0], { name: groupTestName, id: id, description: groupTestDescription});
        } catch(error) {
            assert.fail(error);
        }
    });

    it('Edit Group', async() =>
    {
        const groupOriginal = 
        {
            name: 'groupToEdit',
            description: 'test group edit',
            games: [] 
        }
        const groupExpected = 
        {
            name: 'groupToEdit2',
            description: 'test group edit2',
            games: [] 
        }
        try {
            const id = await db.addGroup(groupOriginal);
            await db.editGroup(id, groupExpected.name, groupExpected.description);
            const group = await db.getGroup(id);
            assert.deepEqual(group, groupExpected);
        } catch(error) {
            assert.fail(error);
        }
    });
});