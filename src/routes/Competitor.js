const {Router} = require('express');
const router = Router();

const { 
    uploadFileMultiple,
    createCompetitor,
    queryParticipantes,
    accept,
    decline,
    selectToFinalSedeLocal,
    deselectToFinalSedeLocal,
    sendMailTofinalists
 } = require('../controllers/Competitor.controller.js');

router.route("/create").post(uploadFileMultiple, createCompetitor);
router.route("/get").get(queryParticipantes);
router.route("/get/main/").get(queryParticipantes);
router.route("/get/main/:competitor").get(queryParticipantes);
router.route("/get/sede/:id_sede").get(queryParticipantes);
router.route("/get/:competitor/:id_sede").get(queryParticipantes);

router.route('/edit/accept/').put(accept);
router.route('/edit/decline/').put(decline);
router.route('/edit/selectLocalFinalist/').put(selectToFinalSedeLocal);
router.route('/edit/deselectToFinalSedeLocal/').put(deselectToFinalSedeLocal);
router.route('/edit/sendMailTofinalists/').put(sendMailTofinalists);

module.exports = router;