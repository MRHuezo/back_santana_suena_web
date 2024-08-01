const ParticipanteCtrl = {};
const modelCompetitor = require("../models/Competitor");
const modelSede = require("../models/Sede");
const sendEmail = require("../middleware/sendEmail");
const uploadFileAws = require("../middleware/awsFile");
const { default: mongoose } = require("mongoose");

ParticipanteCtrl.uploadFileMultiple = async (req, res, next) => {
  try {
    await uploadFileAws.subir.uploadInscription(req, res, function (err) {
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
const deleteImagesAws = async (imagesKeys) => {
  try {
    imagesKeys.forEach(async (imageKey) => {
      await uploadFileAws.subir.eliminarImagen(imageKey);
    });
  } catch (error) {
    console.log(error);
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


const sedeId = mongoose.Types.ObjectId(data.id_sede);

const existCurp = await modelCompetitor.find({
  curp: data.curp
});

const existEmail = await modelCompetitor.find({
  email: data.email
});

const filteredCurp = existCurp.filter(item => item.id_sede.equals(sedeId));
const filteredEmail = existEmail.filter(item => item.id_sede.equals(sedeId));

    
    const keyImages = [pay[0].key, personal_identify[0].key, photo[0].key];
    let objectUpd = {};
    if (filteredCurp.length > 0 && filteredCurp[0].status !== "RECHAZADO" ||
    filteredEmail.length > 0 && filteredEmail[0].status !== "RECHAZADO") {
     
      deleteImagesAws(keyImages);
      res.status(400).json({
        resp: "error",
        message: "Ya se registró un participante con los datos proporcionados.",
      });
     
      return;
    } else {
      objectUpd = { curp: data.curp };
    }
   

    if (
      (filteredEmail.length > 0 && filteredEmail[0].status === "RECHAZADO")
    
    ) {
      await modelCompetitor.findByIdAndUpdate(objectUpd, data);
    }

    const competitor = await new modelCompetitor(data);

    competitor.save();

    const sede = await modelSede.findById(data.id_sede);

    await sendMailToSedeNewRegisterCompetitor(sede.mail, data.name);
    await sendMailToCompetitorFirstStage(data.email, data.name, data.sede);
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
ParticipanteCtrl.pruebaEmail = async (res) => {
  try {
    console.log("fdfd");
    sendMailToCompetitorFirstStage(
      "fractalestudiomx@gmail.com",
      "Martín Rivera"
    );
    return "OMG";
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
const sendMailToSedeNewRegisterCompetitor = async (emailSede, name) => {
  try {
    console.log(emailSede, name);
    // <a href="${urlReset}">${urlReset}</a>
    const htmlContentUser = `
        <div>                    
            <h3 style="font-family: sans-serif; margin: 15px 15px;">SANTANA SUENA NUEVO REGISTRO DE COMPETIDOR</h3>
            <h4 style="font-family: sans-serif; margin: 15px 15px;">Hay nuevo registro de competidor en tu sede con el siguiente nombre${name} </h4>

            <a href="www.santanasuena.com">REVISAR </a>

				</div>`;

    await sendEmail.sendEmail(
      emailSede,
      "Santana Suena nueva inscripción de competidor",
      htmlContentUser,
      "Santana Suena"
    );
  } catch (error) {
    console.log(error);
  }
};
const sendMailToCompetitorFirstStage = async (email, name, sede) => {
  try {
    console.log(email);
    // <a href="${urlReset}">${urlReset}</a>
    const htmlContentUser = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>🎉🎊SANTANA SUENA🎉🎊</title>
      <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Roboto', sans-serif;
        }
        
        .notificacion {
          border: 2px solid #000;
          border-radius: 10px;
          padding: 20px;
          margin: 20px;
        }
    
        .notificacion .header {
          text-align: center;
          margin-bottom: 20px;
          position: relative;
        }
    
        .notificacion .header img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          border-radius: 10px;
        }
    
        .notificacion .header h2 {
          font-size: 24px;
          margin-bottom: 5px;
        }
    
        .notificacion .header p {
          font-size: 14px;
          margin-bottom: 0;
        }
    
        .notificacion .contenido p {
          font-size: 16px;
          line-height: 1.5;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="notificacion">
        <div class="header">
          <img src="https://mountainsantanasuena.s3.us-east-2.amazonaws.com/santanaBanner1.png" alt="Imagen de encabezado">
          <h2>Tu inscripción se realizó correctamente</h2>
         
        </div>
        <div class="contenido">
          <p>Estimado ${name} Hemos recibido tu inscripción. Pronto estaremos revisando tus datos y el video que nos proporcionaste. </p>
          <p> Enseguida te comunicamos si eres seleccionado para la final la sede ${sede}. Felicidades por ser parte de SANTANA SUENA</p>
          
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h1 style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #007bff; margin-top: 40px; text-align: center;">
            🎉🎊¡Santana Suena!🎉🎊
              
            </h1>
            <p style="font-size: 18px; line-height: 1.5em; margin-top: 30px;">
              <a href="https://www.santanasuena.com" style="color: #007bff; text-decoration: none;">www.santanasuena.com</a><br><br>
              <strong style="color: #007bff;">Responsable:</strong> Dr. Martín Sandoval Gómez<br>
              <strong style="color: #007bff;">Director y Co-fundador del Centro Comunitario y de Salud Tiopa Tlanextli “Santuario de Luz A.C.”</strong><br>
              <strong style="color: #007bff;">Tel:</strong> 3173826632 Ext. 105<br>
              <strong style="color: #007bff;">Autlán de Navarro, Jalisco, C.P. 48903.</strong><br>
              <strong style="color: #007bff;">tiopatlanextli@hotmail.com</strong><br><br>
              <em style="color: #007bff;">NOTA IMPORTANTE:</em> TIOPA TLANEXTLI es una Asociación Civil sin fines de lucro, la intención en este concurso es meramente de carácter cultural y en homenaje al benefactor y co-fundador de esta institución. No contamos con los derechos para manejo de la imagen, ni de la música de CARLOS SANTANA. Este programa es sin fines políticos, ni afiliación partidista ni religiosa, es exclusivamente con fines culturales.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>`;

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
   /*  const query = await modelCompetitor.aggregate([
      {
        $match,
      },
    ]);

    const competitor = await modelCompetitor.populate(query, {
      path: "id_sede",
    }); */
    const query = await modelCompetitor.aggregate([
      {
        $lookup: {
          from: 'sedes', // Asumiendo que la colección de sedes se llama 'sedes'
          localField: 'id_sede',
          foreignField: '_id',
          as: 'sede_info'
        }
      },
      {
        $unwind: '$sede_info' // Desenrolla el array para facilitar el filtro
      },
      {
        $match: {
          'sede_info.edicion': 'SEGUNDA' // Filtra donde la edición de la sede es 'SEGUNDA'
        }
      },
      {
        $match // Agrega los filtros previamente definidos
      }
    ]);
   
    res.status(200).json({ competitor:query });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

ParticipanteCtrl.queryOnlyOne = async (req, res) => {
  try {
    const { id_name, id_sede  } = req.params;
    console.log(id_name, id_sede)
    const name = id_name.replace("-", " ");
    let edicion_letter = "";
    
  
    const competitor = await modelCompetitor.findOne({
      name: { $regex: ".*" + name + ".*", $options: "i" },
      id_sede:  mongoose.Types.ObjectId(id_sede)
    }).populate("id_sede");
    res.status(200).json({ competitor });
  } catch (error) {
    console.log(error); 
    res.status(500).json({ message: error.message });
  }
};

ParticipanteCtrl.accept = async (req, res) => {
  try {
    const { id_competitor } = req.query;
    const competitor = await modelCompetitor.findByIdAndUpdate(
      { _id: id_competitor },
      { status: "REVISADO" }
    );
    sendMailToCompetitorAccept(competitor.email, {});
    res.status(200).json({ message: "SE HA ACEPTADO A ESTE PARTICIPANTE. " });
  } catch (error) {
    console.log(error);
  }
};

ParticipanteCtrl.decline = async (req, res) => {
  try {
    const { id_competitor, reason } = req.body;
    const competitor = await modelCompetitor.findByIdAndDelete(
      { _id: id_competitor },
      { status: "RECHAZADO" }
    );

    sendMailToCompetitorDecline(competitor.email, reason);
    res
      .status(200)
      .json({
        message:
          "SE HA RECHAZADO Y SE LE HA HECHO SABER AL PARTICIPANTE LOS MOTIVOS DEL RECHAZO.",
      });
  } catch (error) {
    console.log(error);
  }
};

const sendMailToCompetitorAccept = async (email, sede) => {
  try {
    // <a href="${urlReset}">${urlReset}</a>

    const htmlContentUser = `
                  <div>                    
                      <h3 style="font-family: sans-serif; margin: 15px 15px;">SANTANA SUENA</h3>
                      <h4 style="font-family: sans-serif; margin: 15px 15px;">Su inscripción fue aceptada</h4>
                  
                                  
                      <div style=" max-width: 550px; height: 100px;">
                          <p style="padding: 10px 0px;">Ahora eres parte de el proceso de selección de 10 finalistas que estáran en la gran semifinal.
                        
                          </p>
                          <p style="padding: 10px 0px;">Quédate pendiente pronto te notificamos si fuiste seleccionado, no te detengas sigue preparando el show.</p>
                      </div>
                      <div style=" max-width: 550px; ">
                      <p style="padding: 10px 0px;">
                          www.santanasuena.com
                          Responsable:Dr. Martín Sandoval Gómez Director y Co-fundador del
                          Centro Comunitario y de Salud Tiopa Tlanextli “Santuario de Luz
                          A.C.”
                          Tel: 3173826632 Ext. 105 Autlán de Navarro, Jalisco, C.P. 48903.
                          tiopatlanextli@hotmail.com
                          NOTA IMPORTANTE: <b>TIOPA TLANEXTLI</b> es una Asociación Civil
                          sin fines de lucro, la intención en este concurso es meramente
                          de carácter cultural y en homenaje al benefactor y co-fundador
                          de esta institución. No contamos con los derechos para manejo de
                          la imagen, ni de la música de <b>CARLOS SANTANA</b>
                          Este programa es sin fines políticos, ni afiliación partidista
                          ni religiosa, es exclusivamente con fines culturales.
                      </p>
                      
                          
        
                  </div>
                  </div>`;

    await sendEmail.sendEmail(
      email,
      "Santana Suena",
      htmlContentUser,
      "Santana Suena inscripción aceptada"
    );
  } catch (error) {
    console.log(error);
  }
};
const sendMailToCompetitorDecline = async (email, reason) => {
  try {
    // <a href="${urlReset}">${urlReset}</a>
    const htmlContentUser = `
                    <div>                    
                        <h3 style="font-family: sans-serif; margin: 15px 15px;">SANTANA SUENA</h3>
                        <h4 style="font-family: sans-serif; margin: 15px 15px;">Su inscripción fue rechazada</h4>
                    
                                    
                        <div style=" max-width: 550px; height: 100px;">
                            <p style="padding: 10px 0px;">${reason}</p>
                        </div>
                        <div style=" max-width: 550px; height: 100px;">
                        <p style="padding: 10px 0px;">
                            www.santanasuena.com
                            Responsable:Dr. Martín Sandoval Gómez Director y Co-fundador del
                            Centro Comunitario y de Salud Tiopa Tlanextli “Santuario de Luz
                            A.C.”
                            Tel: 3173826632 Ext. 105 Autlán de Navarro, Jalisco, C.P. 48903.
                            tiopatlanextli@hotmail.com
                            NOTA IMPORTANTE: <b>TIOPA TLANEXTLI</b> es una Asociación Civil
                            sin fines de lucro, la intención en este concurso es meramente
                            de carácter cultural y en homenaje al benefactor y co-fundador
                            de esta institución. No contamos con los derechos para manejo de
                            la imagen, ni de la música de <b>CARLOS SANTANA</b>
                            Este programa es sin fines políticos, ni afiliación partidista
                            ni religiosa, es exclusivamente con fines culturales.
                        </p>
                        
                            
          
                    </div>
                    </div>`;

    await sendEmail.sendEmail(
      email,
      "Santana Suena",
      htmlContentUser,
      "Santana Suena rechazo de inscripción"
    );
  } catch (error) {
    console.log(error);
  }
};

ParticipanteCtrl.selectToFinalSedeLocal = async (req, res) => {
  try {
    const { id_competitor, text_to_competitor } = req;

    const competitor = await modelCompetitor.findByIdAndDelete(
      { _id: id_competitor },
      { status: "SELECCIONADO" }
    );
    res 
      .status(200)
      .json({
        message: "SE HA SELECCIONADO A ESTE PARTICPANTE COMO FINALISTA ",
      });
  } catch (error) {
    console.log(error);
  }
};
ParticipanteCtrl.sendMailTofinalists = async (email, text_to_competitor) => {
  try {
    // <a href="${urlReset}">${urlReset}</a>
    const htmlContentUser = `
                    <div>                    
                        <h3 style="font-family: sans-serif; margin: 15px 15px;">SANTANA SUENA</h3>
                        <h4 style="font-family: sans-serif; margin: 15px 15px;"></h4>
                    
                                    
                        <div style=" max-width: 550px; height: 100px;">
                            <p style="padding: 10px 0px;">${text_to_competitor}</p>
                        </div>
                        <div style=" max-width: 550px; height: 100px;">
                        <p style="padding: 10px 0px;">
                            www.santanasuena.com
                            Responsable:Dr. Martín Sandoval Gómez Director y Co-fundador del
                            Centro Comunitario y de Salud Tiopa Tlanextli “Santuario de Luz
                            A.C.”
                            Tel: 3173826632 Ext. 105 Autlán de Navarro, Jalisco, C.P. 48903.
                            tiopatlanextli@hotmail.com
                            NOTA IMPORTANTE: <b>TIOPA TLANEXTLI</b> es una Asociación Civil
                            sin fines de lucro, la intención en este concurso es meramente
                            de carácter cultural y en homenaje al benefactor y co-fundador
                            de esta institución. No contamos con los derechos para manejo de
                            la imagen, ni de la música de <b>CARLOS SANTANA</b>
                            Este programa es sin fines políticos, ni afiliación partidista
                            ni religiosa, es exclusivamente con fines culturales.
                        </p>
                    </div>
                    </div>`;

    await sendEmail.sendEmail(
      email,
      "Santana Suena",
      htmlContentUser,
      "Santana Suena rechazo de inscripción"
    );
    res.status(200).json({ message: "El correo se envió exitosamente." });
  } catch (error) {
    console.log(error);
  }
};

ParticipanteCtrl.deselectToFinalSedeLocal = async (req, res) => {
  try {
    const { id_competitor, text_to_competitor } = req;

    const competitor = await modelCompetitor.findByIdAndDelete(
      { _id: id_competitor },
      { status: "ACEPTADO" }
    );
    res
      .status(200)
      .json({ message: "EL PARTICIPANTE YA NO ES FINALISTA PARA SU SEDE " });
  } catch (error) {
    console.log(error);
  }
};

ParticipanteCtrl.selectToFinalAutlan = async (req, res) => {
  try {
    const { id_competitor, text_to_competitor } = req;

    const competitor = await modelCompetitor.findByIdAndDelete(
      { _id: id_competitor },
      { status: "ACEPTADO" }
    );
    res
      .status(200)
      .json({ message: "EL PARTICIPANTE YA NO ES FINALISTA PARA SU SEDE " });
  } catch (error) {
    console.log(error);
  }
};
ParticipanteCtrl.deselectToFinalAutlan = async (req, res) => {
  try {
    const { id_competitor, text_to_competitor } = req;

    const competitor = await modelCompetitor.findByIdAndDelete(
      { _id: id_competitor },
      { status: "ACEPTADO" }
    );
    res
      .status(200)
      .json({ message: "EL PARTICIPANTE YA NO ES FINALISTA PARA SU SEDE " });
  } catch (error) {
    console.log(error);
  }
};

module.exports = ParticipanteCtrl;
