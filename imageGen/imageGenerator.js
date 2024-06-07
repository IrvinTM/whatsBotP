import { G4F } from 'g4f';
import fs from 'fs';
import path from 'path';

// Función para generar imagen con el modelo Epic Realism
export const getEpicRealism = async (imagePrompt) => {
    const g4f = new G4F();
    try {
        const base64Image = await g4f.imageGeneration(imagePrompt, {
            debug: true,
            provider: g4f.providers.ProdiaStableDiffusion,
            providerOptions: {
                model: "epicrealism_naturalSinRC1VAE.safetensors [90a4c676]",
                samplingSteps: 20,
                cfgScale: 30,
                height: 1024,
                width: 576,
            },
        });

        if (base64Image) {
            const image = Buffer.from(base64Image, "base64");
            console.log("Image generated successfully with Epic Realism model.");
            return image;
        }
    } catch (error) {
        console.error("Error generating image with Epic Realism model:", error);
    }
};

export const getAnime = async (imagePrompt) => {
    const g4f = new G4F();
    try {
        const base64Image = await g4f.imageGeneration(imagePrompt, {
            debug: true,
            provider: g4f.providers.ProdiaStableDiffusion,
            providerOptions: {
                model: "dreamlike-anime-1.0.safetensors [4520e090]",
                samplingSteps: 20,
                cfgScale: 30,
                height: 1024,
                width: 576,
            },
        });

        if (base64Image) {
            const image = Buffer.from(base64Image, "base64");
            console.log("Image generated successfully with revAnimated model.");
            return image;
        }
    } catch (error) {
        console.error("Error generating image with revAnimated model:", error);
    }
};

// Función para generar imagen con el modelo Absolute Reality
export const getAbsoluteReality = async (imagePrompt) => {
    const g4f = new G4F();
    try {
        const base64Image = await g4f.imageGeneration(imagePrompt, {
            debug: true,
            provider: g4f.providers.ProdiaStableDiffusion,
            providerOptions: {
                model: "absolutereality_v181.safetensors [3d9d4d2b]",
                samplingSteps: 20,
                cfgScale: 30,
                height: 1024,
                width: 576,
            },
        });

        if (base64Image) {
            const image = Buffer.from(base64Image, "base64");
            console.log("Image generated successfully with Absolute Reality model.");
            return image;
        }
    } catch (error) {
        console.error("Error generating image with Absolute Reality model:", error);
    }
};

// Función para manejar los comandos de imagen
export const handleImageCommand = async (message, botBaileys) => {
    try {
        const number = message.from;
        const messageContent = message.body.trim();

        // Verificar si el mensaje incluye el comando /absoluteReality
        if (messageContent.toLowerCase().startsWith('/absolutereality')) {
            const prompt = messageContent.slice('/absolutereality'.length).trim();
            const image = await getAbsoluteReality(prompt);
            if (image) {
                const imagePath = path.resolve(`images/absoluteReality_${Date.now()}.jpg`);
                fs.writeFileSync(imagePath, image);
                await botBaileys.sendMedia(number, imagePath, 'Here is your Absolute Reality image');
                console.log(`Absolute Reality image sent to ${number} with prompt: ${prompt}`);
            }
            return true; // Indica que se manejó un comando de imagen
        }
        // Verificar si el mensaje incluye el comando /animated
        if (messageContent.toLowerCase().startsWith('/animated')) {
            const prompt = messageContent.slice('/animated'.length).trim();
            const image = await getAnime(prompt);
            if (image) {
                const imagePath = path.resolve(`images/animated_${Date.now()}.jpg`);
                fs.writeFileSync(imagePath, image);
                await botBaileys.sendMedia(number, imagePath, 'Here is your animated model image');
                console.log(`Animated  image sent to ${number} with prompt: ${prompt}`);
                
            }
            return true; // Indica que se manejó un comando de imagen
        }

        // Verificar si el mensaje incluye el comando /epicRealism
        if (messageContent.toLowerCase().startsWith('/epicrealism')) {
            const prompt = messageContent.slice('/epicrealism'.length).trim();
            const image = await getEpicRealism(prompt);
            if (image) {
                const imagePath = path.resolve(`images/epicRealism_${Date.now()}.jpg`);
                fs.writeFileSync(imagePath, image);
                await botBaileys.sendMedia(number, imagePath, 'Here is your Epic Realism image');
                console.log(`Epic Realism image sent to ${number} with prompt: ${prompt}`);
                
            }
            return true; // Indica que se manejó un comando de imagen
        }

        return false; // No se manejó un comando de imagen
    } catch (error) {
        console.log("ERROR HANDLING IMAGE COMMAND: ", error);
        return false; // En caso de error, indica que no se manejó un comando de imagen
    }
};
