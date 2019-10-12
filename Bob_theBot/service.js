module.exports ={

     diasPara: function (a, b) {
        var date1_ms = a.getTime();
        var date2_ms = b.getTime();
        var milisegundosPorDia = 1000 * 60 * 60 * 24;
        var dif_ms = date2_ms - date1_ms;
        return Math.round(dif_ms / milisegundosPorDia);
    }
    
    ,

     refactorDate: function(aux) {
        var caDate = new Date();
    
        let dias = caDate.setDate(aux.substring(0, 2));
    
        let mes = caDate.setMonth(String(Number(aux.substring(3, 5)) - 1));
    
        let año = caDate.setFullYear(aux.substring(6, aux.length));
    
        return caDate;
    }

    ,

     user: function(nombre) {
        let id = "";
        console.log(nombre)
        switch (nombre.replace("!", "").toLowerCase()) {
    
            case "yo":
            case "<@591398316726681630>":
                id = "591398316726681630";
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
            case "helena":
            case "<@588733361288118322>":
                id = "588733361288118322"
                break;
            default:
                id = "nadie";
                break;
        }
        return id;
    }

    ,

    revuser: function(id) {
        let nombre = "";
        console.log(id)
        switch (id) {
    
            case "<@591398316726681630>":
                nombre = "Bob";
                break;
    
            case "145964245773844481":
            case "<@145964245773844481>":
                nombre = "Jose";
                break;
    
            case "202816335602909184":
            case "<@202816335602909184>":
                nombre = "Alberto";
                break;
    
            case "222812719965929472":
            case "<@222812719965929472>":
                nombre = "Bryan";
                break;
    
            case "145281168911237121":
            case "<@145281168911237121>":
                nombre = "Yonay";
                break;
    
            case "145276289454964738":
            case "<@145276289454964738>":
                nombre = "Sure";
                break;
    
            case "332964222243962880":
            case "<@332964222243962880>":
                nombre = "Diego";
                break;
    
            case "145189017237848064":
            case "<@145189017237848064>":
                nombre = "Leo";
                break;
    
            case "377482733972357122":
            case "<@377482733972357122>":
                nombre = "Lya";
                break;
    
            case "260081879489708034":
            case "<@260081879489708034>":
                nombre = "Andrea";
                break;
    
            case "372549493247442947":
            case "<@372549493247442947>":
                nombre = "Javi";
                break;
            case "588733361288118322":
            case "<@588733361288118322>":
                nombre = "Helena"
                break;
        }
        return nombre;
    }
}