const {Router} = require('express');
const router = Router();

const { 
    uploadFileMultiple,
    createCompetitor,
    queryParticipantes
 } = require('../controllers/Competitor.controller.js');

router.route("/create").post(uploadFileMultiple, createCompetitor);
router.route("/get").get(queryParticipantes);


module.exports = router;