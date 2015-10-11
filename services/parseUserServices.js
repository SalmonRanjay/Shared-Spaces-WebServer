/**
 * Created by ranjay on 10/10/15.
 */
var request = require("request");
var Q = require("q");
var queryString = require("querystring");
var utils   = require('../utils/config');




exports.testRequest = function (request, response) {

    var params = {
        url: "/classes/Messages",
        method: "GET"
    };

    makeRequest(params).then(function(data){

        console.log(data);

        response.send(data);
    },function(error){
        console.log(error.message)
    });

};


exports.createUser = function (request, response) {

    var params = {

        url: "/users",
        method: "POST",
        body :{
            username: request.body.username,
            password: request.body.password,
            email:    request.body.email
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


exports.loginUser = function (request, response) {

    var userCredentials = {
        username: request.params.username,
        password: request.params.password
    };
    var params = {
        url: "/login?" + queryString.stringify(userCredentials),
        method: "GET"
    };

    makeRequest(params).then(function(user){
        console.log(user.body);
        console.log(user.statusCode);
        response.status(user.statusCode).send(user.body);
    },function(error){
        console.log("Login error: "+ JSON.stringify(error));
        console.log("status code: "+ error.statusCode);
        response.status(error.statusCode).send(error.body);
    });


};

exports.getAllUsers = function(request,response){

    var params = {
        url: "/users",
        method: "GET"
    };

    makeRequest(params).then(function(user){

        console.log(user);
        response.send(user.body);

    },function(error){
        response.send(error.body);
    })
};

exports.getUserById = function(request, response){
    var params = {
        url: "/users"+request.params.userId,
        method: "GET"
    };

    makeRequest(params).then(function(user){

        console.log(user);
        response.send(user.body);

    },function(error){
        response.send(error.body);
    });
};

exports.createFriendshipRelation = function (request, response) {

    var params = {
        url: "/users/"+request.body.userId,
        method: "PUT",
        body: {
            "friendsRelation":{
                "__op":"AddRelation",
                "objects":[{"__type":"Pointer","className":"_User","objectId":request.body.friendId}]
            }
        }

    };

    makeRequest(params).then(function(relation){

        console.log(relation);
        console.log(relation.body);
        response.status(relation.statusCode).send(relation.body);

    },function(error){
        response.status(error.statusCode).send(error.body);
    });
};


exports.isLoggedIn = function (req, res) {

    console.log("Session token sent to request: " + req.params.sessionId);

    request({
        url: utils.baseUrl + "/users/me",
        method: "GET",
        headers: {
            'X-Parse-Application-Id': utils.parseApplicationId,
            'X-Parse-REST-API-Key': utils.parseRestApiKey,
            'X-Parse-Session-Token': req.params.sessionId
        }
    }, function (error, response, body) {

        if(!error && response.statusCode == 200){

            console.log(response.statusCode);
            console.log(body);
            console.log("success Logged in");
            res.status(response.statusCode).send(body);

        }else  {
            //if(response.statusCode == 400)
            //console.log(response.statusCode);
            console.log(error);
            console.log(body);
            res.status(response.statusCode).send(body);


        }
    });
};

exports.logout = function(req, res){

    request({
        url: utils.baseUrl + "/logout",
        method: "POST",
        headers: {
            'X-Parse-Application-Id': utils.parseApplicationId,
            'X-Parse-REST-API-Key': utils.parseRestApiKey,
            'X-Parse-Session-Token': req.params.sessionId
        }
    }, function (error, response, body) {

        if(!error && response.statusCode == 200){
            console.log("logout Success");
            console.log(body);
            res.send(body);

        }else {
            console.log("logout failure");
            console.log(error);
            res.status(response.statusCode).send({message: "logout Failure \n invalid session token"});
        }
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
            'X-Parse-REST-API-Key': utils.parseRestApiKey,
            'X-Parse-Revocable-Session': 1
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


