/**
 * Created by ranjay on 10/10/15.
 */
var request = require("request");
var Q = require("q");
var queryString = require("querystring");
var utils   = require('../utils/config');





function makeRequest(params){



    var deferred = Q.defer();

    var url = utils.nessieBaseUrl + params.url + utils.nessieKey;

    request({
        url: url, //URL to hit
        method: params.method,
        body: params.body,
        json: true,
        headers: {
            'Content-Type': 'application/json'
        }
    }, function(error, response, body){
        if(!error && response.statusCode == 200) {
            //console.log(response.statusCode, body);
            deferred.resolve({statusCode: response.statusCode, body: body});

        } else {
            console.log(error);
            deferred.reject({statusCode: response.statusCode, body: body});
        }
    });

    return deferred.promise;
}