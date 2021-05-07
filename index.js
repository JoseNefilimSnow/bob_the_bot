//Imports E inicio de bot

require('dotenv/config');
const fs = require('fs-extra');
const TelegramBot = require('node-telegram-bot-api');
const Discord = require('discord.js');
const configTel = require("./Bob_brain/configTel.json");
const configDis = require("./Bob_brain/configDis.json");
const service = require("./service.js");
const bd = require('./bd');

// -------------------------------------------------------------------------------

const botTel = new TelegramBot(process.env.TOKEN_TELEGRAM, {
    polling: true
});
const botDis = new Discord.Client();

botDis.login(process.env.TOKEN_DISCORD);

// -------------------------------------------------------------------------------

//Ininiamos el bot en Discord

// botDis.on("ready", () => {
//     //Cuando se inicia, el bot imprimira lo siguiente:
//     console.log(`BobLite Esta Dentro`);
//     // Ahora añadimos un estado por los memes al bot:
//     botDis.user.setActivity("¡ '.help' para ayuda!");
//     //Comprobación de cumples cada vez que se inicia el bot


// });

//Iniciamos el bot en Telegram

botTel.on("ready", () => {
    //Cuando se inicia, el bot imprimira lo siguiente:
    console.log(`BobLite Esta Dentro`);

});

/**
 * BobLite se encargara de las funcionalidades basicas de bob hasta inplementar las anteriores de forma enteriza pero con un codigo
 * actualizado
*/

//---------------------------------------------- Telegram
botTel.on("polling_error", console.log);
botTel.on("message",async message=>{
    console.log("a")
    if (message.text != undefined) {
        if (message.text.indexOf(configTel.prefix) !== 0) return;

        const args = message.text.slice(configTel.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();


        switch (command) {

            case "start":

                botTel.sendMessage(message.chat.id, "¡Hola! He llegado a Telegram");
                break;

            case "help":
                const opcionesAyuda = args.join(" ");
                switch (opcionesAyuda) {
                    default:
                        botTel.sendMessage(message.chat.id, "Mis comandos son: \n crearcumples \n vercumples \n Puedes saber mas de cada uno usando 'help' + comando");
                        break;
                    
                    case "crearcumple":
                        botTel.sendMessage(message.chat.id, "Puedes crear una entrada en la lista de cumpleaños usando el comando + ' nombre fecha(dd/mm)' ");
                        break;

                    case "vercumple":
                        botTel.sendMessage(message.chat.id, "Este comando muestra una lista de todos los cumpleaños o devuelve uno en concreto añadiendo el nombre tras el comando");
                        break;
                }
                break;

            // case "crear"
        }
    }

})