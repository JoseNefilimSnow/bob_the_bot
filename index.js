//Imports E inicio de bots
require('dotenv/config');
const fs = require('fs-extra');
const TelegramBot = require('node-telegram-bot-api');
const Discord = require('discord.js');

const configTel = require("./Bob_brain/configTel.json");
const configDis = require("./Bob_brain/configDis.json");
const service = require("./service.js");

const botTel = new TelegramBot(process.env.TOKEN_TELEGRAM, {
    polling: true
});
const botDis = new Discord.Client();

botDis.login(process.env.TOKEN_DISCORD);

// -------------------------------------------------------------------------------

console.log('Iniciando...');

//Ininiamos el bot en Discord

botDis.on("ready", () => {
    //Cuando se inicia, el bot imprimira lo siguiente:
    console.log(`Bob Esta Dentro`);
    // Ahora añadimos un estado por los memes al bot:
    botDis.user.setActivity("¡ '.help' para ayuda!");
});

//Iniciamos el bot en Telegram

botTel.on("ready", () => {
    //Cuando se inicia, el bot imprimira lo siguiente:
    console.log(`Bob Esta Dentro`);
});


//-----------------------------------------------------Discord-------------------------------------------------------------------------------
botDis.on("message", async message => {
    var adjunto = ""
    if ("attachments" in message) {
        if (message.attachments.first() === undefined) {
            adjunto = "";
        } else {
            adjunto = message.attachments.first().url;
        }
    }
    var msg = message.content;
    var usuario = service.revuser(message.author.id);
    var chat = message.channel.id;
    //Esto es lo que hace que funcione la magia de Telegram - Discord
    toTelegram(msg, usuario, chat, adjunto);
});

botDis.on("message", async message => {
    //no queremos que el bot se responda a si mismo... ¿o si?
    if (message.author.bot) return;
    // si no pones el prefijo al principio no se juega!
    if (message.content.indexOf(configDis.prefix) !== 0) return;

    // separamos los ...
    const args = message.content.slice(configDis.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch (command) {
        case "help":
            const opcionesAyuda = args.join(" ");
            switch (opcionesAyuda) {
                default:
                    message.channel.send("```Mis comandos son: \n crear \n ver \n cuantoquedapara \n d (tirar dados) \n limpia \n recordatorio \n tel \n sound \n Puedes saber mas de cada uno usando 'help' + comando```");
                    break;

                case "crear":
                    message.channel.send("crear (categoria:'cumple' o 'evento') (nombre de persona o evento) (fecha en dd/mm/aaaa)");
                    break;
                case "see":
                    message.channel.send("ver (categoria:cumples,eventos,todo)");
                    break;
                case "cuantoquedapara":
                    message.channel.send("cuantoquedapara + 'nombre de cuenta atras': te muestro los dias que quedan para llegar a esa fecha");
                    break;
                case "d":
                    message.channel.send("d + 'numeroDeDados'd'nºdecaras': te lanzo el numero de dados que quieras con las caras que decidas");
                    break;
                case "limpia":
                    message.channel.send("limpia + numero de mensajes que quieres borrar + veces que se repite : borra hasta 99 mensajes del chat actual... no puedo borrar mas de 100 pero puedo hacer una trampa fea que Jose conoce");
                    break;
                case "recordatorio":
                    message.channel.send("recordatorio: realiza una serie de acciones con el fin de construir un recordatorio para alguien o todos, para mas informacion usa el comando '.recordatorio'");
                    break;
                case "sound":
                    // message.channel.send("sound + 'ara|araleo|cute|epic': reproduce en el canal un clip de sonido");
                    message.channel.send("```DESHABILITADO```");
                    break;

            }
            break;

        case "limpia":
            message.delete();
            let fetched = await message.channel.fetchMessages({
                limit: 50
            });
            message.channel.bulkDelete(fetched);
            message.channel.send("He barrido, aspirado y quitado el polvo de esto que llamais sala de chat");
            break;

        case "crear":
            const setFecha = args.join(" ").split(" ");
            if (setFecha.length > 3) {

                message.channel.send("Algo aquí no va bien... prueba a no dejar espacios en el nombre de la cuenta atras :grin:");
                return;

            } else {

                let fechadecdaux = '"' + setFecha[2] + '"';
                let cat = '"' + setFecha[0] + '"';
                let json_cd = '{"codw":' + fechadecdaux + ',"categoria":' + cat.toLowerCase() + '}';

                if (cat === '"cumple"') {

                    fs.writeJSON("./Bob_brain/countdowns/cumples/Cumple_" + setFecha[1] + ".json", JSON.parse(json_cd), function (err, result) {
                        if (err) console.log('error', err);
                        if (result) {}
                        message.channel.send("¡He creado la cuenta atras!");
                    });

                } else if (cat === '"evento"') {

                    fs.writeJSON("./Bob_brain/countdowns/eventos/Evento_" + setFecha[1] + ".json", JSON.parse(json_cd), function (err, result) {
                        if (err) console.log('error', err);
                        if (result) {}
                    });
                    message.channel.send("¡He creado la cuenta atras!");

                } else {

                    await message.channel.send("Creo que no entiendo esa categoría :surprised: Te recuerdo que el formato es: .crear (categoria:'cumple' o 'evento') (nombre de persona o evento) (fecha en dd/mm/aaaa)");

                }

            }
            break;

        case "ver":

            var subver = args.join(" ").toLowerCase();

            switch (subver) {

                case "cumples":
                    var cant = 0;
                    var filescump = fs.readdirSync('./Bob_brain/countdowns/cumples');
                    message.channel.send("Dejame mirar por aquí...");

                    for (let item of filescump) {
                        let auxjson = require("./Bob_brain/countdowns/cumples/" + item);
                        if (auxjson.categoria === "cumple") {
                            cant++;
                            var m = await message.channel.send("El evento de categoria cumpleaños con titulo: " + item.substring(0, item.length - 5) + "\n Es el día: " + auxjson.codw);
                        }
                    }
                    if (cant == 0) {
                        message.channel.send("No he encontrado nada :confused:");

                    } else {
                        message.channel.send("...y estas son mis " + cant + " coincidencias");
                    }
                    break;

                case "eventos":
                    var cant = 0;
                    var filesev = fs.readdirSync('./Bob_brain/countdowns/eventos');
                    message.channel.send("Dejame mirar por aquí...");

                    for (let item of filesev) {
                        let auxjson = require("./Bob_brain/countdowns/eventos/" + item);
                        if (auxjson.categoria === "evento") {
                            cant++;
                            var m = await message.channel.send("El evento con titulo: " + item.substring(0, item.length - 5) + "\n Es el día: " + auxjson.codw);
                        }
                    }
                    if (cant == 0) {
                        message.channel.send("No he encontrado nada :confused:");

                    } else {
                        message.channel.send("...y estas son mis " + cant + " coincidencias");
                    }
                    break;

                case "todo":
                    message.channel.send("Eventos Planeados:");

                    var files = fs.readdirSync('./Bob_brain/countdowns/eventos/');
                    cant = 0;
                    for (let item of files) {
                        let auxjson = require("./Bob_brain/countdowns/eventos/" + item);
                        if (auxjson.categoria === "evento") {
                            cant++;
                            var m = await message.channel.send("El evento de categoria evento con titulo: " + item.substring(0, item.length - 5) + "\n Es el día: " + auxjson.codw);
                        }
                    }
                    if (cant == 0) {
                        message.channel.send("No he encontrado eventos :confused:");
                    }
                    var cant2 = 0;
                    var filescump = fs.readdirSync('./Bob_brain/countdowns/cumples');

                    message.channel.send("Cumpleaños Guardados:");
                    for (let item of filescump) {
                        let auxjson = require("./Bob_brain/countdowns/cumples/" + item);
                        if (auxjson.categoria === "cumple") {
                            cant2++;
                            var m = await message.channel.send("El evento de categoria cumpleaños con titulo: " + item.substring(0, item.length - 5) + "\n Es el día: " + auxjson.codw);
                        }
                    }
                    if (cant2 == 0) {
                        message.channel.send("No he encontrado cumpleaños :confused:");

                    }
                    break;

                default:
                    message.channel.send("No he encontrado nada bajo la categoria: " + subver + " ¡Prueba con cumples, eventos o todo!");

            }
            break;

        case "cuantoquedapara":
            var cuentaAtras = args.join(" ").split(" ");

            var today = new Date();

            switch (cuentaAtras[0].toLowerCase()) {
                case "cumple":
                    if (cuentaAtras[1] === "") {
                        message.channel.send("No puedes dejarme sin saber de quien es el cumple :sad:");
                        var cant = 0;
                        var files = fs.readdirSync('./Bob_brain/countdowns/cumples');

                        message.channel.send("Estos son los posibles");
                        for (let item of files) {
                            let auxjson = require("./Bob_brain/countdowns/cumples/" + item);
                            if (auxjson.categoria === "cumple") {
                                cant++;
                                var m = await message.channel.send(item.substring(7, item.length - 5));
                            }
                        }
                        if (cant == 0) {
                            message.channel.send("...No he encontrado nada :confused:");

                        }
                        break;
                    }
                    let nombre = cuentaAtras[1].substring(0, 1).toUpperCase() + cuentaAtras[1].substring(1, cuentaAtras[1].length).toLowerCase();
                    let jsoncumple = require("./Bob_brain/countdowns/cumples/Cumple_" + nombre + ".json");

                    message.channel.send("Dejame calcular...");
                    var cadate = service.refactorDate(jsoncumple.codw);

                    var m = await message.channel.send("Quedan" + " " + service.diasPara(today, cadate) + " " + "dias");
                    if (service.diasPara(today, cadate) < 0) {
                        var m = await message.channel.send("Creo que esta fecha ya ha pasado...");
                    } else if (service.diasPara(today, cadate) == 0) {
                        var m = await message.channel.send("ES HOY :smiling_imp:");
                    }
                    break;

                case "evento":
                    if (cuentaAtras[1] === "") {
                        message.channel.send("No puedes dejarme sin saber de que evento me hablas :sad:");
                        var cant = 0;
                        var files = fs.readdirSync('./Bob_brain/countdowns/eventos');

                        message.channel.send("Estos son los posibles");
                        for (let item of files) {
                            let auxjson = require("./Bob_brain/countdowns/eventos/" + item);
                            if (auxjson.categoria === "cumple") {
                                cant++;
                                var m = await message.channel.send(item.substring(7, item.length - 5));
                            }
                        }
                        if (cant == 0) {
                            message.channel.send("...No he encontrado nada :confused:");

                        }
                        break;
                    }
                    let nombreev = cuentaAtras[1].substring(0, 1).toUpperCase() + cuentaAtras[1].substring(1, cuentaAtras[1].length).toLowerCase();
                    let jsonevento = require("./Bob_brain/countdowns/eventos/Evento_" + nombreev + ".json");

                    message.channel.send("Dejame calcular...");
                    var cadate = service.refactorDate(jsonevento.codw);

                    var m = await message.channel.send("Quedan" + " " + service.diasPara(today, cadate) + " " + "dias");
                    if (service.diasPara(today, cadate) < 0) {
                        var m = await message.channel.send("Creo que esta fecha ya ha pasado...");
                    } else if (service.diasPara(today, cadate) == 0) {
                        var m = await message.channel.send("ES HOY :smiling_imp:");
                    }
                    break;

                default:
                    message.channel.send("No he encontrado nada bajo la categoria: " + cuentaAtras[0] + " Quizas quieras ver evento... o cumple");
                    break;

            }
            break;

        case "d":

            const opcionesDado = args.join(" ");
            let numDados = "";
            let count = 0;

            while (opcionesDado.charAt(count) != 'd') {
                numDados += opcionesDado.charAt(count);
                count++;
            }

            let carasDado = opcionesDado.substring(count + 1, opcionesDado.length);

            if (Number(numDados) && Number(carasDado)) {
                let numeroDados = numDados;
                let contadorDeDado = 0
                while (numeroDados != 0) {
                    contadorDeDado += 1;
                    let max = Number(carasDado) + 1;
                    let random = Math.floor(Math.random() * (max - 1)) + 1;
                    message.channel.send("Te ha salido un: " + random + " en el dado número " + contadorDeDado + " de " + carasDado + " caras :game_die:");
                    numeroDados--;
                }
            } else {
                message.channel.send("Eso no es un número válido de caras de un dado pillín :imp::smiling_imp:");
            }
            break;

        case "recordatorio":
            var subcomando = args.join(" ").toLowerCase().split(" ");
            switch (subcomando[0]) {

                default:
                    message.channel.send("Comandos:\n ver: Mira las alarmas que hay\n \n crear + 'nombre recordatorio' +  'nombre' + 'hora' +'recordatorio'  : crea una recordatorio para alguien  \n ");
                    break;

                case "crear":
                    if (subcomando.length < 5) {
                        message.channel.send("Algo aquí no va bien... ¡te falta algo!");
                        return
                    } else {

                        let recordatorio = '"' + subcomando[1] + '"';
                        let auxP = service.user(subcomando[2]);
                        let persona = '"' + auxP + '"';
                        let hora = subcomando[3];
                        let msg = "";
                        let indice = 4;
                        while (subcomando[indice] != null) {
                            msg = msg + "_" + subcomando[indice] + "_";
                            indice++;
                        }
                        let json_r = '{"recordatorio":' + recordatorio + ',"persona":' + "" + persona + ',' +
                            '"msg":' + '"' + msg + '"' + ',"hora": "' + hora + '"' + ',"estado": "' + "activo" + '"' +
                            '}';
                        fs.writeJSON("./Bob_brain/recordatorios/" + subcomando[1] + ".json", JSON.parse(json_r), function (err, result) {
                            if (err) console.log('error', err);
                            if (result) {

                            }
                        });
                        message.channel.send("He creado el recordatorio");
                    }
                    break;
                case "ver":
                    var files = fs.readdirSync('./Bob_brain/recordatorios/');
                    cant = 0;
                    message.channel.send("Dejame mirar por aquí...");

                    if (subcomando[1] == null) {
                        for (let item of files) {
                            let auxjson = require("./Bob_brain/recordatorios/" + item);
                            cant++;
                            let msg = "";
                            for (let i = 0; i < auxjson.msg.length; i++) {
                                if (auxjson.msg.charAt(i) == '_') {
                                    msg = msg + " ";
                                } else {
                                    msg = msg + auxjson.msg.charAt(i);
                                }
                            }
                            if (auxjson.estado !== "innactivo") {
                                var m = await message.channel.send("Tengo un recodatorio para " + "<@" + auxjson.persona + ">" + "\n Con el mensaje: " + msg + "\n y se repite a las " + auxjson.hora);
                            }
                        }
                        if (cant == 0) {
                            message.channel.send("No he encontrado nada :confused:");

                        } else {
                            message.channel.send("...y estas son mis " + cant + " coincidencias");
                        }
                    } else {

                        if (service.user(subcomando[1]) === "nadie") {

                            message.channel.send("No existe esa persona...");

                        } else {
                            message.channel.send("Los mensajes para <@" + service.user(subcomando[1]) + ">");

                            for (let item of files) {
                                let auxjson = require("./Bob_brain/recordatorios/" + item);
                                cant++;
                                let msg = "";
                                for (let i = 0; i < auxjson.msg.length; i++) {
                                    if (auxjson.msg.charAt(i) == '_') {
                                        msg = msg + " ";
                                    } else {
                                        msg = msg + auxjson.msg.charAt(i);
                                    }
                                }
                                if ('"' + service.user(subcomando[1]) + '"' === auxjson.persona && auxjson.estado !== "innacctivo") {
                                    var m = await message.channel.send(msg + "\n y se repite a las " + auxjson.hora);
                                }
                            }
                            if (cant == 0) {
                                message.channel.send("No he encontrado nada :confused:");

                            }
                        }
                    }
                    break;

                case "cerrar":
                    var files = fs.readdirSync('./Bob_brain/recordatorios/');
                    message.channel.send("¿Cual quieres cerrar? Usa .recordatorio cerrar + nombre del recordatorio tal y como se presenta");
                    if (subcomando[1] != null) {
                        let auxjson = require("./Bob_brain/recordatorios/" + subcomando[1] + ".json");
                        if (auxjson == null) {
                            message.channel.send("No existe el recordatorio");
                        } else {
                            auxjson.estado = "innactivo";
                            fs.writeJSON("./Bob_brain/recordatorios/" + subcomando[1] + ".json", auxjson, function (err, result) {
                                if (err) console.log('error', err);
                                if (result) {

                                }
                            });
                            message.channel.send("He deshabilitado el recordatorio");
                        }
                        break;
                    }
                    for (let item of files) {
                        let auxjson = require("./Bob_brain/recordatorios/" + item);
                        let msg = "";
                        for (let i = 0; i < auxjson.msg.length; i++) {
                            if (auxjson.msg.charAt(i) == '_') {
                                msg = msg + " ";
                            } else {
                                msg = msg + auxjson.msg.charAt(i);
                            }
                        }
                        if (auxjson.estado !== "innactivo") {
                            var m = await message.channel.send("RECORDATORIO: " + item.substring(0, item.length - 5) + " ; MENSAJE:" + msg);
                        }

                    }
                    break;
            }
            break;

        case "sound":
            var m = await message.channel.send("``` Actualmente se encuentra deshabilitado ```");

            // var subcomando = args.join(" ").toLowerCase().split(" ");

            // if (subcomando.length == 1) {
            //     switch (subcomando[0]) {

            //         default:
            //             message.channel.send("Los sonidos son: ara, araleo, epic y cute (ej .sound ara)");
            //             break;

            //         case "ara":
            //             var voiceChannel = message.member.voiceChannel;
            //             nombre = message.member.id;
            //             if (voiceChannel == undefined) {
            //                 message.channel.send("<@" + nombre + ">: " + "No puedo saber donde estas pendejo");
            //             } else {
            //                 voiceChannel.join().then(connection => {
            //                     const dispatcher = connection.playFile('./Bob_brain/sound/ara.mp3');
            //                     dispatcher.setVolume(10);
            //                     dispatcher.on("end", end => {
            //                         voiceChannel.leave();
            //                     });
            //                 }).catch(err => {
            //                     console.log(err)
            //                 })
            //             }
            //             break;

            //         case "epic":
            //             var voiceChannel = message.member.voiceChannel;
            //             nombre = message.member.id;
            //             if (voiceChannel == undefined) {
            //                 message.channel.send("<@" + nombre + ">: " + "No puedo saber donde estas pendejo");
            //             } else {
            //                 voiceChannel.join().then(connection => {
            //                     const dispatcher = connection.playFile('./Bob_brain/sound/gio.mp3');
            //                     dispatcher.setVolume(0.5);
            //                     dispatcher.on("end", end => {
            //                         voiceChannel.leave();
            //                     });
            //                 }).catch(err => {
            //                     console.log(err)
            //                 })
            //             }
            //             break;
            //         case "voy":
            //             var voiceChannel = message.member.voiceChannel;
            //             nombre = message.member.id;
            //             if (voiceChannel == undefined) {
            //                 message.channel.send("<@" + nombre + ">: " + "No puedo saber donde estas pendejo");
            //             } else {
            //                 voiceChannel.join().then(connection => {
            //                     const dispatcher = connection.playFile('./Bob_brain/sound/pipo.mp3');
            //                     dispatcher.setVolume(15);
            //                     dispatcher.on("end", end => {
            //                         voiceChannel.leave();
            //                     });
            //                 }).catch(err => {
            //                     console.log(err)
            //                 })
            //             }
            //             break;
            //         case "araleo":
            //             var voiceChannel = message.member.voiceChannel;
            //             nombre = message.member.id;
            //             if (voiceChannel == undefined) {
            //                 message.channel.send("<@" + nombre + ">: " + "No puedo saber donde estas pendejo");
            //             } else {
            //                 voiceChannel.join().then(connection => {
            //                     const dispatcher = connection.playFile('./Bob_brain/sound/araleo.wav');
            //                     dispatcher.setVolume(10);
            //                     dispatcher.on("end", end => {
            //                         voiceChannel.leave();
            //                     });
            //                 }).catch(err => {
            //                     console.log(err)
            //                 })
            //             }
            //             break;

            //         case "cute":
            //             var voiceChannel = message.member.voiceChannel;
            //             nombre = message.member.id;
            //             if (voiceChannel == undefined) {
            //                 message.channel.send("<@" + nombre + ">: " + "No puedo saber donde estas pendejo");
            //             } else {
            //                 voiceChannel.join().then(connection => {
            //                     const dispatcher = connection.playFile('./Bob_brain/sound/pudi.mp3');
            //                     dispatcher.setVolume(0.7);
            //                     dispatcher.on("end", end => {
            //                         voiceChannel.leave();
            //                     });
            //                 }).catch(err => {
            //                     console.log(err)
            //                 })
            //             }
            //             break;
            //     }
            // } else {
            //     message.channel.send("<@" + nombre + ">: " + "No es el formato correcto");
            // }
            break;

    }
});

//----------------------------------------------------Telegram-------------------------------------------------------------------------------
botTel.on("message", async message => {
    var msg = message.text;
    var usuario = message.from.first_name;
    var audio = false;
    if ("photo" in message) {
        var fileId = message.photo[1].file_id;
    }
    if ("animation" in message) {
        var fileId = message.animation.file_id;
    }
    if ("document" in message && ("animation" in message) == false) {
        var fileId = message.document.file_id;
    }
    if ("video_note" in message) {
        var fileId = message.video_note.file_id;
    }
    if ("video" in message) {
        var fileId = message.video.file_id;
    }
    if ("voice" in message) {
        var fileId = message.voice.file_id;
        audio = true;
    }
    var caption = message.caption;
    var auxFile = botTel.getFile(fileId)
    var chat = message.chat.id;
    //Esto es lo que hace que funcione la magia de Telegram - Discord
    toDiscord(msg, usuario, auxFile, chat, caption, audio);
});

botTel.on("message", async message => {
    // si no pones el prefijo al principio no se juega!
    if (message.text != undefined) {
        if (message.text.indexOf(configTel.prefix) !== 0) return;

        // separamos los argumentos del comando
        const args = message.text.slice(configTel.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        switch (command) {

            case "start":

                botTel.sendMessage(message.chat.id, "Hola! He llegado a Telegram");


                break;

            case "help":
                const opcionesAyuda = args.join(" ");
                switch (opcionesAyuda) {
                    default:
                        botTel.sendMessage(message.chat.id, "Mis comandos son: \n crear \n ver \n cuantoquedapara \n d (tirar dados) \n disc \n sound \n Puedes saber mas de cada uno usando 'help' + comando");
                        break;

                    case "crear":
                        botTel.sendMessage(message.chat.id, "crear (categoria:'cumple' o 'evento') (nombre de persona o evento) (fecha en dd/mm/aaaa)");
                        break;
                    case "see":
                        botTel.sendMessage(message.chat.id, "ver (categoria:cumples,eventos,todo)");
                        break;
                    case "cuantoquedapara":
                        botTel.sendMessage(message.chat.id, "cuantoquedapara + 'nombre de cuenta atras': te muestro los dias que quedan para llegar a esa fecha");
                        break;
                    // case "d":
                    //     botTel.sendMessage(message.chat.id, "d + 'numeroDeDados'd'nºdecaras': te lanzo el numero de dados que quieras con las caras que decidas");
                    //     break;
                    // case "sound":
                    //     botTel.sendMessage(message.chat.id, "sound + 'ara|araleo|cute|epic|voy': reproduce en el canal de filosofacion(Discord) un clip de sonido");
                    //     break;
                }
                break;

            case "crear":
                const setFecha = args.join(" ").split(" ");
                if (setFecha.length > 3) {
                    botTel.sendMessage(message.chat.id, "Algo aquí no va bien... prueba a no dejar espacios en el nombre de la cuenta atras :grin:");
                    return;
                } else {
                    let fechadecdaux = '"' + setFecha[2] + '"';
                    let cat = '"' + setFecha[0] + '"';
                    let json_cd = '{"codw":' + fechadecdaux + ',"categoria":' + cat.toLowerCase() + '}';

                    if (cat === '"cumple"') {
                        fs.writeJSON("./Bob_brain/countdowns/cumples/Cumple_" + setFecha[1] + ".json", JSON.parse(json_cd), function (err, result) {
                            if (err) console.log('error', err);
                            if (result) {}

                        });
                        botTel.sendMessage(message.chat.id, "¡He creado la cuenta atras!");

                    } else if (cat === '"evento"') {
                        fs.writeJSON("./Bob_brain/countdowns/eventos/Evento_" + setFecha[1] + ".json", json_cd, function (err, result) {
                            if (err) console.log('error', err);
                            if (result) {}
                        });
                        botTel.sendMessage(message.chat.id, "¡He creado la cuenta atras!");

                    } else {
                        await botTel.sendMessage(message.chat.id, "Creo que no entiendo esa categoría :surprised: Te recuerdo que el formato es: .crear (categoria:'cumple' o 'evento') (nombre de persona o evento) (fecha en dd/mm/aaaa)");
                    }

                }
                break;

            case "ver":
                var subver = args.join(" ").toLowerCase();
                switch (subver) {
                    case "cumples":
                        var cant = 0;
                        var filescump = fs.readdirSync('./Bob_brain/countdowns/cumples');
                        botTel.sendMessage(message.chat.id, "Dejame mirar por aquí...");

                        for (let item of filescump) {
                            let auxjson = require("./Bob_brain/countdowns/cumples/" + item);
                            if (auxjson.categoria === "cumple") {
                                cant++;
                                var m = await botTel.sendMessage(message.chat.id, "El evento de categoria cumpleaños con titulo: " + item.substring(0, item.length - 5) + "\n Es el día: " + auxjson.codw);
                            }
                        }
                        if (cant == 0) {
                            botTel.sendMessage(message.chat.id, "No he encontrado nada :confused:");

                        } else {
                            botTel.sendMessage(message.chat.id, "...y estas son mis " + cant + " coincidencias");
                        }
                        break;

                    case "eventos":
                        var cant = 0;
                        var filesev = fs.readdirSync('./Bob_brain/countdowns/eventos');
                        botTel.sendMessage(message.chat.id, "Dejame mirar por aquí...");

                        for (let item of filesev) {
                            let auxjson = require("./Bob_brain/countdowns/eventos/" + item);
                            if (auxjson.categoria === "evento") {
                                cant++;
                                var m = await botTel.sendMessage(message.chat.id, "El evento con titulo: " + item.substring(0, item.length - 5) + "\n Es el día: " + auxjson.codw);
                            }
                        }
                        if (cant == 0) {
                            botTel.sendMessage(message.chat.id, "No he encontrado nada :confused:");

                        } else {
                            botTel.sendMessage(message.chat.id, "...y estas son mis " + cant + " coincidencias");
                        }
                        break;

                    case "todo":
                        botTel.sendMessage(message.chat.id, "Eventos Planeados:");

                        var files = fs.readdirSync('./Bob_brain/countdowns/eventos/');
                        cant = 0;
                        for (let item of files) {
                            let auxjson = require("./Bob_brain/countdowns/eventos/" + item);
                            if (auxjson.categoria === "evento") {
                                cant++;
                                var m = await botTel.sendMessage(message.chat.id, "El evento de categoria evento con titulo: " + item.substring(0, item.length - 5) + "\n Es el día: " + auxjson.codw);
                            }
                        }
                        if (cant == 0) {
                            botTel.sendMessage(message.chat.id, "No he encontrado eventos :confused:");
                        }
                        var cant2 = 0;
                        var filescump = fs.readdirSync('./Bob_brain/countdowns/cumples');

                        botTel.sendMessage(message.chat.id, "Cumpleaños Guardados:");
                        for (let item of filescump) {
                            let auxjson = require("./Bob_brain/countdowns/cumples/" + item);
                            if (auxjson.categoria === "cumple") {
                                cant2++;
                                var m = await botTel.sendMessage(message.chat.id, "El evento de categoria cumpleaños con titulo: " + item.substring(0, item.length - 5) + "\n Es el día: " + auxjson.codw);
                            }
                        }
                        if (cant2 == 0) {
                            botTel.sendMessage(message.chat.id, "No he encontrado cumpleaños :confused:");

                        }
                        break;

                    default:
                        botTel.sendMessage(message.chat.id, "No he encontrado nada bajo la categoria: " + subver + " ¡Prueba con cumples, eventos o todo!");

                }
                break;

            case "cuantoquedapara":
                var cuentaAtras = args.join(" ").split(" ");

                var today = new Date();

                switch (cuentaAtras[0].toLowerCase()) {
                    case "cumple":
                        if (cuentaAtras[1] === "") {
                            botTel.sendMessage(message.chat.id, "No puedes dejarme sin saber de quien es el cumple :sad:");
                            var cant = 0;
                            var files = fs.readdirSync('./Bob_brain/countdowns/cumples');

                            botTel.sendMessage(message.chat.id, "Estos son los posibles");
                            for (let item of files) {
                                let auxjson = require("./Bob_brain/countdowns/cumples/" + item);
                                if (auxjson.categoria === "cumple") {
                                    cant++;
                                    var m = await botTel.sendMessage(message.chat.id, item.substring(7, item.length - 5));
                                }
                            }
                            if (cant == 0) {
                                botTel.sendMessage(message.chat.id, "...No he encontrado nada :confused:");

                            }
                            break;
                        }
                        let nombre = cuentaAtras[1].substring(0, 1).toUpperCase() + cuentaAtras[1].substring(1, cuentaAtras[1].length).toLowerCase();
                        let jsoncumple = require("./Bob_brain/countdowns/cumples/Cumple_" + nombre + ".json");

                        botTel.sendMessage(message.chat.id, "Dejame calcular...");
                        var cadate = service.refactorDate(jsoncumple.codw);

                        var m = await botTel.sendMessage(message.chat.id, "Quedan" + " " + service.diasPara(today, cadate) + " " + "dias");
                        if (service.diasPara(today, cadate) < 0) {
                            var m = await botTel.sendMessage(message.chat.id, "Creo que esta fecha ya ha pasado...");
                        } else if (service.diasPara(today, cadate) == 0) {
                            var m = await botTel.sendMessage(message.chat.id, "ES HOY :smiling_imp:");
                        }
                        break;

                    case "evento":
                        if (cuentaAtras[1] === "") {
                            botTel.sendMessage(message.chat.id, "No puedes dejarme sin saber de que evento me hablas :sad:");
                            var cant = 0;
                            var files = fs.readdirSync('./Bob_brain/countdowns/eventos');

                            botTel.sendMessage(message.chat.id, "Estos son los posibles");
                            for (let item of files) {
                                let auxjson = require("./Bob_brain/countdowns/eventos/" + item);
                                if (auxjson.categoria === "cumple") {
                                    cant++;
                                    var m = await botTel.sendMessage(message.chat.id, item.substring(7, item.length - 5));
                                }
                            }
                            if (cant == 0) {
                                botTel.sendMessage(message.chat.id, "...No he encontrado nada :confused:");

                            }
                            break;
                        }
                        let nombreev = cuentaAtras[1].substring(0, 1).toUpperCase() + cuentaAtras[1].substring(1, cuentaAtras[1].length).toLowerCase();
                        let jsonevento = require("./Bob_brain/countdowns/eventos/Evento_" + nombreev + ".json");

                        botTel.sendMessage(message.chat.id, "Dejame calcular...");
                        var cadate = service.refactorDate(jsonevento.codw);

                        var m = await botTel.sendMessage(message.chat.id, "Quedan" + " " + service.diasPara(today, cadate) + " " + "dias");
                        if (service.diasPara(today, cadate) < 0) {
                            var m = await botTel.sendMessage(message.chat.id, "Creo que esta fecha ya ha pasado...");
                        } else if (service.diasPara(today, cadate) == 0) {
                            var m = await botTel.sendMessage(message.chat.id, "ES HOY :smiling_imp:");
                        }
                        break;

                    default:
                        botTel.sendMessage(message.chat.id, "No he encontrado nada bajo la categoria: " + cuentaAtras[0] + " Quizas quieras ver eventos... o cumples");
                        break;

                }
                break;

            // case "d":


            //     const opcionesDado = args.join(" ");
            //     let numDados = "";
            //     let count = 0;

            //     while (opcionesDado.charAt(count) != 'd') {
            //         numDados += opcionesDado.charAt(count);
            //         count++;
            //     }

            //     let carasDado = opcionesDado.substring(count + 1, opcionesDado.length);

            //     if (Number(numDados) && Number(carasDado)) {
            //         let numeroDados = numDados;
            //         let contadorDeDado = 0
            //         while (numeroDados != 0) {
            //             contadorDeDado += 1;
            //             let max = Number(carasDado) + 1;
            //             let random = Math.floor(Math.random() * (max - 1)) + 1;
            //             botTel.sendMessage(message.chat.id, "Te ha salido un: " + random + " en el dado número " + contadorDeDado + " de " + carasDado + " caras");
            //             numeroDados--;
            //         }
            //     } else {
            //         botTel.sendMessage(message.chat.id, "Eso no es un número válido de caras de un dado pillín");
            //     }
            //     break;

            case "sound":
                botTel.sendMessage(message.chat.id, "Actualmente se encuentra deshabilitado");

                // var subcomando = args.join(" ").toLowerCase().split(" ");

                // telegramAnnoy(subcomando[0]);
                break;

        }
    }

});

//------------------------------------------------Cross-Comunicacion-------------------------------------------------------------------------

// function telegramAnnoy(sound) {

//     switch (sound) {

//         case "ara":
//             botDis.channels.get('587668857788039169').join().then(connection => {
//                 const dispatcher = connection.playFile('../Bob_brain/sound/ara.mp3');
//                 dispatcher.setVolume(10);
//                 dispatcher.on("end", end => {
//                     botDis.channels.get('587668857788039169').leave();
//                 });
//             }).catch(err => {
//                 console.log(err)
//             })
//             break;

//         case "epic":
//             botDis.channels.get('587668857788039169').join().then(connection => {
//                 const dispatcher = connection.playFile('../Bob_brain/sound/gio.mp3');
//                 dispatcher.setVolume(0.5);
//                 dispatcher.on("end", end => {
//                     botDis.channels.get('587668857788039169').leave();
//                 });
//             }).catch(err => {
//                 console.log(err)
//             })
//             break;

//         case "voy":
//             botDis.channels.get('587668857788039169').join().then(connection => {
//                 const dispatcher = connection.playFile('./Bob_brain/sound/pipo.mp3');
//                 dispatcher.setVolume(15);
//                 dispatcher.on("end", end => {
//                     botDis.channels.get('587668857788039169').leave();
//                 });
//             }).catch(err => {
//                 console.log(err)
//             })

//             break;

//         case "araleo":
//             botDis.channels.get('587668857788039169').join().then(connection => {
//                 const dispatcher = connection.playFile('../Bob_brain/sound/araleo.wav');
//                 dispatcher.setVolume(10);
//                 dispatcher.on("end", end => {
//                     botDis.channels.get('587668857788039169').leave();
//                 });
//             }).catch(err => {
//                 console.log(err)
//             })
//             break;

//         case "cute":
//             botDis.channels.get('587668857788039169').join().then(connection => {
//                 const dispatcher = connection.playFile('../Bob_brain/sound/pudi.mp3');
//                 dispatcher.setVolume(0.7);
//                 dispatcher.on("end", end => {
//                     botDis.channels.get('587668857788039169').leave();
//                 });
//             }).catch(err => {
//                 console.log(err)
//             })
//             break;
//     }
// }

function toTelegram(mensaje, usuario, chat, adjunto) {
    if (chat == 625189122637692948 && usuario != "Bob" && usuario != "nadie") {
        if (adjunto != "") {
            botTel.sendMessage("-96306579", usuario + ": " + adjunto);
        } else {
            botTel.sendMessage("-96306579", usuario + ": " + mensaje);

        }
    }
}

function toDiscord(mensaje, usuario, auxFile, chat, caption, auxBool) {
    if (chat === -96306579 && usuario != "PocketBob") {
        if (mensaje != undefined) {
            botDis.channels.get("625189122637692948").send(usuario + ": " + mensaje);
        }

        if (auxFile != null || auxFile != undefined) {
            auxFile.then(res => {
                if (caption == undefined || caption == null) {
                    caption = "";
                }
                if (auxBool) {
                    botDis.channels.get('587668857788039169').join().then(connection => {

                        const dispatcher = connection.playArbitraryInput("https://api.telegram.org/file/bot" + configTel.token + "/" + res.file_path);
                        dispatcher.on("end", end => {
                            botDis.channels.get('587668857788039169').leave();
                        });
                    }).catch(err => {
                        console.log(err)
                    })
                }
                botDis.channels.get("625189122637692948").send(usuario + ": " + caption + "\br" + "https://api.telegram.org/file/bot" + configTel.token + "/" + res.file_path);
            }).catch(err => console.log(err))
        }
    }
}

//--------------------------------------Recordatorios, Cumpleaños y Eventos------------------------------------------------------------------
setInterval(function recuerdame() {
    var dir = './Bob_brain/recordatorios';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var today = new Date();
    var files = fs.readdirSync('./Bob_brain/recordatorios');
    console.log(files);
    for (item of files) {
        var auxjson = require('./Bob_brain/recordatorios/' + item);
        console.log(item);
        let msg = "";
        for (let i = 0; i < auxjson.msg.length; i++) {
            if (auxjson.msg.charAt(i) == '_') {
                msg = msg + " ";
            } else {
                msg = msg + auxjson.msg.charAt(i);
            }
        }
        let todayTime = "";
        if (today.getMinutes > 10) {
            todayTime = today.getHours() + ":0" + today.getMinutes();
        } else {
            todayTime = today.getHours() + ":" + today.getMinutes();
        }
        if (todayTime == "00:00") {
            cumples();
            eventos();
        }
        console.log(msg);
        console.log('Es a las: ' + auxjson.hora)
        console.log('Son las: ' + todayTime)


        if (auxjson.hora === todayTime && auxjson.estado !== "innactivo") {
            botDis.channels.get('607821527404118022').send("<@" + auxjson.persona + "> : " + msg);
        }
    }
    console.log("Recordatorios comprobados")
}, 1 * 60 * 1000);

function cumples() {
    var dir = './Bob_brain/countdowns/cumples';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var today = new Date();
    let currentyear = Number(today.getFullYear());
    console.log("Dias para fin de año:" + service.diasPara(today, service.refactorDate("01/01/" + (currentyear + 1))));

    var files = fs.readdirSync('./Bob_brain/countdowns/cumples/');
    for (let item of files) {
        let json3 = require("./Bob_brain/countdowns/cumples/" + item);
        if (service.diasPara(today, service.refactorDate(json3.codw)) == 0) {
            notificar(item.substring(7, item.length - 5), "felicitar");
        }
        if (json3.categoria === "cumple" && service.diasPara(today, service.refactorDate(json3.codw)) <= 0) {

            var anio = (currentyear + 1);
            var nuevaFecha = '"' + json3.codw.substring(0, 6) + anio + '"';
            let json_cd = '{"codw":' + nuevaFecha + ',' +
                '"categoria":' + json3.categoria +
                '}';
            fs.writeJSON("./Bob_brain/countdowns/cumples/" + item, JSON.parse(json_cd), function (err, result) {
                if (err) console.log('error', err);
            });
        }
    }
}
cumples();

function eventos() {
    var dir = './Bob_brain/countdowns/eventos';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    var today = new Date();
    var files = fs.readdirSync('./Bob_brain/countdowns/eventos/');

    for (let item of files) {
        let json3 = require("./Bob_brain/countdowns/eventos/" + item);
        if (service.diasPara(today, service.refactorDate(json3.codw)) == 1 || service.diasPara(today, service.refactorDate(json3.codw)) == 0) {
            console.log("Evento: " + item.substring(7, item.length - 5) + " --aviso--");
        }
    }
}
eventos();

function notificar(nombre, motivo) {
    try {
        if (motivo === 'felicitar') {
            botDis.channels.get("607821527404118022").send("<@" + service.user(nombre) + ">: " + "Feliz cumple !!!!!!1001010");
        }

    } catch (e) {
        console.log("[ERROR]", e)
    }
}