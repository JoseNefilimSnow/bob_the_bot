const Discord = require('discord.js');
const config = require("../Bob_brain/configDis.json");
const bot = new Discord.Client();

const fetch = require("node-fetch");
var fs = require('fs');

console.log('Empieza a acceder en el chat:');;

bot.on("ready", () => {
    //Cuando se inicia, el bot imprimira lo siguiente:
    console.log(`Bob Esta Dentro`);
    console.log('¡Gracias por el Host Alberto!');
    // Ahora añadimos un estado por los memes al bot:
    bot.user.setActivity("¡ '.help' para ayuda!");
});

bot.on("message", async message => {

    if (message.content.indexOf(config.prefix) == 0) return;
    let cont = 0;
    if (message.author.bot) return;
    let uid = "<@" + message.author.id + ">";
    let auxPalabras = message.content.toLowerCase().split(" ");

    while (auxPalabras[cont] != null) {
        switch (auxPalabras[cont]) {
            default:
                break;
        }
        cont++
    }
    cont = 0;
});


bot.on("message", async message => {
    //no queremos que el bot se responda a si mismo... ¿o si?
    if (message.author.bot) return;
    // si no pones el prefijo al principio no se juega!
    if (message.content.indexOf(config.prefix) !== 0) return;

    // separamos los ...
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch (command) {

        case "crear":
            const setFecha = args.join(" ").split(" ");
            if (setFecha.length > 3) {
                message.channel.send("Algo aquí no va bien... prueba a no dejar espacios en el nombre de la cuenta atras :grin:");
                return;
            } else {
                let fechadecdaux = '"' + setFecha[2] + '"';
                let cat = '"' + setFecha[0] + '"';
                let json_cd = '{"codw":' + "" + fechadecdaux + ',' +
                    '"categoria":' + cat.toLowerCase() +
                    '}';
                if (cat === '"cumple"') {
                    fs.writeFile("../Bob_brain/countdowns/cumples/Cumple_" + setFecha[1] + ".json", json_cd, function (err, result) {
                        message.channel.send("¡He creado la cuenta atras!");
                        if (err) console.log('error', err);
                        if (result) {}
                    });
                } else if (cat === '"evento"') {
                    fs.writeFile("../Bob_brain/countdowns/eventos/Evento_" + setFecha[1] + ".json", json_cd, function (err, result) {
                        message.channel.send("¡He creado la cuenta atras!");
                        if (err) console.log('error', err);
                        if (result) {}
                    });
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
                    var filescump = fs.readdirSync('../Bob_brain/countdowns/cumples');
                    message.channel.send("Dejame mirar por aquí...");

                    for (let item of filescump) {
                        let auxjson = require("../Bob_brain/countdowns/cumples/" + item);
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
                    var filesev = fs.readdirSync('../Bob_brain/countdowns/eventos/');
                    cant = 0;
                    message.channel.send("Dejame mirar por aquí...");

                    for (let item of filesev) {
                        let auxjson = require("../Bob_brain/countdowns/eventos/" + item);
                        if (auxjson.categoria === "evento") {
                            cant++;
                            var m = await message.channel.send("El evento de categoria evento con titulo: " + item.substring(0, item.length - 5) + "\n Es el día: " + auxjson.codw);
                        }
                    }
                    if (cant == 0) {
                        message.channel.send("No he encontrado nada :confused:");

                    } else {
                        message.channel.send("...y estas son mis " + cant + " coincidencias");
                    }
                    break;

                case "todo":
                case "":
                    message.channel.send("Eventos Planeados:");

                    var files = fs.readdirSync('../Bob_brain/countdowns/eventos/');
                    cant = 0;
                    for (let item of files) {
                        let auxjson = require("../Bob_brain/countdowns/eventos/" + item);
                        if (auxjson.categoria === "evento") {
                            cant++;
                            var m = await message.channel.send("El evento de categoria evento con titulo: " + item.substring(0, item.length - 5) + "\n Es el día: " + auxjson.codw);
                        }
                    }
                    if (cant == 0) {
                        message.channel.send("No he encontrado eventos :confused:");
                    }
                    var cant2 = 0;
                    var filescump = fs.readdirSync('../Bob_brain/countdowns/cumples');

                    message.channel.send("Cumpleaños Guardados:");
                    for (let item of filescump) {
                        let auxjson = require("../Bob_brain/countdowns/cumples/" + item);
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
                        var files = fs.readdirSync('../Bob_brain/countdowns/cumples');

                        message.channel.send("Estos son los posibles");
                        for (let item of files) {
                            let auxjson = require("../Bob_brain/countdowns/cumples/" + item);
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
                    let nombre =cuentaAtras[1].substring(0, 1).toUpperCase() + cuentaAtras[1].substring(1, cuentaAtras[1].length).toLowerCase();
                    let jsoncumple = require("../Bob_brain/countdowns/cumples/Cumple_" + nombre + ".json");

                    message.channel.send("Dejame calcular...");
                    var cadate = refactorDate(jsoncumple.codw);

                    var m = await message.channel.send("Quedan" + " " + diasPara(today, cadate) + " " + "dias");
                    if (diasPara(today, cadate) < 0) {
                        var m = await message.channel.send("Creo que esta fecha ya ha pasado...");
                    } else if (diasPara(today, cadate) == 0) {
                        var m = await message.channel.send("ES HOY :smiling_imp:");
                    }
                    break;

                case "evento":
                    if (cuentaAtras[1] === "") {
                        message.channel.send("No puedes dejarme sin saber de que evento me hablas :sad:");
                        var cant = 0;
                        var files = fs.readdirSync('../Bob_brain/countdowns/eventos');

                        message.channel.send("Estos son los posibles");
                        for (let item of files) {
                            let auxjson = require("../Bob_brain/countdowns/eventos/" + item);
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
                    let jsonevento = require("../Bob_brain/countdowns/eventos/Evento_" + nombreev + ".json");

                    message.channel.send("Dejame calcular...");
                    var cadate = refactorDate(jsonevento.codw);

                    var m = await message.channel.send("Quedan" + " " + diasPara(today, cadate) + " " + "dias");
                    if (diasPara(today, cadate) < 0) {
                        var m = await message.channel.send("Creo que esta fecha ya ha pasado...");
                    } else if (diasPara(today, cadate) == 0) {
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

            console.log(opcionesDado);
            
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

        case "limpia":

            const fetched = await message.channel.fetchMessages({
                limit: 90
            });
            message.channel.bulkDelete(fetched);

            message.channel.send("He barrido, aspirado y quitado el polvo de esto que llamais sala de chat");
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
                        let auxP = user(subcomando[2]);
                        let persona = '"' + auxP + '"';
                        let hora = subcomando[3];
                        let msg = "";
                        let indice = 4;
                        while (subcomando[indice] != null) {
                            msg = msg + "_" + subcomando[indice] + "_";
                            indice++;
                        }
                        let json_r = '{"recordatorio":' + recordatorio + ',"persona":' + "" + persona + ',' +
                            '"msg":' + '"' + msg + '"' + ',"hora": "' + hora + '"' +
                            '}';
                        fs.writeFile("../Bob_brain/recordatorios/" + subcomando[1] + ".json", json_r, function (err, result) {
                            if (err) console.log('error', err);
                            if (result) {
                                message.channel.send("He creado el recordatorio");
                            }
                        });
                    }
                    break;
                case "ver":
                    var files = fs.readdirSync('../Bob_brain/recordatorios/');
                    cant = 0;
                    message.channel.send("Dejame mirar por aquí...");

                    if (subcomando[1] == null) {
                        for (let item of files) {
                            let auxjson = require("../Bob_brain/recordatorios/" + item);
                            cant++;
                            let msg = "";
                            for (let i = 0; i < auxjson.msg.length; i++) {
                                if (auxjson.msg.charAt(i) == '_') {
                                    msg = msg + " ";
                                } else {
                                    msg = msg + auxjson.msg.charAt(i);
                                }
                            }
                            var m = await message.channel.send("Tengo un recodatorio para " + "<@" + auxjson.persona + ">" + "\n Con el mensaje: " + msg + "\n y se repite a las " + auxjson.hora);
                        }
                        if (cant == 0) {
                            message.channel.send("No he encontrado nada :confused:");

                        } else {
                            message.channel.send("...y estas son mis " + cant + " coincidencias");
                        }
                    } else {

                        if (user(subcomando[1]) === "nadie") {

                            message.channel.send("No existe esa persona...");

                        } else {
                            message.channel.send("Los mensajes para <@" + user(subcomando[1]) + ">");

                            for (let item of files) {
                                let auxjson = require("../Bob_brain/recordatorios/" + item);
                                cant++;
                                let msg = "";
                                for (let i = 0; i < auxjson.msg.length; i++) {
                                    if (auxjson.msg.charAt(i) == '_') {
                                        msg = msg + " ";
                                    } else {
                                        msg = msg + auxjson.msg.charAt(i);
                                    }
                                }
                                if ('"' + user(subcomando[1]) + '"' === auxjson.persona) {
                                    var m = await message.channel.send(msg + "\n y se repite a las " + auxjson.hora);
                                }
                            }
                            if (cant == 0) {
                                message.channel.send("No he encontrado nada :confused:");

                            }
                        }
                    }
                    break;

                // case "cerrar":
                //     var files = fs.readdirSync('../Bob_brain/recordatorios/');
                //     cant = 0;
                //     message.channel.send("¿Cual quieres cerrar? Usa .recordatorio cerrar + num");
                //     if (Number(subcomando[1])) {
                //         let del = Number(subcomando[1]);
                //         for (let item of files) {
                //             if (del == 0) {
                //                 fs.unlink('../Bob_brain/recordatorios/' + item);
                //                 message.channel.send("Borrado!");

                //             }
                //             del--;
                //         }
                //         break;
                //     }
                //     for (let item of files) {
                //         let auxjson = require("../Bob_brain/recordatorios/" + item);
                //         cant++;
                //         let msg = "";
                //         for (let i = 0; i < auxjson.msg.length; i++) {
                //             if (auxjson.msg.charAt(i) == '_') {
                //                 msg = msg + " ";
                //             } else {
                //                 msg = msg + auxjson.msg.charAt(i);
                //             }
                //         }
                //         var m = await message.channel.send(cant + ". " + msg);

                //     }

                //     break;
            }
            break;

        case "help":
            const opcionesAyuda = args.join(" ");
            switch (opcionesAyuda) {
                default:
                    message.channel.send("Mis comandos son: \n crear \n ver \n cuantoquedapara \n d (tirar dados) \n limpia \n recordatorio \n Puedes saber mas de cada uno usando 'help' + comando");
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

            }
            break;

    }
});

bot.login(config.token);

//-----------------------Funciones del Bot ;)----------------------------------//
cumples();

function cumples() {
    var today = new Date();
    let currentyear = Number(today.getFullYear());
    console.log("Dias para fin de año:" + diasPara(today, refactorDate("01/01/" + (currentyear + 1))));

    var files = fs.readdirSync('../Bob_brain/countdowns/cumples/');
    for (let item of files) {
        let json3 = require("../Bob_brain/countdowns/cumples/" + item);
        if (json3.categoria === "cumple" && diasPara(today, refactorDate(json3.codw)) <= 0) {
            if (diasPara(today, refactorDate(json3.codw)) < 0) {
                let aviso = bot.channels.get('607821527404118022');
                aviso.send(user(item.substring(7, item.length - 5).toLowerCase()) + ": " + "Feliz Cumpleaños!!!!!!1010101 (retrasadas jeje)");

            } else if (diasPara(today, refactorDate(json3.codw)) == 0) {
                let aviso = bot.channels.get('607821527404118022');
                aviso.send(user(item.substring(7, item.length - 5).toLowerCase()) + ": " + "Feliz Cumpleaños!!!!!!1010101");

            }
            var anio = (currentyear + 1);
            var nuevaFecha = '"' + json3.codw.substring(0, 6) + anio + '"';
            let json_cd = '{"codw":' + "" + nuevaFecha + ',' +
                '"categoria":' + '"' + json3.categoria + '"' +
                '}';
            fs.writeFile("../Bob_brain/countdowns/cumples/" + item, json_cd, function (err, result) {
                if (err) console.log('error', err);
            });
        }
    }
}

function refactorDate(aux) {
    var caDate = new Date();

    let dias = caDate.setDate(aux.substring(0, 2));

    let mes = caDate.setMonth(String(Number(aux.substring(3, 5)) - 1));

    let año = caDate.setFullYear(aux.substring(6, aux.length));

    return caDate;
}

function diasPara(a, b) {
    var date1_ms = a.getTime();
    var date2_ms = b.getTime();
    var milisegundosPorDia = 1000 * 60 * 60 * 24;
    var dif_ms = date2_ms - date1_ms;
    return Math.round(dif_ms / milisegundosPorDia);
}

setInterval(function recuerdame() {
    var today = new Date();
    var files = fs.readdirSync('../Bob_brain/recordatorios/');
    for (item of files) {
        var auxjson = require('../Bob_brain/recordatorios/' + item);
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
        }
        console.log(msg);
        console.log('Es a las: ' + auxjson.hora)
        console.log('Son las: ' + todayTime)


        if (auxjson.hora === todayTime) {
            bot.channels.get('607821527404118022').send("<@" + auxjson.persona + "> : " + msg);
        }
    }
    console.log("Recordatorios comprobados")
}, 1 * 60 * 1000);

function user(nombre) {
    let id = "";
    console.log(nombre)
    switch (nombre.replace("!", "")) {

        case "<@591398316726681630>":
            id = "yo";
            break;

        case "jose":
        case "<@145964245773844481>":
            id = "145964245773844481";
            break;

        case "alberto":
        case "<@202816335602909184>":
            id = "202816335602909184";
            break;

        case "bryan":
        case "bryanfalso":
        case "<@222812719965929472>":
            id = "222812719965929472";
            break;

        case "yonay":
        case "<@145281168911237121>":
            id = "145281168911237121";
            break;

        case "sure":
        case "<@145276289454964738>":
            id = "145276289454964738";
            break;

        case "diego":
        case "<@332964222243962880>":
            id = "332964222243962880";
            break;

        case "leo":
        case "<@145189017237848064>":
            id = "145189017237848064";
            break;
        case "lya":
        case "<@377482733972357122>":
            id = "377482733972357122";
            break;
        case "andrea":
        case "<@260081879489708034>":
            id = "260081879489708034";
            break;
        case "javi":
        case "<@372549493247442947>":
            id = "372549493247442947";
            break;
        default:
            id = "nadie";
            break;
    }
    return id;
}

function revuser(id) {
    let nombre = "";
    console.log(id)
    switch (id.replace("!", "")) {

        case "<@591398316726681630>":
            nombre = "yo";
            break;

        case "145964245773844481":
        case "<@145964245773844481>":
            nombre = "jose";
            break;

        case "202816335602909184":
        case "<@202816335602909184>":
            nombre = "alberto";
            break;

        case "222812719965929472":
        case "<@222812719965929472>":
            nombre = "bryan";
            break;

        case "145281168911237121":
        case "<@145281168911237121>":
            nombre = "yonay";
            break;

        case "145276289454964738":
        case "<@145276289454964738>":
            nombre = "sure";
            break;

        case "332964222243962880":
        case "<@332964222243962880>":
            nombre = "diego";
            break;

        case "145189017237848064":
        case "<@145189017237848064>":
            nombre = "leo";
            break;

        case "377482733972357122":
        case "<@377482733972357122>":
            nombre = "lya";
            break;

        case "260081879489708034":
        case "<@260081879489708034>":
            nombre = "andrea";
            break;

        case "372549493247442947":
        case "<@372549493247442947>":
            nombre = "javi";
            break;

        default:
            nombre = "nadie";
            break;
    }
    return nombre;
}