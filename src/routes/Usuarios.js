const {Router} = require('express');
const router = Router();

const { 
    signIn, createUsuario
 } = require('../controllers/Usuarios.controller.js');

router.route("/login").post(signIn);
router.route("/createUser").post(createUsuario);

module.exports = router;