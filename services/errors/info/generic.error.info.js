export const invalidId = (id, type)=>`El ID indicado no es valido, se espera un ${type} y se obtuvo un ${typeof id}`;

export const idCantChange = ()=>`El ID no puede ser alterado`;

export const missingData = (given, expected)=>{
    let message = `Uno o mas datos no fueron indicados.
    Listado de datos requeridos:`

    for(const prop in expected){
        message += `* ${prop}: Se esperaba ${typeof expected[prop]}, se recibio ${typeof given[prop]}`;
    }

    return message;
}