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
// Ensure the images directory exists
const ensureDirectoryExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};

// Function to handle image commands
export const handleImageCommand = async (message, botBaileys) => {
    try {
        const number = message.from;
        const messageContent = message.body.trim();
        const imagesDirectory = path.resolve('images');
        
        // Ensure the images directory exists
        ensureDirectoryExists(imagesDirectory);

        // Verify if the message includes the command /absoluteReality
        if (messageContent.toLowerCase().startsWith('/absolutereality')) {
            const prompt = messageContent.slice('/absolutereality'.length).trim();
            const image = await getAbsoluteReality(prompt);
            if (image) {
                const imagePath = path.join(imagesDirectory, `absoluteReality_${Date.now()}.jpg`);
                fs.writeFileSync(imagePath, image);
                await botBaileys.sendMedia(number, imagePath, 'Here is your Absolute Reality image');
                console.log(`Absolute Reality image sent to ${number} with prompt: ${prompt}`);
            }
            return true; // Indicates that an image command was handled
        }

        // Verify if the message includes the command /animated
        if (messageContent.toLowerCase().startsWith('/animated')) {
            const prompt = messageContent.slice('/animated'.length).trim();
            const image = await getAnime(prompt);
            if (image) {
                const imagePath = path.join(imagesDirectory, `animated_${Date.now()}.jpg`);
                fs.writeFileSync(imagePath, image);
                await botBaileys.sendMedia(number, imagePath, 'Here is your animated model image');
                console.log(`Animated image sent to ${number} with prompt: ${prompt}`);
            }
            return true; // Indicates that an image command was handled
        }

        // Verify if the message includes the command /epicRealism
        if (messageContent.toLowerCase().startsWith('/epicrealism')) {
            const prompt = messageContent.slice('/epicrealism'.length).trim();
            const image = await getEpicRealism(prompt);
            if (image) {
                const imagePath = path.join(imagesDirectory, `epicRealism_${Date.now()}.jpg`);
                fs.writeFileSync(imagePath, image);
                await botBaileys.sendMedia(number, imagePath, 'Here is your Epic Realism image');
                console.log(`Epic Realism image sent to ${number} with prompt: ${prompt}`);
            }
            return true; // Indicates that an image command was handled
        } else {
            return false; // No image command was handled
        }
    } catch (error) {
        console.log("ERROR HANDLING IMAGE COMMAND: ", error);
        return false; // In case of error, indicate that no image command was handled
    }
};