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
setInterval(() => {
    checkBday();
}, 3600000)

botTel.on("ready", () => {
    //Cuando se inicia, el bot imprimira lo siguiente:
    console.log(`BobLite Esta Dentro`);


});

/**
 * BobLite se encargara de las funcionalidades basicas de bob hasta inplementar las anteriores de forma enteriza pero con un codigo
 * actualizado
 */

//---------------------------------------------- Telegram--------------------------------------------
botTel.on("message", async message => {
    console.log(message.chat.id)
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
                        botTel.sendMessage(message.chat.id, "Puedes crear una entrada en la lista de cumpleaños usando el comando + '| nombre | fecha(dd/mm)' ");
                        break;

                    case "vercumple":
                        botTel.sendMessage(message.chat.id, "Este comando muestra una lista de todos los cumpleaños o devuelve uno en concreto añadiendo el nombre tras el comando");
                        break;
                }
                break;

            case "crearcumple":
                if (args) {

                    let nombre = args[0];
                    let fecha = args[1];
                    if (args.length !== 2 || fecha.length > 5 || !nombre || !fecha) {
                        botTel.sendMessage(message.chat.id, "Comando incorrecto, el formato correcto es :" + "\n" + "/crearcumple nombre fecha(dd/mm)");
                        break;
                    }

                    bd.insertar("cumples", {
                        nombre,
                        fecha
                    }).finally(done => {
                        botTel.sendMessage(message.chat.id, "¡Cumple guardado exitosamente!");
                        bd.buscar("cumples", {
                            nombre
                        }, "nombre").then(data => {
                            botTel.sendMessage(message.chat.id, "Guardado: " + data.resultado[0].nombre + " || " + data.resultado[0].fecha);

                        })
                    })

                } else {
                    botTel.sendMessage(message.chat.id, "Comando incorrecto, el formato correcto es :" + "\n" + "/crearcumple nombre fecha(dd/mm)");
                    break;
                }
                break;

            case "vercumple":
                try {
                    let resQuerry = await bd.buscar("cumples");
                    let listaCumples = ""
                    resQuerry.resultado.forEach(cumple => {
                        listaCumples += "Cumple obtenido: " + cumple.nombre + " || " + cumple.fecha + "\n"
                    });
                    botTel.sendMessage(message.chat.id, "Lista de cumples :" + "\n" + listaCumples);
                    break;
                } catch (error) {
                    botTel.sendMessage(message.chat.id, "Ha habido un error obteniendo la lista");
                }
                break;
        }
    }
})

// --------- Funcionalidad ------------------

function checkBday() {
    console.log("Checkeo cumples");
    bd.buscar("cumples").then(listaCumples => {
        console.log("Checkeo cumples :^] ");
        if (listaCumples.resultado) {
            listaCumples.resultado.forEach(cumple => {
                let dia = cumple.fecha.substring(0, 2);
                let mes = cumple.fecha.substring(3, 5);
                let hoy = new Date();
                if (dia == hoy.getDate() && mes == hoy.getMonth() + 1 && 6 == hoy.getHours()) {
                    botTel.sendMessage("-1001268069702", "Feliz Cumpleaños  ...  " + cumple.nombre.toUpperCase());
                }
            })
        } else {
            console.log(listaCumples.resultado)
        }
    })
}