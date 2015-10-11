/**
 * Created by ranjay on 10/10/15.
 */
var request = require("request");
var Q = require("q");
var queryString = require("querystring");
var utils   = require('../utils/config');





exports.createGroup = function(request, response){

    var params = {

        url: "/classes/Groups",
        method: "POST",
        body :{
            groupName: request.body.groupName,
            invitedUsers: request.body.invitedUsers
        }

    };

    makeRequest(params).then(function(data){

        console.log(data);
        response.status(data.statusCode).send(data.body);
    },function(error){
        console.log(error.body);
        response.status(error.statusCode).send(error.body);
    });

};




function makeRequest(params){



    var deferred = Q.defer();

    var url = utils.baseUrl + params.url;

    request({
        url: url, //URL to hit
        method: params.method,
        body: params.body,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'X-Parse-Application-Id': utils.parseApplicationId,
            'X-Parse-REST-API-Key': utils.parseRestApiKey

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