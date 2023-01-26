const {Router} = require('express');
const router = Router();

const { 
    createSede,querySedes,editSede,
 } = require('../controllers/Sedes.controller.js');

router.route('/crear').post(createSede);
router.route('/edit').post(editSede);
router.route('/consultarSedes').get(querySedes);


module.exports = router;