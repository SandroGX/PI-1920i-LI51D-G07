'use strict'

const gamesDb = require('./board-games-data-mock')();
const ciborgDb = require('./ciborg-db-mock')();
const services = require('../ciborg-services')(ciborgDb, gamesDb);

const assert = require('assert')

describe('ciborg-services-test', function()
{
    beforeEach((done) => 
    {
        ciborgDb.clearIndex((error) => { done(); });
    });

    afterEach((done) => 
    {
        ciborgDb.clearIndex((error) => { done(); });
    });

    it('Add, Get, Delete Test', (done) =>
    {
        const group = 
        {
            name: "groupTest1",
            description: "groupTest1_Description",
            games: [] 
        }

        services.addGroup(group, (id, error1) => 
        {
            services.getGroup(id, (group2, error2) =>
            {
                services.deleteGroup(id, (error3) => 
                {
                    services.getGroup(id, (group3, error4) => 
                    {
                        assert.deepEqual(error1, null)
                        assert.deepEqual(error2, null);
                        assert.deepEqual(error3, null);
                        assert.notDeepEqual(error4, null);
                        assert.deepEqual(group2, group);
                        assert.deepEqual(group3, null);
                        done();
                    });
                });
            });
        });
    });

    
    it('Add, Remove Game Test', (done) => 
    {
        let groupTestId;
        const groupTestName = 'groupToAddGame';
        const groupTestDescription = 'test to add game';
        const groupToAddGame = 
        {
            name: groupTestName,
            description: groupTestDescription,
            games: [] 
        }
        services.addGroup(groupToAddGame, (id) => 
        { 
            groupTestId = id;
            const gameId = 61;
            services.addGame(groupTestId, gameId, (error1) => 
            {
                services.getGroup(groupTestId, (group1, error2) => 
                {
                    services.removeGame(groupTestId, gameId, (error3) => 
                    {
                        services.getGroup(groupTestId, (group2, error4) => 
                        {  
                            assert.deepEqual(group1.games.length, 1);
                            assert.deepEqual(group1.games[0], 'name'+gameId);
                            assert.deepEqual(group2.games.length, 0);
                            assert.deepEqual(error1, null)
                            assert.deepEqual(error2, null);
                            assert.deepEqual(error3, null);
                            assert.deepEqual(error4, null);
                            done();
                        }); 
                    });
                });
            }); 
        });
    });

    it('List groups Test', (done) =>
    {
        let groupTestId;
        const groupTestName = 'groupToList';
        const groupTestDescription = 'test list group';
        const groupToAddGame = 
        {
            name: groupTestName,
            description: groupTestDescription,
            games: [] 
        }
        services.addGroup(groupToAddGame, (id) => 
        { 
            groupTestId = id; 
            services.listGroups((groups, error) =>
            {
                assert.deepEqual(error, null);
                assert.deepEqual(groups.length, 1);
                assert.deepEqual(groups[0], { name: groupTestName, id: groupTestId, description: groupTestDescription, games: []});
                done();
            });
        });
    });

    it('Edit Group', (done) =>
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
        services.addGroup(groupOriginal, (id, error1) => 
        { 
            services.editGroup(id, groupExpected.name, groupExpected.description, (error2) => 
            {
                services.getGroup(id, (group, error3) => 
                {
                    assert.deepEqual(error1, null);
                    assert.deepEqual(error2, null);
                    assert.deepEqual(error3, null);
                    assert.deepEqual(group, groupExpected);
                    done();
                });
            });
        });
    });

    it('get by popularity should return something', function(done){
        services.getMostPopularGames(null, (games, err) => {
            assert.deepEqual(err, null);
            assert.deepEqual(games.length, 30);
            done();
        });
    });

    it('search by name should return something', function(done){
        services.searchGameByName('m', null, (games, err) => {
            assert.deepEqual(err, null);
            assert.deepEqual(games.length, 30);
            done();
        });
    });

    it('get most popular by id', function(done){
        services.getMostPopularGames(null, (games, error1) => {
            services.getGame(games[0].id, (game, error2) => {
                assert.deepEqual(error1, null);
                assert.deepEqual(error2, null);
                assert.deepEqual(games[0].id, game.id);
                done();
            });
        });
    });
});