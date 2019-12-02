'use strict'

const gamesDb = require('./board-games-data-mock')();
const ciborgDb = require('./ciborg-db-mock')();
const services = require('../ciborg-services')(ciborgDb, gamesDb);

const assert = require('assert')

describe('ciborg-services-test', function()
{
    beforeEach(async() => 
    {
        try {
            await ciborgDb.clearIndex();
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
            const id = await services.addGroup(group);
            const group2 = await services.getGroup(id);
            await services.deleteGroup(id)

            assert.deepEqual(group2, group);
            try {
                await services.getGroup(id);
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
        };
        
        try {
            const id = await services.addGroup(groupToAddGame);
            const gameId = 61;
            await services.addGame(id, gameId);
            const group1 = await services.getGroup(id);
            await services.removeGame(id, gameId);
            const group2 = await services.getGroup(id);
            assert.deepEqual(group1.games.length, 1);
            assert.deepEqual(group1.games[0], 'name'+gameId);
            assert.deepEqual(group2.games.length, 0); 
        }
        catch(error){
            assert.fail(error);
        }
    });

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
            const id = await services.addGroup(groupToAddGame);
            const groups = await services.listGroups();
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
            const id = await services.addGroup(groupOriginal);
            await services.editGroup(id, groupExpected.name, groupExpected.description);
            const group = await services.getGroup(id);
            assert.deepEqual(group, groupExpected);
        } catch(error) {
            assert.fail(error);
        }
    });

    it('get by popularity should return something', async() => {
        try{
            const games = await services.getMostPopularGames(null); 
            assert.deepEqual(games.length, 30);
        } catch(error){
            assert.fail(error);
        }
    });

    it('search by name should return something', async() => {
        try{
            const games = await services.searchGameByName('m', null)
            assert.deepEqual(games.length, 30);
        } catch(error){
            assert.fail(error);
        }
    });

    it('get most popular by id', async() => {
        try{
            const games = await services.getMostPopularGames(null);
            const game = await services.getGame(games[0].id);
            assert.deepEqual(games[0].id, game.id); 
        } catch(error){
            assert.fail(error);
        }
    });
});