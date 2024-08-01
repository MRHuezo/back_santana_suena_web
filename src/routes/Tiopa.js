const { Router } = require("express");
const router = Router();
const TiopaCtrl = require("../controllers/Tiopa.controller");

router.get("/files", TiopaCtrl.getFiles);
router.post("/sendEmail", TiopaCtrl.sendEmail);
router.post("/uploadXls", TiopaCtrl.uploadXls);
router.post("/initializeWhatsApp", TiopaCtrl.initializeWhatsApp);
router.get("/qrCode", TiopaCtrl.getQrCode);
router.get("/sessionData", TiopaCtrl.getSessionData);

module.exports = router;