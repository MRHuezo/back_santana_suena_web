const ParticipanteCtrl ={};
const modelParticipante = require("../models/Participante");

SedeCtrl.createParticipante = async(req, res) => {
    try {
        const { data } = req.body;
        const participante = await new modelSede(participante);
        const participantes = await modelSede.find();
        res.status(200).json({ participantes: participantes });
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

SedeCtrl.queryParticipantes = async(req, res) => {
    try {
        const sedes = await modelSede.find();
        res.status(200).json({ sedes: sedes });
    } catch (error) {
        console.log(error)
    }
}
SedeCtrl.seleccionarParticipante = async(req, res) => {
    try {
        const sedes = await modelSede.find();
        res.status(200).json({ sedes: sedes });
    } catch (error) {
        console.log(error)
    }
}
module.exports = ParticipanteCtrl;

