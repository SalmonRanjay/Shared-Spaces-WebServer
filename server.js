var express = require("express");
var bodyParser = require("body-parser");

var parseUserServices = require("./services/parseUserServices");
var parseGroupServices  = require("./services/parseGroupsServices");

var multer = require('multer');

var config = require('./utils/config');







var app = express();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router




// User login route
router.route("/users/login/:username/:password").get(parseUserServices.loginUser);

// Get all Users
router.route("/users").get(parseUserServices.getAllUsers);

// Get a single user
router.route("users/:userId").get(parseUserServices.getUserById);

// check if a user is logged in
router.route("/users/isLoggedIn/:sessionId").get(parseUserServices.isLoggedIn);

// create a Group
router.route("/groups").post(parseGroupServices.createGroup);

// log out a user
router.route("/users/logout/:sessionId").get(parseUserServices.logout);



// prefix all routes with ap1/v1
app.use('/api/v1', router);


app.listen(port);
console.log("magic happens on port: " + port);
