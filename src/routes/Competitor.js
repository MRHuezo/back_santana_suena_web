const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { 
    uploadFileMultiple,
    createCompetitor,
    queryParticipantes,
    queryOnlyOne,
    accept,
    decline,
    selectToFinalSedeLocal,
    deselectToFinalSedeLocal,
    sendMailTofinalists,
    pruebaEmail
 } = require('../controllers/Competitor.controller.js');

router.route("/create").post(uploadFileMultiple, createCompetitor);
router.route("/get").get(queryParticipantes);
router.route("/get/main/").get(queryParticipantes);
router.route("/get/main/:competitor").get(queryParticipantes);
router.route("/get/main/idname/:id_name/:id_sede").get(queryOnlyOne);
router.route("/get/sede/:id_sede").get(queryParticipantes);
router.route("/get/:competitor/:id_sede").get(queryParticipantes);

router.route('/edit/accept/').post(auth,accept);
router.route('/edit/decline/').post(auth,decline);
router.route('/edit/selectLocalFinalist/').post(auth,selectToFinalSedeLocal);
router.route('/edit/deselectToFinalSedeLocal/').post(auth, deselectToFinalSedeLocal);
router.route('/edit/sendMailTofinalists/').post(auth,sendMailTofinalists);
router.route('/pruebaEmail/').post(pruebaEmail);

module.exports = router;