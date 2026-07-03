<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata, true);
$action = $request["action"] ?? "";

switch ($action) {
    case "get":
        $sql = "
            SELECT av.id, av.idVehiculo, av.idObligacionVehiculo, 
                   v.patente,v.numerointerno, v.marca,o.nombre as obligacion
            FROM tvencimientosvehiculos av
            JOIN tvehiculos v ON av.idVehiculo = v.id
            JOIN tobligacionesvehiculo o ON av.idObligacionVehiculo = o.id
            ORDER BY v.patente ASC, o.nombre ASC
        ";
        $res = $conn->query($sql);
        echo json_encode($res->fetch_all(MYSQLI_ASSOC));
        break;

    case "insert":
        $idVehiculo = (int)$request["idVehiculo"];
        $idObligacionVehiculo = (int)$request["idObligacionVehiculo"];

        // Validación de duplicados
        $check = $conn->query("
            SELECT id FROM tvencimientosvehiculos 
            WHERE idVehiculo = $idVehiculo AND idObligacionVehiculo = $idObligacionVehiculo
        ");
        if ($check->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "Ya existe la asignación"]);
            break;
        }

        $query = "
            INSERT INTO tvencimientosvehiculos (idVehiculo, idObligacionVehiculo)
            VALUES ($idVehiculo, $idObligacionVehiculo)
        ";
        echo json_encode(["success" => $conn->query($query)]);
        break;

    case "delete":
        $id = (int)$request["id"];
        $query = "DELETE FROM tvencimientosvehiculos WHERE id = $id";
        echo json_encode(["success" => $conn->query($query)]);
        break;
    case "asignarATodos":
        $idObligacionVehiculo = (int)$request["idObligacionVehiculo"];
        
        // Obtener todos los vehículos
        $vehiculosRes = $conn->query("SELECT id FROM tvehiculos");
        $vehiculos = $vehiculosRes->fetch_all(MYSQLI_ASSOC);

        $success = true;
        foreach ($vehiculos as $vehiculo) {
            $idVehiculo = (int)$vehiculo["id"];

            // Verificar duplicado
            $check = $conn->query("
                SELECT id FROM tvencimientosvehiculos 
                WHERE idVehiculo = $idVehiculo AND idObligacionVehiculo = $idObligacionVehiculo
            ");
            if ($check->num_rows === 0) {
                $insert = $conn->query("
                    INSERT INTO tvencimientosvehiculos (idVehiculo, idObligacionVehiculo)
                    VALUES ($idVehiculo, $idObligacionVehiculo)
                ");
                if (!$insert) {
                    $success = false;
                }
            }
        }
        echo json_encode(["success" => $success]);
    break;

    case "eliminarDeTodos":
        $idObligacionVehiculo = (int)$request["idObligacionVehiculo"];
        $query = "
            DELETE FROM tvencimientosvehiculos 
            WHERE idObligacionVehiculo = $idObligacionVehiculo
        ";
        echo json_encode(["success" => $conn->query($query)]);
        break;

    default:
        echo json_encode(["success" => false, "message" => "Acción no válida"]);
        break;
}
