<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata, true);
$action = $request["action"] ?? '';

switch ($action) {
    case "get":
        // Si mostrarInactivos es true, trae todos; si es false, solo activos (inactivo = 0)
        $mostrarInactivos = isset($request["mostrar_inactivos"]) && $request["mostrar_inactivos"] === true;
        
        $query = "SELECT DISTINCT p.legajo, p.id, p.nombre, p.apellido, p.dni, p.nacimiento, p.sexo, 
                         p.direccion, p.whatsapp, p.fecha_ingreso, p.id_empresa, p.inactivo,
                         e.razon_social as empresa_nombre
                  FROM tpersonas p
                  LEFT JOIN tempresas e ON p.id_empresa = e.id";
        
        if (!$mostrarInactivos) {
            $query .= " WHERE p.inactivo = 0"; // Solo activos
        }
        
        $query .= " ORDER BY p.inactivo ASC, p.apellido ASC"; // Activos primero
        $res = $conn->query($query);
        echo json_encode($res->fetch_all(MYSQLI_ASSOC));
        break;

    case "getEmpresas":
        $query = "SELECT id, razon_social FROM tempresas ORDER BY razon_social ASC";
        $res = $conn->query($query);
        echo json_encode($res->fetch_all(MYSQLI_ASSOC));
        break;

    case "insert":
        $legajo = $conn->real_escape_string($request["legajo"]);
        $dni = $conn->real_escape_string($request["dni"]);
        $nombre = $conn->real_escape_string($request["nombre"]);
        $apellido = $conn->real_escape_string($request["apellido"]);
        $nacimiento = $conn->real_escape_string($request["nacimiento"]);
        $sexo = $conn->real_escape_string($request["sexo"]);
        $direccion = $conn->real_escape_string($request["direccion"]);
        $whatsapp = $conn->real_escape_string($request["whatsapp"]);
        $fecha_ingreso = $conn->real_escape_string($request["fecha_ingreso"]);
        $id_empresa = !empty($request["id_empresa"]) ? (int)$request["id_empresa"] : null;
        // Por defecto es 0 (activo), solo si viene explicitamente 1 se pone inactivo
        $inactivo = isset($request["inactivo"]) ? (int)$request["inactivo"] : 0;

        $query = "INSERT INTO tpersonas (legajo, dni, nombre, apellido, nacimiento, sexo, direccion, whatsapp, fecha_ingreso, id_empresa, inactivo)
                  VALUES ('$legajo','$dni', '$nombre', '$apellido', '$nacimiento', '$sexo', '$direccion', '$whatsapp', '$fecha_ingreso', " . 
                  ($id_empresa ? $id_empresa : "NULL") . ", $inactivo)";
        echo json_encode(["success" => $conn->query($query)]);
        break;

    case "update":
        $id = (int) $request["id"];
        $legajo = $conn->real_escape_string($request["legajo"]);
        $dni = $conn->real_escape_string($request["dni"]);
        $nombre = $conn->real_escape_string($request["nombre"]);
        $apellido = $conn->real_escape_string($request["apellido"]);
        $nacimiento = $conn->real_escape_string($request["nacimiento"]);
        $sexo = $conn->real_escape_string($request["sexo"]);
        $direccion = $conn->real_escape_string($request["direccion"]);
        $whatsapp = $conn->real_escape_string($request["whatsapp"]);
        $fecha_ingreso = $conn->real_escape_string($request["fecha_ingreso"]);
        $id_empresa = !empty($request["id_empresa"]) ? (int)$request["id_empresa"] : null;
        $inactivo = isset($request["inactivo"]) ? (int)$request["inactivo"] : 0;

        $query = "UPDATE tpersonas 
                  SET legajo='$legajo', dni='$dni', nombre='$nombre', apellido='$apellido', nacimiento='$nacimiento', 
                      sexo='$sexo', direccion='$direccion', whatsapp='$whatsapp', fecha_ingreso='$fecha_ingreso',
                      id_empresa=" . ($id_empresa ? $id_empresa : "NULL") . ",
                      inactivo=$inactivo
                  WHERE id=$id";
        echo json_encode(["success" => $conn->query($query)]);
        break;

    case "updateEmpresa":
        $id = (int) $request["id"];
        $id_empresa = !empty($request["id_empresa"]) ? (int)$request["id_empresa"] : null;
        
        $query = "UPDATE tpersonas SET id_empresa=" . ($id_empresa ? $id_empresa : "NULL") . " WHERE id=$id";
        $result = $conn->query($query);
        
        if ($result) {
            $queryPersona = "SELECT p.*, e.razon_social as empresa_nombre 
                            FROM tpersonas p 
                            LEFT JOIN tempresas e ON p.id_empresa = e.id 
                            WHERE p.id = $id";
            $resPersona = $conn->query($queryPersona);
            $persona = $resPersona->fetch_assoc();
            
            echo json_encode(["success" => true, "persona" => $persona]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        break;

    case "toggleInactivo":
        $id = (int) $request["id"];
        // Si actualmente es 1 (inactivo) lo paso a 0 (activo), si es 0 lo paso a 1 (inactivo)
        $nuevoEstado = isset($request["nuevo_estado"]) ? (int)$request["nuevo_estado"] : null;
        
        if ($nuevoEstado !== null) {
            $query = "UPDATE tpersonas SET inactivo = $nuevoEstado WHERE id = $id";
        } else {
            // Toggle automático
            $query = "UPDATE tpersonas SET inactivo = NOT inactivo WHERE id = $id";
        }
        
        $result = $conn->query($query);
        
        if ($result) {
            $mensaje = $nuevoEstado === 1 ? "Persona desactivada" : ($nuevoEstado === 0 ? "Persona activada" : "Estado actualizado");
            echo json_encode(["success" => true, "message" => $mensaje]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        break;

    case "delete":
        $id = (int) $request["id"];
        
        // Verificar si la persona tiene bonos asociados
        $checkBonosQuery = "SELECT COUNT(*) as total_bonos, 
                               GROUP_CONCAT(CONCAT(mes, ' ', anio) SEPARATOR ', ') as bonos_detalle
                        FROM tpersonasbonos 
                        WHERE idPersona = $id";
        $checkBonosRes = $conn->query($checkBonosQuery);
        $checkBonos = $checkBonosRes->fetch_assoc();
        
        if ($checkBonos['total_bonos'] > 0) {
            $mensaje = "No se puede eliminar la persona porque tiene " . $checkBonos['total_bonos'] . " bono(s) asociado(s): " . $checkBonos['bonos_detalle'] . ". ";
            $mensaje .= "Primero debe eliminar los bonos de esta persona desde la administración de bonos.";
            echo json_encode(["success" => false, "error" => $mensaje]);
            break;
        }
        
        $query = "DELETE FROM tpersonas WHERE id=$id";
        $result = $conn->query($query);
        
        if ($result) {
            echo json_encode(["success" => true, "message" => "Persona eliminada correctamente"]);
        } else {
            echo json_encode(["success" => false, "error" => "Error en la base de datos: " . $conn->error]);
        }
        break;

    default:
        echo json_encode(["error" => "Acción no válida"]);
        break;
}
?>