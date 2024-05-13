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
router.route("/consultarSedes/:edicion").get(querySedes);
router.route("/oneSedeCompetitors/:id_name/:edicion").get(queryGetSedeCompetitors);

module.exports = router;
