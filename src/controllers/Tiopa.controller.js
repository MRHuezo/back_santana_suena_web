const TiopaCtrl ={};
const fileAws = require("../middleware/awsFile");
const sendEmail = require("../middleware/sendEmail");
const nodemailer = require('nodemailer');

TiopaCtrl.getFiles = async (req, res) => {
    try {

      const files = await fileAws.obtenerArchivosEnCarpeta('FilesToGaleria');
      
      res.status(200).json({ files: files});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
};

TiopaCtrl.sendEmail = async (req, res) => {
    try {
        console.log(req.body);
        const htmlContentUser = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tiopa Web</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 50px auto;
                    background-color: #fff;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333;
                    text-align: center;
                }
                .contact-info {
                    margin-bottom: 20px;
                }
                .contact-info label {
                    font-weight: bold;
                }
                .contact-info p {
                    margin: 5px 0;
                }
                .contact-message {
                    margin-bottom: 20px;
                }
                .contact-message label {
                    font-weight: bold;
                }
                .contact-message p {
                    margin: 5px 0;
                }
            </style>
            </head>
            <body>
            <div class="container">
                <h1>Tiopa Web</h1>
                <div class="contact-info">
                    <p>${req.body.contactFirstName}</p>
                    <p>${req.body.contactLastName}</p>
                    <p>${req.body.contactEmail}</p>
                    <p>${req.body.contactSubject}</p>
                </div>
                <div class="contact-message">
                    <label>Mensaje:</label>
                    <p>${req.body.contactMessage}</p>
                </div>
            </div>
            </body>
            </html>
        `;
        

        await sendEmail.sendEmail(
            process.env.RECEPTOR_EMAIL,
            "Mensaje de página web",
            htmlContentUser,
            "Tiopa Tlanextli Web"
          ); 
      res.status(200).json({ message: "Correo enviado con éxito."});

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
};

module.exports = TiopaCtrl;