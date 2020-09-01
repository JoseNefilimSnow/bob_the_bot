var https = require('https');
module.exports = {

    diasPara: function (a, b) {
            var date1_ms = a.getTime();
            var date2_ms = b.getTime();
            var milisegundosPorDia = 1000 * 60 * 60 * 24;
            var dif_ms = date2_ms - date1_ms;
            return Math.round(dif_ms / milisegundosPorDia);
        }

        ,

    refactorDate: function (aux) {
        var caDate = new Date();

        let dias = caDate.setDate(aux.substring(0, 2));

        let mes = caDate.setMonth(String(Number(aux.substring(3, 5)) - 1));

        let año = caDate.setFullYear(aux.substring(6, aux.length));

        return caDate;
    }


}