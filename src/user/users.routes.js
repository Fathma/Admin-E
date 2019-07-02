const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require("../helpers/auth")

const { Administrator, Editor, Contributor } = require("../helpers/rolecheck");
const user = require('./users.controller')

router.get("/login",  user.loginPage)
router.get("/register", ensureAuthenticated, Administrator, user.registrationPage)
router.post("/login",user.login)
router.post("/register", ensureAuthenticated, Administrator, user.userregistration)
router.get("/logout", user.logout)
router.get("/getUsers",ensureAuthenticated, Administrator, user.getUsers)
router.get("/Edit/:id",ensureAuthenticated, user.edit)
router.post("/saveEdit",ensureAuthenticated, user.saveEdit)
router.get("/profile/:id",ensureAuthenticated, user.profile)
router.get("/changePass/:id",ensureAuthenticated, user.changePass)
router.get("/changePassPage/:token",ensureAuthenticated, user.changePassPage)
router.post("/SaveNewPass",ensureAuthenticated, user.SaveNewPass)

module.exports = router
