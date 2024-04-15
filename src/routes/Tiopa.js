const { Router } = require("express");
const router = Router();

const {
  getFiles,
  sendEmail
} = require("../controllers/Tiopa.controller.js");


router.route("/getFiles").get(getFiles);
router.route('/sendEmail/').post(sendEmail);



module.exports = router;