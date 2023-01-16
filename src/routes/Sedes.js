const {Router} = require('express');
const router = Router();

const { 
    createSede,querySedes,signIn
 } = require('../controllers/Sedes.controller.js');

router.route('/crear').post(createSede);
router.route('/consultarSedes').get(querySedes);
router.route("/signIn").post(signIn);

module.exports = router;