/* 
CREADO POR MANDELROT: https://mandelrot.com
Tengo algunas cosas interesantes de software y tutoriales de JS, pásate a echar un vistazo

Este fichero contiene un modelo de BD importable desde cualquier aplicación.
La BD está EN MEMORIA (ojo con las aplicaciones demasiado grandes) y hace una copia de
seguridad cada X tiempo en ficheros que creará automáticamente. 

Las constantes bajo este bloque comentado son las que definen el resto y deberían ser 
las únicas que se cambien en cada aplicación; no debería hacer falta pasar de ahí para 
trabajar con esta librería.

Seguridad: Si hay alguna colección de usuarios, admins o lo que sea que use contraseñas, 
poniéndole un campo "password" esta BD guardará el campo encriptado y nunca lo mostrará 
al exterior. Hay una función específicamente hecha para comprobar contraseñas.


Funciones disponibles (todas retornan { resultado: loquesea } o { error: string }):
==================================================================================

async bd.buscar (coleccion, objetoCriterio (opcional), camposFiltro (opcional), buscarEnString (boolean, opcional))
  EJEMPLO1: async bd.buscar('usuarios') --> Lista completa de usuarios, siempre sin el campo password
  EJEMPLO2: async bd.buscar('usuarios', {id: '123'}, ['nombre', 'email']) --> Solo los campos nombre y email de un usuario
  Si no hay objeto criterio salen todos. El objeto criterio solo debe tener un campo --> { nombre: 'Pepe' }
  buscarEnString es para encontrar trozos de texto en un campo string.
    Ejemplo: bd.buscar('usuarios', { email: '@hotmail.com' }, null, true) --> usuarios de Hotmail completos -sin password-
  resultado: [] (si no hay resultados) o bien resultado: [ { objeto -sin password- } ]

async bd.insertar (coleccion, objetoAInsertar)
  Si el objeto a insertar no tiene campo "id" se lo generamos automáticamente (y será una string)
  resultado: { el objeto con su id -sin password- }

async bd.editar (coleccion, objetoActualizado, sobreescribir (boolean, opcional))
  El objeto actualizado tiene que incluir el campo id correcto
  Si "sobreescribir === true" destruirá los campos que no le pasemos (excepto password),
    de lo contrario solo editará los campos explícitamente recibiros y dejará el resto como está
  resultado: { objeto modificado, completo -sin password- }

async bd.eliminar (coleccion, objetoCriterio)
  resultado: { eliminados: número } 


async bd.identificar (coleccion, objetoCriterio, password); // Comprobar contraseñas
  resultado: true/false


A tener en cuenta
=================
ESTA LIBRERÍA NO HACE COMPROBACIÓN DE CAMPOS DUPLICADOS (por ejemplo id's). Es un gestor de
operaciones de BD, para trabajos de control hará falta otra que se encargue de eso.

Buscando en este archivo "console.log" aparcerán unos catch con los que no se hace nada más que
imprimir el mensaje de error capturado. Están en unas funciones que solo se ejecutan al iniciar
para simplemente asegurarse de que los ficheros de respaldo están correctos y nunca deberían
saltar (si saltan es que hay un problema grave, la BD en memoria no se va respaldar), así que
lo suyo sería poner en esos catch alguna llamada a un sistema para avisar al admin como por
ejemplo una llamada a alguna función de otra librería para enviar emails. Just sayin'...
*/

const coleccionesDefinidas = ['usuarios', 'cumpleaños', 'eventos', 'recordatorios', ]; // Las que sea, según cada aplicación
const intervaloDeSincronizacion = 5; // En segundos
const carpetaBD = './Bob_Brain'; // la ruta parte del fichero donde esté este documento




///////////////////////////////////////////////////////////
// A PARTIR DE AQUÍ YA NO DEBERÍA HACER FALTA TOCAR NADA //
///////////////////////////////////////////////////////////





const fs = require('fs-extra'),
  cloneDeep = require('clone-deep'), // Para exportar solo copias de los valores de la BD
  {
    v4: uuidv4
  } = require('uuid'), // Para crear id's únicos
  bcrypt = require('bcryptjs');

let colecciones = {};
let ultimoGuardado = {};
let ultimaModificacion = {};



/* ************************ */
/* FUNCIONES SOBRE FICHEROS */
/* ************************ */
const ficherosQueDebenExistir = coleccionesDefinidas.map(col => col + '.json');

const asegurarQueLosArchivosBDExisten = async () => { // Y lo que no exista lo creamos
  try {
    await fs.ensureDir(carpetaBD);
    for (const fichero of ficherosQueDebenExistir) {
      await fs.ensureFile(carpetaBD + '/' + fichero);
      try {
        await fs.readJson(carpetaBD + '/' + fichero)
      } catch (error) {
        await fs.writeJson(carpetaBD + '/' + fichero, []);
      }
    }
  } catch (error) {
    console.log('Salta el catch de asegurar los archivos');
    console.log(error);
    // Aquí habría que hacer alguna llamada a alguna función externa de emails o avisos
  }
};

const cargarBD = async () => { // Solo al principio
  try {
    for (const coleccion of coleccionesDefinidas) {
      colecciones[coleccion] = await fs.readJson(carpetaBD + '/' + coleccion + '.json');
      ultimaModificacion[coleccion] = new Date().getTime();
      ultimoGuardado[coleccion] = new Date().getTime();
    }
  } catch (error) {
    console.log('Salta el catch de cargar BD');
    console.log(error);
    // Aquí habría que hacer alguna llamada a alguna función externa de emails o avisos
  }
};

const guardarBD = () => { // colecciones = objeto con la BD cargada
  const coleccionesAGuardar = [];
  for (const coleccionAComprobar of Object.keys(colecciones)) {
    if (ultimaModificacion[coleccionAComprobar] > ultimoGuardado[coleccionAComprobar]) {
      coleccionesAGuardar.push(coleccionAComprobar);
    }
  }
  for (const coleccion of coleccionesAGuardar) {
    try {
      fs.writeJson(carpetaBD + '/' + coleccion + '.json', colecciones[coleccion]);
      ultimoGuardado[coleccion] = new Date().getTime();
    } catch (error) {
      console.log('Salta el catch de guardar BD');
      console.log(error);
      // Aquí habría que hacer alguna llamada a alguna función externa de emails o avisos
    }
  }
}




/* ****** */
/* INICIO */
/* ****** */

const inicio = async () => {
  await asegurarQueLosArchivosBDExisten();
  await cargarBD();
  setInterval(() => {
    guardarBD();
  }, (intervaloDeSincronizacion * 1000));
}
inicio();




/* ******************** */
/* FUNCIONES AUXILIARES */
/* ******************** */

const limpiarObjeto = (objeto, camposFiltro) => {
  const clon = cloneDeep(objeto);
  delete clon.password; // Una password nunca sale de la BD
  if (Array.isArray(camposFiltro) && camposFiltro.length > 0) {
    const camposDelElemento = Object.keys(clon);
    for (const campo of camposDelElemento) {
      if (camposFiltro.indexOf(campo) === -1) {
        delete clon[campo];
      }
    }
  }
  return clon;
};

const limpiarArray = (array, camposFiltro) => {
  const clon = cloneDeep(array);
  const limpios = []
  let clonTemporal;
  for (const elemento of clon) {
    clonTemporal = limpiarObjeto(elemento, camposFiltro);
    limpios.push(clonTemporal);
  }
  return limpios;
};





/* ************** */
/* OPERACIONES BD */
/* ************** */
const bd = {}; // El objeto a exportar

bd.buscar = async (coleccion, objetoCriterio, camposFiltro, buscarEnString) => {
  if (!objetoCriterio) {
    objetoCriterio = {};
  }
  if (!camposFiltro) {
    camposFiltro = [];
  }
  try {
    if (!colecciones[coleccion]) {
      throw 'colección no encontrada en la BD';
    }
    if (typeof objetoCriterio !== 'object') {
      throw 'el criterio para buscar en la BD no tiene el formato correcto';
    }
    const criterio = Object.keys(objetoCriterio)[0];
    // Encontramos los resultados que coincidan con el criterio buscado
    let encontrados;
    if (criterio && typeof objetoCriterio[criterio] === 'string' && buscarEnString === true) {
      // Si es una string podemos buscar no solo coincidencias exactas sino trozos de texto
      encontrados = colecciones[coleccion].filter(cadaObjeto => cadaObjeto[criterio].indexOf(objetoCriterio[criterio]) > -1);
    } else {
      encontrados = colecciones[coleccion].filter(cadaObjeto => !criterio || cadaObjeto[criterio] == objetoCriterio[criterio]);
    }
    const resultado = limpiarArray(encontrados, camposFiltro);
    return {
      resultado
    };
  } catch (error) {
    return {
      error: 'Ha habido algún error en la función de buscar de la base de datos: ' + error
    };
  }
};

bd.insertar = async (coleccion, objeto) => {
  try {
    if (!colecciones[coleccion]) {
      throw 'colección no encontrada en la BD';
    }
    if (!objeto || Array.isArray(objeto) || typeof objeto !== 'object') {
      throw 'no hay un objeto válido para insertar';
    }
    const objetoClon = cloneDeep(objeto);
    if (!objetoClon.id) {
      objetoClon.id = uuidv4();
    }
    if (objetoClon.password) { // Si hay contraseña la encriptamos
      objetoClon.password = await bcrypt.hash(objetoClon.password, await bcrypt.genSalt(10));
    }
    if (objetoClon.idDis) { // Si hay contraseña la encriptamos
      objetoClon.idDis = await bcrypt.hash(objetoClon.idDis, await bcrypt.genSalt(10));
    }
    if (objetoClon.idTel) { // Si hay contraseña la encriptamos
      objetoClon.idTel = await bcrypt.hash(objetoClon.idTel, await bcrypt.genSalt(10));
    }
    colecciones[coleccion].push(objetoClon);
    ultimaModificacion[coleccion] = new Date().getTime();
    const resultado = limpiarObjeto(objetoClon);
    return resultado;
  } catch (error) {
    return {
      error: 'Ha habido algún error en la función de insertar en la base de datos: ' + error
    };
  }
};

bd.editar = async (coleccion, actualizado, sobreescribir) => {
  try {
    const clon = cloneDeep(actualizado);
    if (!colecciones[coleccion]) {
      throw 'colección no encontrada en la BD';
    }
    if (!clon.id || typeof clon.id !== 'string') {
      throw 'el elemento a modificar no tiene un id válido';
    }
    const encontrado = colecciones[coleccion].find(elemento => elemento.id === clon.id);
    if (!encontrado) {
      throw 'el elemento a modificar no se ha podido encontrar en la BD';
    }
    const camposDelActualizado = Object.keys(clon);
    for (const campo of camposDelActualizado) {
      switch (campo) {
        case 'password':
          encontrado[campo] = await bcrypt.hash(clon[campo], await bcrypt.genSalt(10));
          break;
        case 'idDis':
          if (encontrado[campo] == "") {
            encontrado[campo] = await bcrypt.hash(clon[campo], await bcrypt.genSalt(10));
          } else {
            if (!bcrypt.compare(encontrado[campo], clon[campo])) {
              encontrado[campo] = await bcrypt.hash(clon[campo], await bcrypt.genSalt(10));
            }
          }
          break;
        case 'idTel':
          if (encontrado[campo] == "") {
            encontrado[campo] = await bcrypt.hash(clon[campo], await bcrypt.genSalt(10));
          } else {
            if (!bcrypt.compare(encontrado[campo], clon[campo])) {
              encontrado[campo] = await bcrypt.hash(clon[campo], await bcrypt.genSalt(10));
            }
          }
          break;
        default:
          encontrado[campo] = clon[campo];
      }

    }
    if (sobreescribir === true) {
      const camposDelEncontrado = Object.keys(encontrado);
      for (const campoDelEncontrado of camposDelEncontrado) {
        if (camposDelActualizado.indexOf(campoDelEncontrado) === -1 && campoDelEncontrado !== 'password') {
          delete encontrado[campoDelEncontrado];
        }
      }
    }
    ultimaModificacion[coleccion] = new Date().getTime();
    const resultado = limpiarObjeto(encontrado);
    return resultado;
  } catch (error) {
    return {
      error: 'Ha habido algún error en la función de sobreescribir en la base de datos: ' + error
    };
  }
};

bd.eliminar = async (coleccion, objetoCriterio) => {
  try {
    if (!colecciones[coleccion]) {
      throw 'colección no encontrada en la BD';
    }
    if (Array.isArray(objetoCriterio) || typeof objetoCriterio !== 'object' || Object.keys(objetoCriterio).length !== 1) {
      throw 'el criterio para buscar el elemento a eliminar no tiene el formato correcto';
    }
    const criterio = Object.keys(objetoCriterio)[0];
    const encontrados = colecciones[coleccion].filter(elemento => elemento[criterio] == objetoCriterio[criterio]);
    if (encontrados.length === 0) {
      return {
        resultado: {
          eliminados: 0
        }
      };
    }
    colecciones[coleccion] = colecciones[coleccion].filter(elemento => elemento[criterio] != objetoCriterio[criterio]);
    ultimaModificacion[coleccion] = new Date().getTime();
    return {
      resultado: {
        eliminados: encontrados.length
      }
    };
  } catch (error) {
    return {
      error: 'Ha habido algún error en la función de eliminar en la base de datos: ' + error
    };
  }
};




/* ********************* */
/* FUNCIONES ESPECÍFICAS */
/* ********************* */

bd.identificar = async (coleccion, objetoCriterio, password) => { // La colección tiene que tener objetos con password
  try {
    if (!colecciones[coleccion]) {
      throw 'colección no encontrada en la BD';
    }
    if (Array.isArray(objetoCriterio) || typeof objetoCriterio !== 'object' || Object.keys(objetoCriterio).length !== 1) {
      throw 'el criterio para buscar el elemento a eliminar no tiene el formato correcto';
    }
    const criterio = Object.keys(objetoCriterio)[0];
    const encontrado = colecciones[coleccion].find(elemento => elemento[criterio] == objetoCriterio[criterio]);
    if (!encontrado) {
      throw 'no se ha encontrado en la BD el elemento a identificar';
    }
    if (!encontrado.password) {
      throw 'el elemento no tiene un campo de contraseña válido';
    }
    const passwordOK = await bcrypt.compare(password, encontrado.password);
    return {
      resultado: passwordOK
    };
  } catch (error) {
    return {
      error: 'Ha habido algún error en la función de identificar en la base de datos: ' + error
    };
  }
};

bd.identificarIdDis = async (coleccion, objetoCriterio, idDis) => { // La colección tiene que tener objetos con id Discord
  try {
    if (!colecciones[coleccion]) {
      throw 'colección no encontrada en la BD';
    }
    if (Array.isArray(objetoCriterio) || typeof objetoCriterio !== 'object' || Object.keys(objetoCriterio).length !== 1) {
      throw 'el criterio para buscar el elemento a eliminar no tiene el formato correcto';
    }
    const criterio = Object.keys(objetoCriterio)[0];

    const encontrado = colecciones[coleccion].find(elemento => elemento[criterio] == objetoCriterio[criterio]);
    console.log("ENCONTRADO", encontrado)
    if (!encontrado) {
      throw 'no se ha encontrado en la BD el elemento a identificar';
    }
    if (!encontrado.idDis) {
      throw 'el elemento no tiene un campo de contraseña válido';
    }
    const idDisOK = await bcrypt.compare(idDis, encontrado.idDis);
    return {
      resultado: idDisOK
    };
  } catch (error) {
    return {
      error: 'Ha habido algún error en la función de identificar en la base de datos: ' + error
    };
  }
};

bd.identificarIdTel = async (coleccion, objetoCriterio, idTel) => { // La colección tiene que tener objetos con id Telegram
  try {
    if (!colecciones[coleccion]) {
      throw 'colección no encontrada en la BD';
    }
    if (Array.isArray(objetoCriterio) || typeof objetoCriterio !== 'object' || Object.keys(objetoCriterio).length !== 1) {
      throw 'el criterio para buscar el elemento a eliminar no tiene el formato correcto';
    }
    const criterio = Object.keys(objetoCriterio)[0];
    const encontrado = colecciones[coleccion].find(elemento => elemento[criterio] == objetoCriterio[criterio]);
    if (!encontrado) {
      throw 'no se ha encontrado en la BD el elemento a identificar';
    }
    if (!encontrado.idTel) {
      throw 'el elemento no tiene un campo de contraseña válido';
    }
    const idTelOK = await bcrypt.compare(idTel, encontrado.idTel);
    return {
      resultado: idTelOK
    };
  } catch (error) {
    return {
      error: 'Ha habido algún error en la función de identificar en la base de datos: ' + error
    };
  }
};






module.exports = bd;