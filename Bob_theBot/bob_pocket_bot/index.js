var TelegramBot = require('node-telegram-bot-api');
const config = require("../Bob_brain/configTel.json");
const bot = new TelegramBot(config.token, {
    polling: true
});

const fetch = require("node-fetch");
var fs = require('fs');

console.log('Empieza a acceder en el chat:');;

bot.on("ready", (message) => {
    //Cuando se inicia, el bot imprimira lo siguiente:
    console.log(`Bob Esta Dentro`);
    console.log('¡Gracias por el Host Alberto!');
});

bot.on("text", async message => {
    console.log(message);
    if (message.text.indexOf(config.prefix) == 0) return;
    let cont = 0;
    let auxPalabras = message.text.toLowerCase().split(" ");

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
    // si no pones el prefijo al principio no se juega!
    if (message.text.indexOf(config.prefix) !== 0) return;

    // separamos los
    const args = message.text.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch (command) {

        case "start":

            bot.sendMessage(message.chat.id, "Hola! He llegado a Telegram");


            break;

        case "crear":
            const setFecha = args.join(" ").split(" ");
            if (setFecha.length > 3) {
                bot.sendMessage(message.chat.id, "Algo aquí no va bien... prueba a no dejar espacios en el nombre de la cuenta atras :grin:");
                return;
            } else {
                let fechadecdaux = '"' + setFecha[2] + '"';
                let cat = '"' + setFecha[0] + '"';
                let json_cd = '{"codw":' + "" + fechadecdaux + ',' +
                    '"categoria":' + cat.toLowerCase() +
                    '}';
                if (cat === '"cumple"') {
                    fs.writeFile("../Bob_brain/countdowns/cumples/Cumple_" + setFecha[1] + ".json", json_cd, function (err, result) {
                        if (err) console.log('error', err);
                        if (result) {
                            bot.sendMessage(message.chat.id, "¡He creado la cuenta atras!");
                        }
                    });
                } else if (cat === '"evento"') {
                    fs.writeFile("../Bob_brain/countdowns/eventos/Evento_" + setFecha[0] + ".json", json_cd, function (err, result) {
                        if (err) console.log('error', err);
                        if (result) {
                            bot.sendMessage(message.chat.id, "¡He creado la cuenta atras!");
                        }
                    });
                } else {
                    await bot.sendMessage(message.chat.id, "Creo que no entiendo esa categoría :surprised: Te recuerdo que el formato es: .crear (categoria:'cumple' o 'evento') (nombre de persona o evento) (fecha en dd/mm/aaaa)");
                }

            }
            break;

        case "ver":
            var subver = args.join(" ").toLowerCase();
            switch (subver) {
                case "cumples":
                    var cant = 0;
                    var filescump = fs.readdirSync('../Bob_brain/countdowns/cumples');
                    bot.sendMessage(message.chat.id, "Dejame mirar por aquí...");

                    for (let item of filescump) {
                        let auxjson = require("../Bob_brain/countdowns/cumples/" + item);
                        if (auxjson.categoria === "cumple") {
                            cant++;
                            var m = await bot.sendMessage(message.chat.id, "El evento de categoria cumpleaños con titulo: " + item.substring(0, item.length - 5) + "\n Es el día: " + auxjson.codw);
                        }
                    }
                    if (cant == 0) {
                        bot.sendMessage(message.chat.id, "No he encontrado nada :confused:");

                    } else {
                        bot.sendMessage(message.chat.id, "...y estas son mis " + cant + " coincidencias");
                    }
                    break;

                case "eventos":
                    var filesev = fs.readdirSync('../Bob_brain/countdowns/eventos/');
                    cant = 0;
                    bot.sendMessage(message.chat.id, "Dejame mirar por aquí...");

                    for (let item of filesev) {
                        let auxjson = require("../Bob_brain/countdowns/eventos/" + item);
                        if (auxjson.categoria === "evento") {
                            cant++;
                            var m = await bot.sendMessage(message.chat.id, "El evento de categoria evento con titulo: " + item.substring(0, item.length - 5) + "\n Es el día: " + auxjson.codw);
                        }
                    }
                    if (cant == 0) {
                        bot.sendMessage(message.chat.id, "No he encontrado nada :confused:");

                    } else {
                        bot.sendMessage(message.chat.id, "...y estas son mis " + cant + " coincidencias");
                    }
                    break;

                case "todo":
                case "":
                    bot.sendMessage(message.chat.id, "Eventos Planeados:");

                    var files = fs.readdirSync('../Bob_brain/countdowns/eventos/');
                    cant = 0;
                    for (let item of files) {
                        let auxjson = require("../Bob_brain/countdowns/eventos/" + item);
                        if (auxjson.categoria === "evento") {
                            cant++;
                            var m = await bot.sendMessage(message.chat.id, "El evento de categoria evento con titulo: " + item.substring(0, item.length - 5) + "\n Es el día: " + auxjson.codw);
                        }
                    }
                    if (cant == 0) {
                        bot.sendMessage(message.chat.id, "No he encontrado eventos :confused:");
                    }
                    var cant2 = 0;
                    var filescump = fs.readdirSync('../Bob_brain/countdowns/cumples');

                    bot.sendMessage(message.chat.id, "Cumpleaños Guardados:");
                    for (let item of filescump) {
                        let auxjson = require("../Bob_brain/countdowns/cumples/" + item);
                        if (auxjson.categoria === "cumple") {
                            cant2++;
                            var m = await bot.sendMessage(message.chat.id, "El evento de categoria cumpleaños con titulo: " + item.substring(0, item.length - 5) + "\n Es el día: " + auxjson.codw);
                        }
                    }
                    if (cant2 == 0) {
                        bot.sendMessage(message.chat.id, "No he encontrado cumpleaños :confused:");

                    }
                    break;
                    
                    default:
                        bot.sendMessage(message.chat.id, "No he encontrado nada bajo la categoria: " + subver + " ¡Prueba con cumples, eventos o todo!");

            }
            break;

        case "cuantoquedapara":
            var cuentaAtras = args.join(" ").split(" ");

            var today = new Date();

            switch (cuentaAtras[0].toLowerCase()) {
                case "cumples":
                    if (cuentaAtras[1] === "") {
                        bot.sendMessage(message.chat.id, "No puedes dejarme sin saber de quien es el cumple :sad:");
                        var cant = 0;
                        var files = fs.readdirSync('../Bob_brain/countdowns/cumples');

                        bot.sendMessage(message.chat.id, "Estos son los posibles");
                        for (let item of files) {
                            let auxjson = require("../Bob_brain/countdowns/cumples/" + item);
                            if (auxjson.categoria === "cumple") {
                                cant++;
                                var m = await bot.sendMessage(message.chat.id, item.substring(7, item.length - 5));
                            }
                        }
                        if (cant == 0) {
                            bot.sendMessage(message.chat.id, "...No he encontrado nada :confused:");

                        }
                        break;
                    }
                    let nombre = cuentaAtras[1].substring(0, 1).toUpperCase() + cuentaAtras[1].substring(1, cuentaAtras[1].length).toLowerCase();
                    let jsoncumple = require("../Bob_brain/countdowns/cumples/Cumple_" + nombre + ".json");

                    bot.sendMessage(message.chat.id, "Dejame calcular...");
                    var cadate = refactorDate(jsoncumple.codw);

                    var m = await bot.sendMessage(message.chat.id, "Quedan" + " " + diasPara(today, cadate) + " " + "dias");
                    if (diasPara(today, cadate) < 0) {
                        var m = await bot.sendMessage(message.chat.id, "Creo que esta fecha ya ha pasado...");
                    } else if (diasPara(today, cadate) == 0) {
                        var m = await bot.sendMessage(message.chat.id, "ES HOY :smiling_imp:");
                    }
                    break;

                case "eventos":
                    if (cuentaAtras[1] === "") {
                        bot.sendMessage(message.chat.id, "No puedes dejarme sin saber de que evento me hablas :sad:");
                        var cant = 0;
                        var files = fs.readdirSync('../Bob_brain/countdowns/eventos');

                        bot.sendMessage(message.chat.id, "Estos son los posibles");
                        for (let item of files) {
                            let auxjson = require("../Bob_brain/countdowns/eventos/" + item);
                            if (auxjson.categoria === "cumple") {
                                cant++;
                                var m = await bot.sendMessage(message.chat.id, item.substring(7, item.length - 5));
                            }
                        }
                        if (cant == 0) {
                            bot.sendMessage(message.chat.id, "...No he encontrado nada :confused:");

                        }
                        break;
                    }
                    let nombreev = cuentaAtras[1].substring(0, 1).toUpperCase() + cuentaAtras[1].substring(1, cuentaAtras[1].length).toLowerCase();
                    let jsonevento = require("../Bob_brain/countdowns/eventos/Evento_" + nombreev + ".json");

                    bot.sendMessage(message.chat.id, "Dejame calcular...");
                    var cadate = refactorDate(jsonevento.codw);

                    var m = await bot.sendMessage(message.chat.id, "Quedan" + " " + diasPara(today, cadate) + " " + "dias");
                    if (diasPara(today, cadate) < 0) {
                        var m = await bot.sendMessage(message.chat.id, "Creo que esta fecha ya ha pasado...");
                    } else if (diasPara(today, cadate) == 0) {
                        var m = await bot.sendMessage(message.chat.id, "ES HOY :smiling_imp:");
                    }
                    break;

                default:
                    bot.sendMessage(message.chat.id, "No he encontrado nada bajo la categoria: " + cuentaAtras[0] + " Quizas quieras ver eventos... o cumples");
                    break;

            }
            break;

        case "d":

            const opcionesDado = args.join(" ");

            let numDados = "";
            let count = 0;

            if (opcionesDado.length > 1) {
                bot.sendMessage(message.chat.id, "¡No creo que hayas seguido el patrón bien! Recuerda que es (numero)d(numero) :smile:");
                break;
            }
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
                    bot.sendMessage(message.chat.id, "Te ha salido un: " + random + " en el dado número " + contadorDeDado + " de " + carasDado + " caras :game_die:");
                    numeroDados--;
                }
            } else {
                bot.sendMessage(message.chat.id, "Eso no es un número válido de caras de un dado pillín :imp::smiling_imp:");
            }
            break;
        case "help":
            const opcionesAyuda = args.join(" ");
            switch (opcionesAyuda) {
                default:
                    bot.sendMessage(message.chat.id, "Mis comandos son: \n crear \n ver \n cuantoquedapara \n d (tirar dados) \n limpia \n Puedes saber mas de cada uno usando 'help' + comando");
                    break;

                case "crear":
                    bot.sendMessage(message.chat.id, "crear (categoria:'cumple' o 'evento') (nombre de persona o evento) (fecha en dd/mm/aaaa)");
                    break;
                case "see":
                    bot.sendMessage(message.chat.id, "ver (categoria:cumples,eventos,todo)");
                    break;
                case "cuantoquedapara":
                    bot.sendMessage(message.chat.id, "cuantoquedapara + 'nombre de cuenta atras': te muestro los dias que quedan para llegar a esa fecha");
                    break;
                case "d":
                    bot.sendMessage(message.chat.id, "d + 'numeroDeDados'd'nºdecaras': te lanzo el numero de dados que quieras con las caras que decidas");
                    break;
                case "limpia":
                    bot.sendMessage(message.chat.id, "limpia + numero de mensajes que quieres borrar + veces que se repite : borra hasta 99 mensajes del chat actual... no puedo borrar mas de 100 pero puedo hacer una trampa fea que Jose conoce");
                    break;
            }
            break;


    }
});



// -----------------------Funciones del Bot ;)----------------------------------//

cumples();

function cumples() {
    var today = new Date();
    let currentyear = Number(today.getFullYear());
    console.log("Dias para fin de año:" + diasPara(today, refactorDate("01/01/" + (currentyear + 1))));

    var files = fs.readdirSync('../Bob_brain/countdowns/cumples/');
    for (let item of files) {
        let json3 = require("../Bob_brain/countdowns/cumples/" + item);
        if (json3.categoria === "cumple" && diasPara(today, refactorDate(json3.codw)) <= 0) {
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
    var caDate = new Date()

    let dias = caDate.setDate(aux.substring(0, 2));

    let mes = caDate.setMonth(String(Number(aux.substring(3, 5)) - 1));

    let año = caDate.setFullYear(aux.substring(6, aux.length));

    return caDate;
}

function diasPara(a, b) {
    var date1_ms = a.getTime();
    var date2_ms = b.getTime();
    var milisegundosPorDia = 1000 * 60 * 60 * 24;
    var dif_ms = date2_ms - date1_ms; // Convert back to days and return   
    return Math.round(dif_ms / milisegundosPorDia);
}

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