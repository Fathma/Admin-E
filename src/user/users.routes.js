const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");
const { Super } = require("../helpers/rolecheck");
const { SuperPublisher } = require("../helpers/rolecheck");
const user = require('./users.controller');

router.get("/login",  user.loginPage);
router.get("/register", ensureAuthenticated, Super, user.registrationPage);
router.post("/login",user.login);
router.post("/register", ensureAuthenticated, Super,user.userregistration);
router.get("/logout", user.logout);
router.get("/dashboard", ensureAuthenticated, user.getDashbash);
module.exports = router;
