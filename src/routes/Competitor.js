const {Router} = require('express');
const router = Router();

const { 
    uploadFileMultiple,
    createCompetitor,
    queryParticipantes,
    accept,
    decline
 } = require('../controllers/Competitor.controller.js');

router.route("/create").post(uploadFileMultiple, createCompetitor);
router.route("/get/main/").get(queryParticipantes);
router.route("/get/main/:competitor").get(queryParticipantes);
router.route("/get/sede/:id_sede").get(queryParticipantes);
router.route("/get/:competitor/:id_sede").get(queryParticipantes);

router.route('/edit/accept/:id_competitor').put(accept);
router.route('/edit/decline/:id_competitor').put(decline);


module.exports = router;