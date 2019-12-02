'use strict'

const requestSync = require('request');

function requestAsync(options){
    return new Promise((resolve,reject) => 
        {
            requestSync(url, (error, response, body) => 
            { 
                if(error)
                    reject(error);
                else resolve(response);
            });
        });
}

requestAsync.get = (options) =>
{
    return new Promise((resolve,reject) => 
    {
        requestSync.get(options, (error, response, body) => 
        { 
            if(error)
                reject(error);
            else resolve(response);
        });
    });
};
requestAsync.post = (options) =>
{
    return new Promise((resolve,reject) => 
    {
        requestSync.post(options, (error, response, body) => 
        { 
            if(error)
                reject(error);
            else resolve(response);
        });
    });
};
requestAsync.put = (options) =>
{
    return new Promise((resolve,reject) => 
    {
        requestSync.put(options, (error, response, body) => 
        { 
            if(error)
                reject(error);
            else resolve(response);
        });
    });
};
requestAsync.delete = (options) =>
{
    return new Promise((resolve,reject) => 
    {
        requestSync.delete(options, (error, response, body) => 
        { 
            if(error)
                reject(error);
            else resolve(response);
        });
    });
};

module.exports = requestAsync;