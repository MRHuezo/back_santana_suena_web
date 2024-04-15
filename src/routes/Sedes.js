const { Router } = require("express");
const router = Router();

const { 
  createSede,
  querySedes,
  editSede,
  queryGetSedeCompetitors,
} = require("../controllers/Sedes.controller.js");

router.route("/crear").post(createSede);
router.route("/edit").post(editSede);
router.route("/consultarSedes").get(querySedes);
router.route("/oneSedeCompetitors/:id_name").get(queryGetSedeCompetitors);

module.exports = router;
