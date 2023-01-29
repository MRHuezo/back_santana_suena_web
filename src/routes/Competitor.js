const {Router} = require('express');
const router = Router();

const { 
    createCompetitor
 } = require('../controllers/Competitor.controller.js');

router.route("/create").post(createCompetitor);


module.exports = router;