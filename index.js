import { BaileysClass } from '@bot-wa/bot-wa-baileys';
import { G4F } from 'g4f';
import { handleIncomingMessage } from './textGen/chatManager.js';
import { handleImageCommand } from './imageGen/imageGenerator.js';
import path from 'path';
import { fileURLToPath } from 'url';
const g4f = new G4F();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const botBaileys = new BaileysClass({});
botBaileys.on('auth_failure', async (error) => console.log("ERROR BOT: ", error));
botBaileys.on('qr', (qr) => console.log("NEW QR CODE: ", qr));

botBaileys.on('ready', async () => console.log('BOT LISTO!!!'))

botBaileys.on('message', async (message) => {
    const isImageCommand = await handleImageCommand(message, botBaileys);
    if (!isImageCommand) {
        await handleIncomingMessage(message, g4f, botBaileys);
    }
});
