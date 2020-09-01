//Imports E inicio de bots
require('dotenv/config');
const fs = require('fs-extra');
const TelegramBot = require('node-telegram-bot-api');
const Discord = require('discord.js');
const https = require('https');
const Rae = require('rae');
const raeClient = Rae.create();
const configTel = require("./Bob_brain/configTel.json");
const configDis = require("./Bob_brain/configDis.json");
const service = require("./service.js");
const bd = require('./bd');

const botTel = new TelegramBot(process.env.TOKEN_TELEGRAM, {
    polling: true
});
const botDis = new Discord.Client();

botDis.login(process.env.TOKEN_DISCORD);

// -------------------------------------------------------------------------------

console.log('Iniciando...');

//Ininiamos el bot en Discord

botDis.on("", () => {
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
    const sender = (await bd.buscar('usuarios', {
        usernameDis: message.author.username
    })).resultado[0]
    //no queremos que el bot se responda a si mismo... ¿o si?
    if (message.author.bot) return;
    // si no pones el prefijo al principio no se juega!
    if (message.content.indexOf(configDis.prefix) !== 0) return;

    // separamos los ...
    const args = message.content.slice(configDis.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command == "registrarse") {
        if (!args[0]) {
            message.channel.send("Para registrarte, indica si te has registrado antes con telegram \n  -'.registrarse si userTelegram'- \n (el nombre con @ de tu perfil en telegram) \n si no es el caso, simplemente escriba -'.registrarse new'- :smile:");

        }
        if (args[0] == 'new') {
            bd.insertar('usuarios', {
                "usernameDis": message.author.username,
                "usernameTel": "",
                "idDis": message.author.id,
                "idTel": ""
            })
            message.channel.send("```¡Registro completado correctamente! ```:smile:");
        } else {
            const user = await ((await bd.buscar('usuarios', {
                usernameTel: args[1]
            })).resultado[0])


            bd.editar('usuarios', {
                "id": user.id,
                "usernameDis": message.author.username,
                "usernameTel": user.usernameTel,
                "idDis": String(message.author.id),
                "idTel": user.idTel
            }, user).then(res => {
                message.channel.send("```¡Tus datos se han actualizado con exito! ```:smile:");
            })
        }

    } else if (sender) {
        if ((await bd.buscar('usuarios', {
                usernameDis: message.author.username
            })).resultado[0].idDis == "") {
            console.log("entro aqui", (await bd.buscar('usuarios', {
                usernameDis: message.author.username
            })).resultado[0])

            const overwrite = (await bd.buscar('usuarios', {
                usernameDis: message.author.username
            })).resultado[0];

            bd.editar('usuarios', {
                "id": overwrite.id,
                "usernameDis": message.author.username,
                "idDis": message.author.id,
                "idTel": "",
            }, overwrite)
        }

        switch (command) {

            case "help":
                const opcionesAyuda = args.join(" ");
                switch (opcionesAyuda) {
                    default:
                        message.channel.send("```Mis comandos son: \n crear \n ver \n dias \n d (tirar dados) \n limpia \n Puedes saber mas de cada uno usando 'help' + comando```");
                        break;

                    case "crear":
                        message.channel.send("crear (categoria:'cumple' o 'evento') (nombre de persona o evento) (fecha en dd/mm/aaaa)");
                        break;
                    case "see":
                        message.channel.send("ver (categoria:cumples,eventos,todo)");
                        break;
                    case "dias":
                        message.channel.send("dias + categoria + 'nombre de cuenta atras': te muestro los dias que quedan para llegar a esa fecha");
                        break;
                    case "d":
                        message.channel.send("d + 'numeroDeDados'd'nºdecaras': te lanzo el numero de dados que quieras con las caras que decidas");
                        break;
                    case "limpia":
                        message.channel.send("limpia + numero de mensajes que quieres borrar + veces que se repite : borra hasta 99 mensajes del chat actual... no puedo borrar mas de 100 pero puedo hacer una trampa fea que Jose conoce");
                        break;
                        // case "recordatorio":
                        //     message.channel.send("recordatorio: realiza una serie de acciones con el fin de construir un recordatorio para alguien o todos, para mas informacion usa el comando '.recordatorio'");
                        //     break;
                        // case "sound":
                        //     // message.channel.send("sound + 'ara|araleo|cute|epic': reproduce en el canal un clip de sonido");
                        //     message.channel.send("```DESHABILITADO```");
                        //     break;

                }
                break;

            case "identificar":
                console.log(bd.identificarIdDis('usuarios', {
                    usernameDis: message.author.username
                }, message.author.id).then(res => console.log(res)))
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

                    let cat = '"' + setFecha[0] + '"'

                    let persona = '"' + setFecha[1] + '"';

                    let nombre = '"' + setFecha[1] + '"';

                    // let participantes = []

                    // participantes.push({
                    //     "participante": (await bd.buscar('usuarios', {
                    //         username: message.author.username
                    //     })).resultado[0].username
                    // })

                    let json_cumple = '{"codw":' + fechadecdaux + ',"persona":' + persona + '}';

                    let json_evento = '{"codw":' + fechadecdaux + ',"nombre":' + nombre + '}';

                    if (cat === '"cumple"') {

                        bd.insertar('cumpleaños', JSON.parse(json_cumple)).then(res => cumples());
                        message.channel.send("¡He creado la cuenta atras!");


                    } else if (cat === '"evento"') {

                        bd.insertar('eventos', JSON.parse(json_evento)).then(res => eventos());
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

                        const cumples = await bd.buscar('cumpleaños');

                        let cumplesDisplay = "";
                        for (let cumple of cumples.resultado) {
                            cumplesDisplay += "Cumpleaños de " + cumple.persona + "\n El dia: " + cumple.codw + "\n---------------------- \n"
                        }
                        if (cumples.resultado.length == 0) {
                            message.channel.send("No he encontrado nada :confused:");

                        } else {
                            var m = await message.channel.send("```Cumpleaños guardados: \n---------------------- \n" + cumplesDisplay + "```");
                            message.channel.send("...y estas son mis " + cumples.resultado.length + " coincidencias");
                        }

                        break;

                    case "eventos":

                        const eventos = await bd.buscar('eventos');

                        let eventosDisplay = "";
                        for (let evento of eventos.resultado) {
                            eventosDisplay += "Evento: " + evento.nombre + "\n El dia: " + evento.codw + "\n---------------------- \n"
                        }
                        if (cumples.resultado.length == 0) {
                            message.channel.send("No he encontrado nada :confused:");

                        } else {
                            var m = await message.channel.send("```Cumpleaños guardados: \n---------------------- \n" + eventosDisplay + "```");
                            message.channel.send("...y estas son mis " + cumples.resultado.length + " coincidencias");
                        }

                        break;

                    case "todo":

                        message.channel.send("Eventos guardados:");
                        const eventos2 = await bd.buscar('eventos');

                        let eventosDisplay2 = "";
                        for (let evento of eventos2.resultado) {
                            eventosDisplay2 += "Evento: " + evento.nombre + "\n El dia: " + evento.codw + "\n---------------------- \n"
                        }

                        if (eventos2.resultado.length == 0) {
                            message.channel.send("No he encontrado nada :confused:");

                        } else {
                            var m = await message.channel.send("```Evento: " + "\n" + eventosDisplay2 + "```");
                        }

                        message.channel.send("Cumpleaños Guardados:");
                        const cumples2 = await bd.buscar('cumpleaños');

                        let cumplesDisplay2 = "";
                        for (let cumple of cumples2.resultado) {
                            cumplesDisplay2 += "Cumpleaños de " + cumple.persona + "\n El dia: " + cumple.codw + "\n---------------------- \n"
                        }
                        if (cumples2.resultado.length == 0) {
                            message.channel.send("No he encontrado nada :confused:");

                        } else {
                            var m = await message.channel.send("```Cumple: " + "\n" + cumplesDisplay2 + "```");
                        }
                        break;


                    default:
                        message.channel.send("No he encontrado nada bajo la categoria: " + subver + " ¡Prueba con cumples, eventos o todo!");

                }
                break;

            case "dias":
                var cuentaAtras = args.join(" ").split(" ");

                var today = new Date();

                switch (cuentaAtras[0].toLowerCase()) {
                    case "cumple":
                        let cumples = bd.buscar('cumpleaños')
                        let personas = "";

                        if (cuentaAtras[1] == undefined) {

                            message.channel.send("No puedes dejarme sin saber de quien es el cumple :cry:");
                            message.channel.send("Estos son los posibles");
                            for (let cumple of (await cumples).resultado) {
                                personas += cumple.persona + "\n";
                            }
                            if (personas.length == 0) {
                                message.channel.send("...No he encontrado nada :confused:");

                            } else {
                                message.channel.send("```" + personas + "```");

                            }
                            break;

                        } else {
                            let cumple = bd.buscar('cumpleaños', {
                                "persona": cuentaAtras[1]
                            })
                            message.channel.send("Dejame calcular...");
                            var cadate = service.refactorDate((await cumple).resultado[0].codw);

                            var m = await message.channel.send("Quedan" + " " + service.diasPara(today, cadate) + " " + "dias");
                            if (service.diasPara(today, cadate) < 0) {
                                var m = await message.channel.send("Creo que esta fecha ya ha pasado...");
                            } else if (service.diasPara(today, cadate) == 0) {
                                var m = await message.channel.send("ES HOY :smiling_imp:");
                            }
                        }
                        break;

                    case "evento":
                        let eventos = bd.buscar('eventos')
                        let nombre = "";

                        if (cuentaAtras[1] == undefined) {

                            message.channel.send("No puedes dejarme sin saber de quien es el cumple :cry:");
                            message.channel.send("Estos son los posibles");
                            for (let evento of (await eventos).resultado) {
                                nombre += evento.persona + "\n";
                            }
                            if (personas.length == 0) {
                                message.channel.send("...No he encontrado nada :confused:");

                            } else {
                                message.channel.send("```" + nombre + "```");

                            }
                            break;

                        } else {
                            let evento = bd.buscar('eventos', {
                                "nombre": cuentaAtras[1]
                            })
                            message.channel.send("Dejame calcular...");
                            var cadate = service.refactorDate((await evento).resultado[0].codw);

                            var m = await message.channel.send("Quedan" + " " + service.diasPara(today, cadate) + " " + "dias");
                            if (service.diasPara(today, cadate) < 0) {
                                var m = await message.channel.send("Creo que esta fecha ya ha pasado...");
                            } else if (service.diasPara(today, cadate) == 0) {
                                var m = await message.channel.send("ES HOY :smiling_imp:");
                            }
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
                            /**
                             * 1: nombre del recordatorio
                             * 2: usuario
                             * 3: hora
                             * 4+: mensaje
                             */
                        }
                        break;

                    case "ver":
                        message.channel.send("Dejame mirar por aquí...");

                        if (subcomando[1] == null) {
                            // todos
                        } else {
                            // de una persona
                        }
                        break;

                    case "cerrar":
                        //Borrar
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
    } else {
        message.channel.send("```Por favor usa .registrarse para poder usar comandos ```:smile:");
    }
});

//----------------------------------------------------Telegram-------------------------------------------------------------------------------


botTel.on("message", async message => {
    const sender = (await bd.buscar('usuarios', {
        usernameTel: message.from.username
    })).resultado[0]
    // si no pones el prefijo al principio no se juega!

    if (message.text != undefined) {
        if (message.text.indexOf(configTel.prefix) !== 0) return;

        const args = message.text.slice(configTel.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if (command == "registrarse") {
            if (!args[0]) {
                botTel.sendMessage(message.chat.id, 'Para registrarte, indica si te has registrado antes con discord \n ( -"/registrarse si userDiscord"- (el nombre de tu perfil)) \n si no es el caso, simplemente escriba -"/registrarse new"-');

            }
            if (args[0] == 'new') {
                bd.insertar('usuarios', {
                    "usernameDis": "",
                    "usernameTel": message.from.username,
                    "idDis": "",
                    "idTel": String(message.from.id)
                })
                botTel.sendMessage(message.chat.id, "¡Registro completado correctamente");
            } else if (args[0] == "si") {
                const user = await ((await bd.buscar('usuarios', {
                    usernameDis: args[1]
                })).resultado[0])
                console.log('Usuario encontrado', user);
                bd.editar('usuarios', {
                    "id": user.id,
                    "usernameDis": user.usernameDis,
                    "usernameTel": message.from.username,
                    "idTel": user.idDis,
                    "idDis": String(message.from.id)
                }, user).then(res => {
                    botTel.sendMessage(message.chat.id, "¡Tus datos se han actualizado con exito! :smile:");
                })
            }
        } else if (sender) {

            if ((await bd.buscar('usuarios', {
                    usernameTel: message.from.username
                })).resultado[0].idDis == "") {
                console.log("entro aqui", (await bd.buscar('usuarios', {
                    usernameTel: message.from.username
                })).resultado[0])

                const overwrite = (await bd.buscar('usuarios', {
                    usernameTel: message.from.username
                })).resultado[0];

                bd.editar('usuarios', {
                    "id": overwrite.id,
                    "username": overwrite.username,
                    "idDis": "",
                    "idTel": message.from.id,
                }, overwrite)
            }

            switch (command) {
                case "start":

                    botTel.sendMessage(message.chat.id, "¡Hola! He llegado a Telegram");


                    break;

                case "identificar":
                    console.log(bd.identificarIdTel('usuarios', {
                        usernameTel: message.from.username
                    }, String(message.from.id)).then(res => console.log(res)))
                    break;

                case "help":
                    const opcionesAyuda = args.join(" ");
                    switch (opcionesAyuda) {
                        default:
                            botTel.sendMessage(message.chat.id, "Mis comandos son: \n crear \n ver \n dias \n d (tirar dados) \n Puedes saber mas de cada uno usando 'help' + comando");
                            break;

                        case "crear":
                            botTel.sendMessage(message.chat.id, "crear (categoria:'cumple' o 'evento') (nombre de persona o evento) (fecha en dd/mm/aaaa)");
                            break;
                        case "see":
                            botTel.sendMessage(message.chat.id, "ver (categoria:cumples,eventos,todo)");
                            break;
                        case "dias":
                            botTel.sendMessage(message.chat.id, "dias + categoria + 'nombre de cuenta atras': te muestro los dias que quedan para llegar a esa fecha");
                            break;
                        case "d":
                            botTel.sendMessage(message.chat.id, "d + 'numeroDeDados'd'nºdecaras': te lanzo el numero de dados que quieras con las caras que decidas");
                            break;

                            // case "recordatorio":
                            //     message.channel.send("recordatorio: realiza una serie de acciones con el fin de construir un recordatorio para alguien o todos, para mas informacion usa el comando '.recordatorio'");
                            //     break;
                            // case "sound":
                            //     // message.channel.send("sound + 'ara|araleo|cute|epic': reproduce en el canal un clip de sonido");
                            //     message.channel.send("DESHABILITADO");
                            //     break;

                    }
                    break;


                case "crear":

                    const setFecha = args.join(" ").split(" ");

                    if (setFecha.length > 3) {

                        botTel.sendMessage(message.chat.id, "Algo aquí no va bien... prueba a no dejar espacios en el nombre de la cuenta atras ;)");
                        return;

                    } else {

                        let fechadecdaux = '"' + setFecha[2] + '"';

                        let cat = '"' + setFecha[0] + '"'

                        let persona = '"' + setFecha[1] + '"';

                        let nombre = '"' + setFecha[1] + '"';

                        // let participantes = []

                        // participantes.push({
                        //     "participante": (await bd.buscar('usuarios', {
                        //         username: message.author.username
                        //     })).resultado[0].username
                        // })

                        let json_cumple = '{"codw":' + fechadecdaux + ',"persona":' + persona + '}';

                        let json_evento = '{"codw":' + fechadecdaux + ',"nombre":' + nombre + '}';

                        if (cat === '"cumple"') {

                            bd.insertar('cumpleaños', JSON.parse(json_cumple));
                            botTel.sendMessage(message.chat.id, "¡He creado la cuenta atras!");


                        } else if (cat === '"evento"') {

                            bd.insertar('eventos', JSON.parse(json_evento));
                            botTel.sendMessage(message.chat.id, "¡He creado la cuenta atras!");
                        } else {

                            await botTel.sendMessage(message.chat.id, "Creo que no entiendo esa categoría ... Te recuerdo que el formato es: .crear (categoria:'cumple' o 'evento') (nombre de persona o evento) (fecha en dd/mm/aaaa)");

                        }

                    }
                    break;

                case "ver":

                    var subver = args.join(" ").toLowerCase();

                    switch (subver) {

                        case "cumples":

                            const cumples = await bd.buscar('cumpleaños');

                            let cumplesDisplay = "";
                            for (let cumple of cumples.resultado) {
                                cumplesDisplay += "Cumpleaños de " + cumple.persona + "\n El dia: " + cumple.codw + "\n---------------------- \n"
                            }
                            if (cumples.resultado.length == 0) {
                                botTel.sendMessage(message.chat.id, "No he encontrado nada :confused:");

                            } else {
                                var m = await botTel.sendMessage(message.chat.id, "Cumpleaños guardados: \n---------------------- \n" + cumplesDisplay + "");
                                botTel.sendMessage(message.chat.id, "...y estas son mis " + cumples.resultado.length + " coincidencias");
                            }

                            break;

                        case "eventos":

                            const eventos = await bd.buscar('eventos');

                            let eventosDisplay = "";
                            for (let evento of eventos.resultado) {
                                eventosDisplay += "Evento: " + evento.nombre + "\n El dia: " + evento.codw + "\n---------------------- \n"
                            }
                            if (cumples.resultado.length == 0) {
                                botTel.sendMessage(message.chat.id, "No he encontrado nada :confused:");

                            } else {
                                var m = await botTel.sendMessage(message.chat.id, "Cumpleaños guardados: \n---------------------- \n" + eventosDisplay + "");
                                botTel.sendMessage(message.chat.id, "...y estas son mis " + cumples.resultado.length + " coincidencias");
                            }

                            break;

                        case "todo":

                            botTel.sendMessage(message.chat.id, "Eventos guardados:");
                            const eventos2 = await bd.buscar('eventos');

                            let eventosDisplay2 = "";
                            for (let evento of eventos2.resultado) {
                                eventosDisplay2 += "Evento: " + evento.nombre + "\n El dia: " + evento.codw + "\n---------------------- \n"
                            }

                            if (eventos2.resultado.length == 0) {
                                botTel.sendMessage(message.chat.id, "No he encontrado nada :confused:");

                            } else {
                                var m = await botTel.sendMessage(message.chat.id, "Evento: " + "\n" + eventosDisplay2 + "");
                            }

                            botTel.sendMessage(message.chat.id, "Cumpleaños Guardados:");
                            const cumples2 = await bd.buscar('cumpleaños');

                            let cumplesDisplay2 = "";
                            for (let cumple of cumples2.resultado) {
                                cumplesDisplay2 += "Cumpleaños de " + cumple.persona + "\n El dia: " + cumple.codw + "\n---------------------- \n"
                            }
                            if (cumples2.resultado.length == 0) {
                                botTel.sendMessage(message.chat.id, "No he encontrado nada :confused:");

                            } else {
                                var m = await botTel.sendMessage(message.chat.id, "Cumple: " + "\n" + cumplesDisplay2 + "");
                            }
                            break;


                        default:
                            botTel.sendMessage(message.chat.id, "No he encontrado nada bajo la categoria: " + subver + " ¡Prueba con cumples, eventos o todo!");

                    }
                    break;

                case "dias":
                    var cuentaAtras = args.join(" ").split(" ");

                    var today = new Date();

                    switch (cuentaAtras[0].toLowerCase()) {
                        case "cumple":
                            let cumples = bd.buscar('cumpleaños')
                            let personas = "";

                            if (cuentaAtras[1] == undefined) {

                                botTel.sendMessage(message.chat.id, "No puedes dejarme sin saber de quien es el cumple :cry:");
                                botTel.sendMessage(message.chat.id, "Estos son los posibles");
                                for (let cumple of (await cumples).resultado) {
                                    personas += cumple.persona + "\n";
                                }
                                if (personas.length == 0) {
                                    botTel.sendMessage(message.chat.id, "...No he encontrado nada :confused:");

                                } else {
                                    botTel.sendMessage(message.chat.id, "" + personas + "");

                                }
                                break;

                            } else {
                                let cumple = bd.buscar('cumpleaños', {
                                    "persona": cuentaAtras[1]
                                })
                                console.log((await cumple).resultado[0].codw)
                                var cadate = service.refactorDate((await cumple).resultado[0].codw);

                                botTel.sendMessage(message.chat.id, "Quedan" + " ¡¡" + service.diasPara(today, cadate) + " " + "dias!!!");
                                if (service.diasPara(today, cadate) < 0) {
                                    var m = await botTel.sendMessage(message.chat.id, "Creo que esta fecha ya ha pasado...");
                                } else if (service.diasPara(today, cadate) == 0) {
                                    var m = await botTel.sendMessage(message.chat.id, "ES HOY :D");
                                }
                            }
                            break;

                        case "evento":
                            let eventos = bd.buscar('eventos')
                            let nombre = "";

                            if (cuentaAtras[1] == undefined) {

                                botTel.sendMessage(message.chat.id, "No puedes dejarme sin saber de quien es el cumple :cry:");
                                botTel.sendMessage(message.chat.id, "Estos son los posibles");
                                for (let evento of (await eventos).resultado) {
                                    nombre += evento.persona + "\n";
                                }
                                if (personas.length == 0) {
                                    botTel.sendMessage(message.chat.id, "...No he encontrado nada :confused:");

                                } else {
                                    botTel.sendMessage(message.chat.id, "" + nombre + "");

                                }
                                break;

                            } else {
                                let evento = bd.buscar('eventos', {
                                    "nombre": cuentaAtras[1]
                                })
                                botTel.sendMessage(message.chat.id, "Dejame calcular...");
                                var cadate = service.refactorDate((await evento).resultado[0].codw);

                                var m = await botTel.sendMessage(message.chat.id, "Quedan" + " " + service.diasPara(today, cadate) + " " + "dias");
                                if (service.diasPara(today, cadate) < 0) {
                                    var m = await botTel.sendMessage(message.chat.id, "Creo que esta fecha ya ha pasado...");
                                } else if (service.diasPara(today, cadate) == 0) {
                                    var m = await botTel.sendMessage(message.chat.id, "ES HOY :smiling_imp:");
                                }
                            }
                            break;

                        default:
                            botTel.sendMessage(message.chat.id, "No he encontrado nada bajo la categoria: " + cuentaAtras[0] + " Quizas quieras ver evento... o cumple");
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
                            botTel.sendMessage(message.chat.id, "Te ha salido un: " + random + " en el dado número " + contadorDeDado + " de " + carasDado + " caras :game_die:");
                            numeroDados--;
                        }
                    } else {
                        botTel.sendMessage(message.chat.id, "Eso no es un número válido de caras de un dado pillín :imp::smiling_imp:");
                    }
                    break;

                case "recordatorio":
                    var subcomando = args.join(" ").toLowerCase().split(" ");
                    switch (subcomando[0]) {

                        default:
                            botTel.sendMessage(message.chat.id, "Comandos:\n ver: Mira las alarmas que hay\n \n crear + 'nombre recordatorio' +  'nombre' + 'hora' +'recordatorio'  : crea una recordatorio para alguien  \n ");
                            break;

                        case "crear":
                            if (subcomando.length < 5) {
                                botTel.sendMessage(message.chat.id, "Algo aquí no va bien... ¡te falta algo!");
                                return
                            } else {
                                /**
                                 * 1: nombre del recordatorio
                                 * 2: usuario
                                 * 3: hora
                                 * 4+: mensaje
                                 */
                            }
                            break;

                        case "ver":
                            botTel.sendMessage(message.chat.id, "Dejame mirar por aquí...");

                            if (subcomando[1] == null) {
                                // todos
                            } else {
                                // de una persona
                            }
                            break;

                        case "cerrar":
                            //Borrar
                            break;
                    }
                    break;

                case "sound":
                    var m = await botTel.sendMessage(message.chat.id, " Actualmente se encuentra deshabilitado ");

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
        } else {
            botTel.sendMessage(message.chat.id, "Por favor usa /registrarse para poder usar comandos");

        }
    }

});

//------------------------------------------------Cross-Comunicacion-------------------------------------------------------------------------


// function toTelegram(mensaje, usuario, chat, adjunto) {
//     if (chat == 625189122637692948 && usuario != "Bob" && usuario != "nadie") {
//         if (adjunto != "") {
//             botTel.sendMessage("-96306579", usuario + ": " + adjunto);
//         } else {
//             botTel.sendMessage("-96306579", usuario + ": " + mensaje);

//         }
//     }
// }

// function toDiscord(mensaje, usuario, auxFile, chat, caption, auxBool) {
//     if (chat === -96306579 && usuario != "PocketBob") {
//         if (mensaje != undefined) {
//             botDis.channels.get("625189122637692948").send(usuario + ": " + mensaje);
//         }

//         if (auxFile != null || auxFile != undefined) {
//             auxFile.then(res => {
//                 if (caption == undefined || caption == null) {
//                     caption = "";
//                 }
//                 if (auxBool) {
//                     botDis.channels.get('587668857788039169').join().then(connection => {

//                         const dispatcher = connection.playArbitraryInput("https://api.telegram.org/file/bot" + configTel.token + "/" + res.file_path);
//                         dispatcher.on("end", end => {
//                             botDis.channels.get('587668857788039169').leave();
//                         });
//                     }).catch(err => {
//                         console.log(err)
//                     })
//                 }
//                 botDis.channels.get("625189122637692948").send(usuario + ": " + caption + "\br" + "https://api.telegram.org/file/bot" + configTel.token + "/" + res.file_path);
//             }).catch(err => console.log(err))
//         }
//     }
// }

//--------------------------------------Recordatorios, Cumpleaños y Eventos------------------------------------------------------------------
// setInterval(function recuerdame() {
//     var dir = './Bob_brain/recordatorios';

//     if (!fs.existsSync(dir)) {
//         fs.mkdirSync(dir);
//     }
//     var today = new Date();
//     var files = fs.readdirSync('./Bob_brain/recordatorios');
//     console.log(files);
//     for (item of files) {
//         var auxjson = require('./Bob_brain/recordatorios/' + item);
//         console.log(item);
//         let msg = "";
//         for (let i = 0; i < auxjson.msg.length; i++) {
//             if (auxjson.msg.charAt(i) == '_') {
//                 msg = msg + " ";
//             } else {
//                 msg = msg + auxjson.msg.charAt(i);
//             }
//         }
//         let todayTime = "";
//         if (today.getMinutes > 10) {
//             todayTime = today.getHours() + ":0" + today.getMinutes();
//         } else {
//             todayTime = today.getHours() + ":" + today.getMinutes();
//         }
//         if (todayTime == "00:00") {
//             cumples();
//             eventos();
//         }
//         console.log(msg);
//         console.log('Es a las: ' + auxjson.hora)
//         console.log('Son las: ' + todayTime)


//         if (auxjson.hora === todayTime && auxjson.estado !== "innactivo") {
//             botDis.channels.get('607821527404118022').send("<@" + auxjson.persona + "> : " + msg);
//         }
//     }
//     console.log("Recordatorios comprobados")
// }, 1 * 60 * 1000);


function cumples() {

    var today = new Date();
    let currentyear = Number(today.getFullYear());

    console.log("Dias para fin de año:" + service.diasPara(today, service.refactorDate("01/01/" + (currentyear + 1))));

    bd.buscar('cumpleaños').then(cumples => {
        for (let cumple of cumples.resultado) {
            // if (service.diasPara(today, service.refactorDate(cumple.codw)) == 0) {
            //     //sistema de notificación de cumples
            // }
            if (service.diasPara(today, service.refactorDate(cumple.codw)) <= 0) {
                var dias = cumple.codw.substring(0, 2);
                var mes = String(Number(cumple.codw.substring(3, 5)) - 1)
                var anio = (currentyear + 1);
                console.log("Fecha Nueva", dias + "/" + mes + "/" + anio)
                bd.editar('cumpleaños', cumple, {
                    id: cumple.id,
                    persona: cumple.persona,
                    codw: dias + "/" + mes + "/" + anio
                })
            }
        }
    })
}

// async function eventos() {

//     var today = new Date();
//     let currentyear = Number(today.getFullYear());

//     const eventos = (await bd.buscar('eventos')).resultado
//     if (eventos != []) {
//         for (let evento of eventos) {
//             if (service.diasPara(today, service.refactorDate(evento.codw)) == 0) {
//                 //sistema de notificación de cumples
//             }
//             if (service.diasPara(today, service.refactorDate(evento.codw)) <= 0) {
//                 var dias = evento.codw.substring(0, 2);
//                 var mes = String(Number(evento.codw.substring(3, 5)) - 1)
//                 var anio = (currentyear + 1);
//                 bd.editar('eventos', evento, {
//                     id: evento.id,
//                     persona: evento.persona,
//                     codw: dias + "/" + mes + "/" + anio
//                 })
//             }
//         }
//     }
// }
// eventos();