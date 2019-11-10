'use strict'

const assert = require('assert')

describe('ciborg-db-test', function()
{
    let db;

    before((done) => 
    {
        db = require('../ciborg-db')('localhost', 9200, 'game_groups');
        done();
    });
    beforeEach((done) => 
    {
        db.clearIndex((error) => { done(); });
    });

    afterEach((done) => 
    {
        db.clearIndex((error) => { done(); });
    });

    it('Add, Get, Delete Test', (done) =>
    {
        const group = 
        {
            name: "groupTest1",
            description: "groupTest1_Description",
            games: [] 
        }

        db.addGroup(group, (id, error1) => 
        {
            db.getGroup(id, (group2, error2) =>
            {
                db.deleteGroup(id, (error3) => 
                {
                    db.getGroup(id, (group3, error4) => 
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
        db.addGroup(groupToAddGame, (id) => 
        { 
            groupTestId = id;
            const gameId = 122;
            db.addGame(groupTestId, gameId, (error1) => 
            {
                db.getGroup(groupTestId, (group1, error2) => 
                {
                    db.removeGame(groupTestId, gameId, (error3) => 
                    {
                        db.getGroup(groupTestId, (group2, error4) => 
                        {  
                            assert.deepEqual(group1.games.length, 1);
                            assert.deepEqual(group1.games[0], gameId);
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

    //don't understand why it doesn't work honestly, only works in debug mode
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
        db.addGroup(groupToAddGame, (id) => 
        { 
            groupTestId = id; 
            db.listGroups((groups, error) =>
            {
                assert.deepEqual(error, null);
                assert.deepEqual(groups.length, 1);
                assert.deepEqual(groups[0], { name: groupTestName, id: groupTestId, description: groupTestDescription});
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
        db.addGroup(groupOriginal, (id, error1) => 
        { 
            db.editGroup(id, groupExpected.name, groupExpected.description, (error2) => 
            {
                db.getGroup(id, (group, error3) => 
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
});