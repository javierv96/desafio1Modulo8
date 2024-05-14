// Función para manejar los errores de la base de datos
function errors(code, status, message) {
    switch (code) {
        case '28P01':
            status = 401;
            message = "autentificacion password falló o no existe el usuario";
            break;
        case '23505':
            status = 409;
            message = "El estudiante ya existe";
            break;
        case '42P01':
            status = 404;
            message = "La tabla referenciada en la consulta no existe en la base de datos";
            break;
        case '3D000':
            status = 404;
            message = "La Base de Datos utilizada no existe";
            break;
        case '28000':
            status = 401;
            message = "El rol utilizado no existe";
            break;
        case '42601':
            status = 400;
            message = "Error de sintaxis en la instruccion SQL";
            break;
        case '23503':
            status = 409;
            message = "Violacion de restriccion de clave externa";
            break;
        case '42703':
            status = 400;
            message = "Columna no encontrada";
            break;
        case '42P10':
            status = 400;
            message = "Duplicacion de tabla";
            break;
        case '42P15':
            status = 400;
            message = "Tipo de datos no encontrado";
            break;
        case '42501':
            status = 403;
            message = "Violacion de permisos";
            break;
        case '25006':
            status = 404;
            message = "Valor de secuencia no encontrado";
            break;
        case '26000':
            status = 500;
            message = "Error de interrupcion de transaccion";
            break;
        case 'ENOTFOUND':
            status = 500;
            message = "Error en valor usado como localhost";
            break;
        case 'ECONNREFUSED':
            status = 500;
            message = "Error en el puerto de conexion a BD";
            break;
        default:
            status = 500;
            message = "Error interno del servidor";
            break;
    }

    /*NOTA: Se implementaron errores comunes en aplicaciones tipo CRUD en ayuda y recomendacion de chatGPT siendo los siguientes:
        23503 = Violación de restricción de clave externa. Sucede cuando se intenta realizar una operación (por ejemplo, eliminar o actualizar) en una tabla que viola una restricción de clave externa.
        42703 = Columna no encontrada. Sucede cuando se intenta realizar una operación en una columna que no existe en la tabla especificada.
        42P10 = Duplicación de tabla. Ocurre cuando se intenta crear una tabla con el mismo nombre que una tabla existente.
        42P15 = Tipo de datos no encontrado. Se produce cuando se intenta crear una columna con un tipo de datos que no está definido en el sistema.
        42501 = Violación de permisos. Sucede cuando se intenta realizar una operación que el usuario no tiene permiso para realizar.
        25006 = Valor de secuencia no encontrado. Ocurre cuando se intenta acceder a una secuencia que no existe.
        26000 = Error de interrupción de transacción. Se produce cuando una transacción se cancela debido a un error.

        Fueron agregados a este archivo de errores con el fin de ser reutilizados a futuro en posibles proyectos que puedan presentar los errores anteriormente mencionados.
    */

    // Envío del mensaje de error
    console.error(message);

    // Retorno del estado y el mensaje de error
    return { code, status, message };
}

module.exports = errors;