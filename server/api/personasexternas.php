<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata, true);
$action = $request["action"] ?? '';

switch ($action) {
    case "get":
        $query = "SELECT id, nombre, apellido, whatsapp
                  FROM tpersonasexternas
                  ORDER BY apellido ASC, nombre ASC";
        $res = $conn->query($query);
        echo json_encode($res->fetch_all(MYSQLI_ASSOC));
        break;

    case "insert":
        $nombre = $conn->real_escape_string($request["nombre"]);
        $apellido = $conn->real_escape_string($request["apellido"]);
        $whatsapp = isset($request["whatsapp"]) ? $conn->real_escape_string($request["whatsapp"]) : '';
        
        $query = "INSERT INTO tpersonasexternas (nombre, apellido, whatsapp)
                  VALUES ('$nombre', '$apellido', '$whatsapp')";
        
        if ($conn->query($query)) {
            echo json_encode(["success" => true, "id" => $conn->insert_id]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        break;

    case "update":
        $id = (int) $request["id"];
        $nombre = $conn->real_escape_string($request["nombre"]);
        $apellido = $conn->real_escape_string($request["apellido"]);
        $whatsapp = isset($request["whatsapp"]) ? $conn->real_escape_string($request["whatsapp"]) : '';
        
        $query = "UPDATE tpersonasexternas 
                  SET nombre='$nombre', apellido='$apellido', whatsapp='$whatsapp' 
                  WHERE id=$id";
        
        if ($conn->query($query)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        break;

    case "delete":
        $id = (int) $request["id"];
        
        // Verificar si la persona está siendo usada en uso del vehículo
        $checkQuery = "SELECT COUNT(*) as total FROM tuso WHERE idPersona = $id";
        $checkResult = $conn->query($checkQuery);
        $checkData = $checkResult->fetch_assoc();
        
        if ($checkData['total'] > 0) {
            echo json_encode([
                "success" => false, 
                "error" => "No se puede eliminar esta persona porque tiene " . $checkData['total'] . " registro(s) en uso del vehículo."
            ]);
            break;
        }
        
        $query = "DELETE FROM tpersonasexternas WHERE id=$id";
        
        if ($conn->query($query)) {
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
