

 function obtenerSemanaSanta(año) {
    const a = año % 19;
    const b = año % 4;
    const c = año % 7;
    const d = (19 * a + 24) % 30;
    const dias = d + (2 * b + 4 * c + 6 * d + 5) % 7;

    let mes = 3;
    let dia = 15 + dias;
    if (dia > 31) {
        mes = 4;
        dia = dia - 31;
    }

    return new Date(año, mes - 1, dia);
}

function agregarDias(fecha, dias) {
    let fechaCalculada = new Date(fecha);
    fechaCalculada.setDate(fechaCalculada.getDate() + dias);
    return fechaCalculada;
}

function siguienteLunes(fecha) {
    let fechaCalculada = new Date(fecha);
    const diaSemana = fechaCalculada.getDay();
    if (diaSemana !== 1) {  
        fechaCalculada = agregarDias(fechaCalculada, 8 - diaSemana);
    }
    return fechaCalculada;
}

// 🎯 NUEVOS FESTIVOS BASADOS EN PASCUA (TIPO 3 Y 4)
function obtenerFestivosPascua(año) {
    const domingoRamos = obtenerSemanaSanta(año);
    const juevesSanto = agregarDias(domingoRamos, 4);
    const viernesSanto = agregarDias(domingoRamos, 5);
    const domingoPascua = agregarDias(domingoRamos, 7);
    const ascencion = siguienteLunes(agregarDias(domingoPascua, 40));
 
    const corpusChristi = siguienteLunes(agregarDias(domingoPascua, 61));
    const SantosReyes = siguienteLunes(new Date(año, 0, 6));
    const sanJose = siguienteLunes(new Date(año, 2, 19));

    return {
        "Domingo de Ramos": domingoRamos,
        "Jueves Santo": juevesSanto,
        "Viernes Santo": viernesSanto,
        "Domingo de Pascua": domingoPascua,
        "Ascencion del señor":ascencion,
        "Corpus Christi": corpusChristi,
        "Santos Reyes" : SantosReyes,
        "San José": sanJose,
       
    };
}

module.exports = {
    obtenerSemanaSanta,
    agregarDias,
    siguienteLunes,
    obtenerFestivosPascua
};

