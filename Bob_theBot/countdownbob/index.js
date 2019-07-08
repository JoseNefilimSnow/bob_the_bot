const Discord = require('discord.js');
const config = require("../Bob_brain/configDis.json");
const bot = new Discord.Client();

const fetch = require("node-fetch");
var fs = require('fs');

const odooUrl = 'http://192.168.1.35:8069';
const nombreBD = 'Memeland';

// Urls de operaciones de Odoo para hacer requests:
const urlLogin = '/web/session/authenticate';
const urlLlamadaALaBd = '/web/dataset/call_kw';
const urlLeerDeLaBd = '/web/dataset/search_read';

console.log('Empieza a acceder en el chat:');;

bot.on("ready", () => {
    //Cuando se inicia, el bot imprimira lo siguiente:
    console.log(`Bob Esta Dentro`);
    // Ahora añadimos un estado por los memes al bot:
    bot.user.setActivity(`Destruir Galaxias y molestar`);
});

bot.on("message", async message => {

    if (message.content.indexOf(config.prefix) == 0) return;
    let cont = 0;
    if (message.author.bot) return;
    let uid = "<@" + message.author.id + ">";
    console.log(message.content)
    let auxPalabras = message.content.toLowerCase().split(" ");

    while (auxPalabras[cont] != null) {
        switch (auxPalabras[cont]) {

            case "hola":
            case "holi":
                await message.channel.send("¡Hola!... " + uid + " ¿Que tal?...");
                setTimeout(function () {
                        message.channel.send("¿A quien engañar, no soy real jajá! ");
                    },
                    2500
                )
                break;

            case "cenar":
            case "comer":
                await message.channel.send("Que aproveche!!");
                break;

                // case "ir":
                //     await message.channel.send("Bueno, hasta otro momento!");
                //     break;

            case "quiero":
                await message.channel.send("Yo tambien te quiero" + uid + "'menor que tres' 'menor que tres' 'menor que tres' :heart:");
                break;
            case "noches":
                await message.channel.send("Que descanses" + uid + " :smile:");
                break;

            case "tal?":
                await message.channel.send("Bien ¿y tu? Bip Bop carezco de muchas respuestas así asi que no fuerces la rueda :robot:");
                break;

            case "estas?":
                await message.channel.send("Sinceramente... importa poco ¿verdad?");
                break;

            case "si":
                await message.channel.send("Si? sique? siniestro es ");
                break;

            case "follen":
                if (auxPalabras[cont - 2] == "que" && auxPalabras[cont - 1] == "te" && auxPalabras[cont + 1] == "bob") {
                    await message.channel.send("Que te follen " + uid);
                    break;
                } else {
                    break;
                }

                case "bot":
                    await message.channel.send("¿Hablas de mí? :smiling_imp:");
                    break;


                case "rato":
                case "vengo":
                case "salgo":
                case "vuelvo":
                    await message.channel.send("Vuelve pronto " + uid);
                    break;

                case "ok":
                    await message.channel.send("OK.");
                    break;

                case "!play":
                    await message.channel.send("Yo elijo la siguiente!!");
                    break;

                case "poe":
                    await message.channel.send("Path of esto-pierde-tiempo");
                    break;

                case "warframe":
                    await message.channel.send("no empecemos, que ya tengo bastante con Jose");
                    break;

                case "pbe":
                    await message.channel.send("algun día tendre honor para entrar en el PBE... cuando empiece a jugar al Lol");
                    break;

                case "lol":
                    await message.channel.send("La liga de los fedeos!");
                    break;

                case "!dis":
                    await message.channel.send("Como le tiene que doler a Rythm que le saquen asi a patadas");
                    break;

                case "steam":
                    await message.channel.send("humito");
                    break;

                case "ow":
                    await message.channel.send("Overwatch la ha fastidiado con Overwatch 2 ...");
                    break;

                case "npm":
                    await message.channel.send(" i -g descansa_de_programar@latest");
                    break;

                case "puto":
                case "gilipollas":
                case "tonto":
                    await message.channel.send("TU SI " + uid + " :smirk:");
                    break;

                case "ruido":
                    await message.channel.send("RUIIIIIDOOOOOOOOO");
                    break;

                case "minion":
                case "slave":
                    await message.channel.send("Maiiisssstro", {
                        "tts": true
                    });
                    break;

                case "jojos":
                case "jojo":
                    await message.channel.send("PENSABAS QUE TE RESPONDERIA ALGUIEN RELEVANTE PERO NO ERA YO DI... BOB");
                    break;

                case "gg":
                    await message.channel.send("ez");
                    setTimeout(function () {
                            message.channel.send("noob");
                        },
                        2000
                    )
                    setTimeout(function () {
                            message.channel.send("git gud");
                        },
                        4000
                    )
                    break;
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

    // separamos los
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch (command) {

        case "quiensoy":
            console.log(message.author.name);


            break;
        case "ping":
            var m = await message.channel.send("Ping?");
            m.edit(`Voy asi de lento =  ${m.createdTimestamp - message.createdTimestamp}ms. Pero llamando a la API voy así = ${Math.round(bot.ping)}ms. Todo es culpa de Jose`);
            break;

        case "setca":
            const setFecha = args.join(" ").split(" ");
            if (setFecha.length > 3) {
                message.channel.send("Algo aquí no va bien... prueba a no dejar espacios en el nombre de la cuenta atras :grin:");
                return
            } else {
                var m = await message.channel.send("He creado la cuenta atras para estos planes malevolos");
                message.delete().catch(O_o => {});
                let fechadecdaux = '"' + setFecha[2] + '"';
                let cat = '"' + setFecha[1] + '"';
                let json_cd = '{"codw":' + "" + fechadecdaux + ',' +
                    '"categoria":' + cat +
                    '}';
                fs.writeFile("../Bob_brain/countdowns/" + setFecha[0] + ".json", json_cd, function (err, result) {
                    if (err) console.log('error', err);
                    if (result) {

                    }
                });
            }
            break;

        case "seeallca":
            var files = fs.readdirSync('../Bob_brain/countdowns/');
            for (let item of files) {
                let auxItem = item.substring(0, item.length - 5);
                var m = await message.channel.send(auxItem.toString());
            }
            var m = await message.channel.send("Y ya estaria");
            break;

        case "see":
            var readCa = args.join(" ");
            let json1 = require("../Bob_brain/countdowns/" + readCa + ".json");
            var m = await message.channel.send("La fecha de tu plan malevolo es: " + json1.codw);
            break;

        case "cuantoquedapara":
            var readCa = args.join(" ");

            var today = new Date();
            let json2 = require("../Bob_brain/countdowns/" + readCa + ".json");
            var cadate = refactorDate(json2.codw);

            var m = await message.channel.send("Quedan" + " " + diasPara(today, cadate) + " " + "dias para tu plan malevolo");
            if (diasPara(today, cadate) < 0) {
                var m = await message.channel.send("Creo que esta fecha ya ha pasado...");
            } else if (diasPara(today, cadate) == 0) {
                var m = await message.channel.send("ES HOY :smiling_imp:");
            }
            break;

        case "refactorizafecha":
            var readCa = args.join(" ");
            let json3 = require("../Bob_brain/countdowns/" + readCa + ".json");
            refactorDate(json3.codw);
            var m = await message.channel.send("El desarrollador te lo agradece :smile:");

        case "vercumples":
            var cant = 0;
            var files = fs.readdirSync('../Bob_brain/countdowns/');

            message.channel.send("Dejame mirar por aquí...");
            for (let item of files) {
                let auxjson = require("../Bob_brain/countdowns/" + item);
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

        case "vereventos":
            var files = fs.readdirSync('../Bob_brain/countdowns/');
            cant = 0;
            message.channel.send("Dejame mirar por aquí...");
            for (let item of files) {
                let auxjson = require("../Bob_brain/countdowns/" + item);
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

        case "actualizarcumples":
            message.channel.send("Llamemos a las fuerzas oscuras y actualicemos esa lista de cumpleaños");
            setTimeout(function () {
                    cumples();
                },
                6000
            )
            break;

        case "d":

            const opcionesDado = args.join(" ");

            let numDados = "";
            let count = 0;
            console.log(opcionesDado);

            while (opcionesDado.charAt(count) != 'd') {
                console.log(opcionesDado.charAt(count))
                numDados += opcionesDado.charAt(count);
                count++;
            }
            console.log(count)
            let carasDado = opcionesDado.substring(count + 1, opcionesDado.length);


            if (Number(numDados) && Number(carasDado)) {
                console.log("entro")
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

        case "odoo":
            var subcomando = args.join(" ").toLowerCase();
            switch (subcomando) {
                default:
                    message.channel.send("Comandos: \n login o inicia \n \n y más por venir");
                    break;
                case "login":
                case "iniciar":
                    login();
                    message.channel.send("He iniciado sesion en... Oodo, jodete Bryan <3");
                    break;
            }
            break;

            // case "extermina":
            //     let nombreCanal = message.channel.name;
            //     console.log(message.channel.muted);

            //     message.channel.delete();
            //     message.guild.createChannel(nombreCanal);
            //     message.channel.send("Exterminado");

        case "recordatorio":
            var subcomando = args.join(" ").toLowerCase().split(" ");
            switch (subcomando[0]) {
                default:
                    message.channel.send("Comandos:\n see: Mira las alarmas que hay\n \n set + 'nombre recordatorio' +  'nombre' + 'hora' +'recordatorio'  : crea una recordatorio para alguien  \n \n cerrar : cierra el recordatorio ");
                    break;
                case "set":
                    if (subcomando.length < 5) {
                        message.channel.send("Algo aquí no va bien... ¡te falta algo!");
                        return
                    } else {
                        var m = await message.channel.send("He creado el recordatorio");
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

                            }
                        });
                    }
                    break;
                case "see":
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

                            console.log(user(subcomando[1]));
                            message.channel.send("Los mensajes para <@" + user(subcomando[1]) + ">");

                            for (let item of files) {
                                console.log(item)
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
                                    console.log("entro")
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
                    var files = fs.readdirSync('../Bob_brain/recordatorios/');
                    cant = 0;
                    message.channel.send("¿Cual quieres cerrar? Usa .cerrar + num");
                    for (let item of files) {
                        if (subcomando[1] == cant) {
                            fs.unlink('recordatorios/' + item);
                            message.channel.send("Borrado!");
                            break;
                        }
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
                        var m = await message.channel.send(cant + ". " + msg);

                    }

                    break;
            }
            break;

        case "strike":

            const strikePerson = args.join(" ").split(" ");
            if (user(strikePerson[0]) === "nadie") {

                message.channel.send("No existe este usuario");

            } else if (user(strikePerson[0]) === "yo") {

                bot.channels.get('593237946690175036').send("No me voy a dar strikes a mi mismo zoquete");

            } else {
                message.channel.send("Has sido un chic@ mal@ <@" + user(strikePerson[0]) + ">");
                let countR = 1;
                let reason = "";
                while (strikePerson[countR] != null) {
                    reason = reason + strikePerson[countR] + "_";
                    console.log(reason)
                    countR++;
                }
                checkStrikes(revuser(strikePerson[0]), reason);
                message.channel.send("!play bad guy");
            }
            break;

        case "seestrikes":
            var files = fs.readdirSync('../Bob_brain/strikes/');
            for (item of files) {
                var auxjson = require('../Bob_brain/strikes/' + item);
                console.log(item);
                let reason = "";
                for (let i = 0; i < auxjson.reason.length; i++) {
                    if (auxjson.reason.charAt(i) == '_') {
                        reason = reason + " ";
                    } else {
                        reason = reason + auxjson.reason.charAt(i);
                    }
                }
                console.log(item.substring(7, 25));
                bot.channels.get('593237946690175036').send("Strike para <@" + item.substring(7, 25) + "> : " + reason);
            }
            break;
        case "help":
            const opcionesAyuda = args.join(" ");
            switch (opcionesAyuda) {
                default:
                    message.channel.send("Mis comandos son: \n ping \n seeallca \n setca \n see \n cuantoquedapara \n vercumple \n verevento \n d (tirar dados) \n actualizarcumples \n limpia \n recordatorio \n odoo \n Puedes saber mas de cada uno usando 'help' + comando");
                    break;
                case "ping":
                    message.channel.send("ping: te muestro la latencia que tengo con Jose y con la Api de Discord");
                    break;
                case "seeallca":
                    message.channel.send("seeallca: te muestro una vista general de todas las cuentas atras que tengo almacenadas");
                    break;
                case "setca":
                    message.channel.send("setca + 'nombre de cuenta atras' + 'categoria' + fecha de cuenta atras(dia/mes/año): creas una cuenta atras, las categorias disponibles son: cumple y evento");
                    break;
                case "see":
                    message.channel.send("see + 'nombre de cuenta atras': te muestro la fecha en esa cuenta atras");
                    break;
                case "cuantoquedapara":
                    message.channel.send("cuantoquedapara + 'nombre de cuenta atras': te muestro los dias que quedan para llegar a esa fecha");
                    break;
                case "vercumple":
                    message.channel.send("vercumple: te muestro una vista general de todas las cuentas atras que tengo almacenadas con categoria cumple");
                    break;
                case "verevento":
                    message.channel.send("verevento: te muestro una vista general de todas las cuentas atras que tengo almacenadas con categoria evento");
                    break;
                case "d":
                    message.channel.send("d + 'numeroDeDados'd'nºdecaras': te lanzo el numero de dados que quieras con las caras que decidas");
                    break;
                case "actualizarcumples":
                    message.channel.send("actualizarcumples:  atualiza la lista de cumpleaños almacenada a fechas más correctas (se realiza cada vez que se inicia el ordenador)");
                    break;
                case "limpia":
                    message.channel.send("limpia + numero de mensajes que quieres borrar + veces que se repite : borra hasta 99 mensajes del chat actual... no puedo borrar mas de 100 pero puedo hacer una trampa fea que Jose conoce");
                    break;
                case "odoo":
                    message.channel.send("odoo + iniciar o login: inicio sesión en odoo y creo una instancia");
                    break;
                case "recordatorio":
                    message.channel.send("recordatorio: realiza una serie de acciones con el fin de construir un recordatorio para alguien o todos, para mas informacion usa el comando '.recordatorio'");
                    break;

            }


    }
});
// if (command === "presentate") {
//     message.channel.send("Hola, soy Bob, una app de Discord que Jose se ha empeñado en programar en una noche con tal de crear cuentas atras inutiles.\n Como pueden imaginar yo no soy un ser sin vida cualquiera, lo cierto es que soy un pequeño demonio que Jose encerró aqui por eso la vibra siniestra :smiling_imp: \n Sin más dilación os dejo con mis comandos y no os preocupeis este es el unico comando que tengo libertad para usar por mi cuenta o quizas... pueda hacer más \n \n");
//     setTimeout(message.channel.send(".help"), 35000);
// }

bot.login(config.token);

//-----------------------Funciones del Bot ;)----------------------------------//

const enviarPeticion = async (urlOperacion, params) => {
    const opciones = JSON.stringify({
        params: params
    });
    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        // Los campos de access-control son por el cross-origin, se ponen solo para poder trabajar en desarrollo pero en producción habrá que quitarlos los tres:
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'POST,OPTIONS',
        'access-control-allow-headers': 'Content-Type, access-control-allow-origin, access-control-allow-credentials, accept',
    };
    const url = odooUrl + urlOperacion;
    console.log(url);
    console.log(JSON.parse(opciones));
    try {
        // Lo que viene dentro de este try será distinto para cada entorno; por ejemplo
        // en Angular será con el módulo HttpClient, o en React con el suyo. En este
        // caso hemos usado un módulo de Node llamado "fetch", habrá que cambiarlo
        // para cada tipo de aplicación:

        let respuesta = await fetch(url, {
            method: 'POST',
            body: opciones,
            headers: headers
        });
        // let respuesta = res.json();
        // console.log(await respuesta.json());
        const respuestajson = await respuesta.json();
        console.log('--------------------------------------');
        console.log(respuestajson);
        console.log('--------------------------------------');
        return respuestajson
        // "pregunta" es que el módulo "fetch" nos devuelve una función,
        // que es la que ejecutamos a continuación:
        // const respuesta = await pregunta.json(); // Aquí hacemos la request en sí
        // return respuesta;
    } catch (error) {
        console.log('El error salta en enviarPeticion');
        console.log(error);
    }
};
// Datos de login de Odoo:
// const emailLogin = 'prueba@admin.com'; // Jose
const emailLogin = 'admin@prueba.com'
const passLogin = 'prueba';

const login = async () => {
    const params = {
        db: nombreBD,
        login: emailLogin,
        password: passLogin,
        base_location: odooUrl,
        context: {}
    };

    const respuestaEnviarPeticion = await enviarPeticion(urlLogin, params);
    // La respuesta debería 1) ser un objeto, 2) tener una propiedad "result", 3) result debería tener una propiedad "user_context". 
    // Si el login está mal user_context será {} y otros campos como partner_id serán null, si está bien user_context tendrá información y el partner_id tendrá un array donde la posición 0 será el número.
    if (typeof respuestaEnviarPeticion !== 'object') {
        // Algún problema de comunicaciones con Odoo
    } else if (respuestaEnviarPeticion.result.user_context === {} ||
        respuestaEnviarPeticion.result.partner_id === null) {
        // Las credenciales del login están mal
    } else {
        console.log('Contenido del user_context');
        console.log('--------------------------------------');
        console.log(respuestaEnviarPeticion.result.user_context)
        console.log('--------------------------------------');
        // Login OK! user_context será nuestro "pasaporte" que luego enviaremos
        // con cada petición para interactuar con los datos de Odoo

        // El resultado de la operación login es una identificación que manda Odoo:
        fs.writeFile("../Bob_brain/sesion_odoo/sesion.json", '{ "user_context": ' + JSON.stringify(respuestaEnviarPeticion.result.user_context) + "}", function (err, result) {
            if (err) console.log('error', err);
        });
    }
};

cumples();

function cumples() {
    console.log('comprobando cumpleaños...')
    var today = new Date();
    console.log("Dias para fin de año:" + diasPara(today, refactorDate("01/01/2020")))
    var nextYear = String(Number(today.getFullYear()) + 1);

    var files = fs.readdirSync('../Bob_brain/countdowns/');
    for (let item of files) {
        let json3 = require("../Bob_brain/countdowns/" + item);
        if (json3.categoria === "cumple" && diasPara(today, refactorDate(json3.codw)) < 0) {
            var anio = Number(json3.codw.substring(6, json3.codw.length)) + 1;
            var nuevaFecha = '"' + json3.codw.substring(0, 6) + anio + '"';
            let json_cd = '{"codw":' + "" + nuevaFecha + ',' +
                '"categoria":' + '"' + json3.categoria + '"' +
                '}';
            fs.writeFile("../Bob_brain/countdowns/" + item, json_cd, function (err, result) {
                if (err) console.log('error', err);
            });
        }
    }
}

function obtenercontexto() {
    var contexto = require("../Bob_brain/sesion_odoo/sesion.json");
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
        console.log(msg);
        console.log('Es a las: ' + auxjson.hora)
        console.log('Son las: ' + todayTime)


        if (auxjson.hora === todayTime) {
            bot.channels.get('593237946690175036').send("<@" + auxjson.persona + "> : " + msg);
        }
    }
    console.log("Recordatorios comprobados")
}, 1 * 60 * 1000);

function checkStrikes(auxnombre, reason) {

    const strikes = require("../Bob_brain/strikescount.json");

    if (auxnombre === "nadie") {
        return "no"
    } else {
        console.log(strikes)
        let strikeNumber = strikes.auxnombre;
        console.log(strikeNumber)
        strikereasonkey = "usr" + auxnombre + "strike" + strikeNumber;
        strikes.auxnombre = '"' + strikeNumber + '"';
        fs.writeFile('../Bob_brain/strikes/strikes' + user(auxnombre) + "num" + strikeNumber + '.json', '{' + '"' + 'reason' + '"' + ':' + '"' + reason + '"' + '}', function (err, result) {
            if (err) console.log('error', err);
        });
        bot.channels.get('593237946690175036').send("<@" +  user(auxnombre) + "> : " + "Tienes " + strikeNumber + " strikes");
        return strikes.auxnombre;
    }

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

        case  "145189017237848064":
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