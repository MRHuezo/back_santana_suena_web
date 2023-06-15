const {Router} = require('express');
const router = Router();

const { 
    signIn, createUser
 } = require('../controllers/Users.controller.js');

router.route("/login").post(signIn);
router.route("/create").post(createUser);

module.exports = router;