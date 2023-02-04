const ParticipanteCtrl = {};
const modelCompetitor = require("../models/Competitor");
const sendEmail = require("../middleware/sendEmail");
const uploadFileAws = require("../middleware/awsFile");
const { default: mongoose } = require("mongoose");

ParticipanteCtrl.uploadFileMultiple = async (req, res, next) => {
  try {
    await uploadFileAws.uploadInscription(req, res, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
      }
      return next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

ParticipanteCtrl.createCompetitor = async (req, res) => {
  try {
    const { body, files } = req;
    const { pay, personal_identify, photo } = files;

    const data = {
      ...body,
      pay_key: pay[0].key,
      pay: pay[0].location,
      personal_identify_key: personal_identify[0].key,
      personal_identify: personal_identify[0].location,
      photo_key: photo[0].key,
      photo: photo[0].location,
      status: "INSCRITO",
    };

    if (
      data.name === "" ||
      data.id_sede === "" ||
      data.address === "" ||
      data.email === "" ||
      data.url_video === "" ||
      data.pay === "" ||
      data.personal_identification === "" ||
      data.phone === "" ||
      data.name_song === "" ||
      data.experience === "" ||
      data.photo === "" ||
      data.place_from === "" ||
      data.birthday === "" ||
      data.genre === "" ||
      data.curp === ""
    ) {
      res
        .status(500)
        .json({ resp: "error", message: "Todos los campos son necesarios." });
      return;
    }

    const existCurp = await modelCompetitor.find({ curp: data.curp });
    const existEmail = await modelCompetitor.find({ email: data.email });

    console.log({ existCurp, existEmail });
    if (existCurp.length > 0) {
      res.status(400).json({
        resp: "error",
        message: "Ya se registró un participante con esta CURP.",
      });
      return;
    }
    if (existEmail.length > 0) {
      res.status(400).json({
        resp: "error",
        message: "Ya se registró un participante con este email.",
      });
      return;
    }

    const competitor = await new modelCompetitor(data);

    competitor.save();
    sendMailToCompetitorFirstStage(data.email, data.name);
    //const participantes = await modelSede.find();
    res.status(200).json({
      resp: "success",
      message:
        "Tu registro se realizó correctamente, se te ha enviado un correo confirmando tu registro.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
const sendMailToCompetitorFirstStage = async (email, name) => {
  try {
    console.log(email);
    // <a href="${urlReset}">${urlReset}</a>
    const htmlContentUser = `
                <div>                    
                    <h3 style="font-family: sans-serif; margin: 15px 15px;">SANTANA SUENA</h3>
                    <h4 style="font-family: sans-serif; margin: 15px 15px;">${name} Hemos recibido tu inscripción pronto estaremos revisandolo. Pronto te comunicamos si eres seleccionado para la gran final. Mucha suerte.:</h4>
                 
					             
                    <div style=" max-width: 550px; height: 100px;">
                        <p style="padding: 10px 0px;">SANTANA SUENA.</p>
                    </div>
				</div>`;

    await sendEmail.sendEmail(
      email,
      "Santana Suena Inscripción",
      htmlContentUser,
      "Santana Suena"
    );
  } catch (error) {
    console.log(error);
  }
};
ParticipanteCtrl.queryParticipantes = async (req, res) => {
  try {
    console.log(req.query);
    const { main, id_sede, search } = req.query;

    let $match = {
      $or: [{ name: { $regex: ".*" + search + ".*", $options: "i" } }],
      $and: [],
    };
    const status = req.query.status.split("-");
    if (status.length > 1) {
      $match.$and.push({
        $or: [{ status: status[0] }, { status: status[1] }],
      });
    } else {
      $match.$and.push({
        $or: [
          {
            status: status[0],
          },
        ],
      });
    }

    if (main === "false") {
      $match.$and.push({
        id_sede: mongoose.Types.ObjectId(id_sede),
      });
    }
    const query = await modelCompetitor.aggregate([
      {
        $match,
      },
    ]);

    const competitor = await modelCompetitor.populate(query, {
      path: "id_sede",
    });

    console.log(competitor);

    res.status(200).json({ competitor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

ParticipanteCtrl.accept = async (req, res) => {
  try {
    const sedes = await modelSede.find();
    res.status(200).json({ sedes: sedes });
  } catch (error) {
    console.log(error);
  }
};

ParticipanteCtrl.decline = async (req, res) => {
  try {
    const sedes = await modelSede.find();
    res.status(200).json({ sedes: sedes });
  } catch (error) {
    console.log(error);
  }
};

ParticipanteCtrl.seleccionarParticipante = async (req, res) => {
  try {
    const sedes = await modelSede.find();
    res.status(200).json({ sedes: sedes });
  } catch (error) {
    console.log(error);
  }
};

module.exports = ParticipanteCtrl;
