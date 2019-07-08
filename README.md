# CountDownBob
### Aplicación de Discord||Bot de cuentas atrás

![Bob](https://i.imgur.com/7mmWmFA.jpg)

## Descripción Breve:

Bob es una aplicación de discord que usando comandos enviados por chat para seguir una serie de acciones

## Como funciona

Entre otros pequeños "Easter Eggs" o "Referencias" Bob cuenta con los siguientes comandos seguidos siempre del prefijo "." : 

ping: muestra el ping con  Bob , y por extension cuanto lag se tiene con el ordenador principal. :space_invader:
 
 seeallca: muestra todas las cuentas atras existentes. :bookmark:
 
 setca + 'nombre de cuenta atras' + 'categoria' + fecha de cuenta atras(dia/mes/año): construyes una cuenta atras con un nombre y la fecha a la que quieres que llegue contando.:alarm_clock:
 
 see + 'nombre de cuenta atras':  muestra la fecha de esa cuenta atras.:date:
 
 cuantoquedapara + 'nombre de cuenta atras': muestra cuantos dias quedan para que llegue la fecha. :eyeglasses:
 
 vercumple: muestra todos los cumpleaños que se :tada:
 
 verevento: muestra todos los eventos que me has contado :pencil:
 
 tiradados + numero de dados + nº de caras: imprime un numero entre 1 y el numero pasado como parametro de numero de caras :game_die:
 
 actualizarcumples: atualiza la lista de cumpleaños almacenada a fechas más correctas 
 (se realiza cada vez que se inicia el ordenador) :gift:
 
 limpia: borra hasta 99 mensajes del chat actual
 
 Las categorias son: 
 
 evento: es puntual por lo que no se llevara mucho control 
 
 cumple: se auto incrementa cada año al llegar la fecha

Bob almacena objetos JSON con los campos necesarios!

## Cuaderno de batalla

Existen algunos casos que se deben tratar como que el bot pueda llamar a sus propios metodos o el prefijo no se encuentre en la posición inicial para que funcionen los comandos pero estos dos casos han sido arreglados.

Se requiere la adición del envio de un mensaje cuando exista un cambio de estado en los chats de voz