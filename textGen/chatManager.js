import fs from 'fs';
import path from 'path';

const chatsFilePath = path.resolve('chats.json');
let messagesByNumber = {};

// Leer el archivo chats.json al iniciar
if (fs.existsSync(chatsFilePath)) {
    try {
        const rawData = fs.readFileSync(chatsFilePath, 'utf8');
        if (rawData.trim()) {
            messagesByNumber = JSON.parse(rawData);
        }
    } catch (error) {
        console.error("Error parsing JSON file: ", error);
        messagesByNumber = {};
    }
} else {
    fs.writeFileSync(chatsFilePath, JSON.stringify({}));
}

// Función para guardar mensajes en chats.json
const saveChatsToFile = () => {
    fs.writeFileSync(chatsFilePath, JSON.stringify(messagesByNumber, null, 2));
};

// Función para limpiar chats viejos
const cleanOldChats = () => {
    const now = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    Object.keys(messagesByNumber).forEach(number => {
        messagesByNumber[number] = messagesByNumber[number].filter(
            msg => (now - new Date(msg.timestamp).getTime()) < oneDayInMs
        );

        if (messagesByNumber[number].length === 0) {
            delete messagesByNumber[number];
        }
    });

    saveChatsToFile();
};

// Función para eliminar conversación
const deleteConversation = (number) => {
    if (messagesByNumber[number]) {
        delete messagesByNumber[number];
        saveChatsToFile();
    }
};

// Función para manejar los mensajes
export const handleIncomingMessage = async (message, g4f, botBaileys) => {
    try {
        const number = message.from;
        const messageContent = message.body.trim();

        // Verificar si el mensaje incluye el comando /delete
        if (messageContent.toLowerCase() === '/delete') {
            deleteConversation(number);
            const imagesFolder = path.resolve('images');
fs.readdir(imagesFolder, (err, files) => {
    if (err) {
        console.error("Error reading images folder: ", err);
        return;
    }

    files.forEach(file => {
        fs.unlink(path.resolve(imagesFolder, file), (err) => {
            if (err) {
                console.error("Error deleting image: ", err);
            } else {
                console.log(`Image ${file} deleted.`);
            }
        });
    });
});
            await botBaileys.sendText(number, "Your conversation has been deleted.");
            console.log(`Conversation with ${number} has been deleted.`);
            return;
        }

        if (!messagesByNumber[number]) {
            messagesByNumber[number] = [{ role: "system", content: "You're a math teacher.", timestamp: new Date().toISOString() }];
        }

        const userMessage = { role: "user", content: message.body, timestamp: new Date().toISOString() };
        messagesByNumber[number].push(userMessage);

        const response = await g4f.chatCompletion(messagesByNumber[number]);

        await botBaileys.sendText(number, response);

        const botMessage = { role: "assistant", content: response, timestamp: new Date().toISOString() };
        messagesByNumber[number].push(botMessage);

        cleanOldChats();

        console.log(messagesByNumber[number]);
    } catch (error) {
        console.log("ERROR HANDLING MESSAGE: ", error);
    }
};
