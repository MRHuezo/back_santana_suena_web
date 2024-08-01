require('dotenv').config();
const { app, server, io } = require('./app');
require('./database');
const { initializeWhatsApp } = require('./middleware/whatsapp');

async function main() {
    try {
        await server.listen(app.get('port')); 
        console.log('Server on port ', app.get('port'));
    } catch (error) {
        console.log(error);
    }
}

main();

// Inicializar WhatsApp cuando el servidor se levante
initializeWhatsApp(io);
