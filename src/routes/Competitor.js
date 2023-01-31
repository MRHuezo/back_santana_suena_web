const {Router} = require('express');
const router = Router();

const { 
    createCompetitor,
    queryParticipantes
 } = require('../controllers/Competitor.controller.js');

router.route("/create").post(createCompetitor);
router.route("/get").get(queryParticipantes);


module.exports = router;