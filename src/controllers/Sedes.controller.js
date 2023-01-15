const SedeCtrl ={};
const modelSede = require("../models/Sede");

SedeCtrl.createSede = async(req, res) => {
    try {
        const { data } = req.body;
        const sede = await new modelSede(data);
        const sedes = await modelSede.find();
        res.status(200).json({ sedes: sedes });
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}
SedeCtrl.querySedes = async(req, res) => {
    try {
        const sedes = await modelSede.find();
        res.status(200).json({ sedes: sedes });
    } catch (error) {
        console.log(error)
    }
}
module.exports = SedeCtrl;