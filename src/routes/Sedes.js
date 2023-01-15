const {Router} = require('express');
const router = Router();

const { 
    createSede,querySedes
 } = require('../controllers/Sedes.controller.js');

router.route('/crear').post(createSede);
router.route('/consultarSedes').get(querySedes);

module.exports = router;