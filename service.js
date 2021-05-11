var https = require('https');
module.exports = {

    diasPara: function (dateToSeek) {
            var today_ms = new Date().getTime();
            var date2_ms = dateToSeek.getTime();
            var milisegundosPorDia = 1000 * 60 * 60 * 24;
            var dif_ms = date2_ms - today_ms;
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