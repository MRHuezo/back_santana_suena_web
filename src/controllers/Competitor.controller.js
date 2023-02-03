const ParticipanteCtrl = {};
const modelCompetitor = require("../models/Competitor");
const sendEmail = require("../middleware/sendEmail");
const uploadFileAws = require("../middleware/awsFile");

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
    res.status(500).json({ message: error });
  }
};

ParticipanteCtrl.createCompetitor = async (req, res) => {
  try {
    const data = req.body;
    console.log(req.files);
    console.log({ req: req.body });
    /* 
        const data ={ 
            name: 'Fractal Estudio Mx',
            id_sede:'63d0c6050bb0de7af0a603f6',
            address: 'Hechos 22 22',
            email:'fractalestudiomx@gmail.com',
            url_video:'https://www.youtube.com/watch?v=icsr89F04Mw',
            pay: '74983993',
            personal_identify: '9364633',
            phone: '3151526613',
            name_song: 'Flor de luna',
            artistic_experience: 'Naci en una ciudad que reconocía su llegada para aportar al mundo...',
            from: 'Autlán de Navarro',
            birthday: '15/01/1990',
            genre: 'Masculino',
            status:'INSCRITO'
        };   */

    if (
      data.name === "" ||
      data.id_sede === "" ||
      data.address.street === "" ||
      data.address.number === "" ||
      data.address.postal_code === "" ||
      data.email === "" ||
      data.url_video === "" ||
      //data.pay.path === "" ||
      //data.personal_identification === "" || 
      //cambia estas validaciones por las Arrays de imgs, 
      //en el body ya no vienen
      data.phone === "" ||
      data.name_song === "" ||
      data.experience === "" ||
      data.place_from === "" ||
      data.birthday === "" ||
      data.genre === ""
    ) {
      throw new Error("Todos los campos son necesarios.");
    }

    /* console.log(await upload(req, res, function (err) {
        if (err) {
          res.status(500).json({ message: err });
        }
    
        return res.json({
            success: true,
            message: 'Image uploaded!'
        });

      }));  */
    //res.status(500).json({resp: 'error',message:'Todos los campos son necesarios.' });
    return;
    //const result = await awsUploadImage(data.pay, "pagos");

    //res.status(200).json({ resp: 'success', message: 'Tu registro se realizó correctamente, se te ha enviado un correo confirmando tu registro.' });
    //return;
    //Realizar validación email  y curp ya fueron registradas
    sendMailToCompetitorFirstStage(data.email, data.name);
    const competitor = await new modelCompetitor(data);

    competitor.save();
    //const participantes = await modelSede.find();
    res.status(200).json({
      resp: "success",
      message:
        "Tu registro se realizó correctamente, se te ha enviado un correo confirmando tu registro.",
    });
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
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
    const competitor = await modelCompetitor.find().populate("id_sede");
    res.status(200).json({ competitor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
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
