<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata, true);
$action = $request["action"] ?? '';

switch ($action) {
    case "get":
        $idVehiculo = isset($request["idVehiculo"]) ? (int)$request["idVehiculo"] : 0;

        $sql = "
            SELECT 
                o.id AS idObligacionVehiculo,
                o.nombre,
                o.tieneVencimiento,
                vv.id AS idVencimiento,
                vv.loTiene,
                vv.fecha
            FROM tvencimientosvehiculos vv
            INNER JOIN tobligacionesvehiculo o 
                ON vv.idObligacionVehiculo = o.id
            WHERE vv.idVehiculo = $idVehiculo
            ORDER BY o.nombre ASC
        ";
        $res = $conn->query($sql);
        echo json_encode($res->fetch_all(MYSQLI_ASSOC));
        break;


    case "insert":
        $idVehiculo = (int)$conn->real_escape_string($request["idVehiculo"] ?? 0);
        $idObligacionVehiculo = (int)$conn->real_escape_string($request["idObligacionVehiculo"] ?? 0);
        $loTiene = (int)$conn->real_escape_string($request["lotiene"] ?? 0);
        $fecha = $conn->real_escape_string($request["fecha"] ?? null);

        $sql = "
            INSERT INTO tvencimientosvehiculos (idVehiculo, idObligacionVehiculo, lotiene, fecha)
            VALUES ($idVehiculo, $idObligacionVehiculo, $loTiene, " . ($fecha ? "'$fecha'" : "NULL") . ")
        ";
        echo json_encode(["success" => $conn->query($sql)]);
        break;

    case "update":
        $id = (int)$conn->real_escape_string($request["id"] ?? 0);
        $loTiene = isset($request["loTiene"]) ? (int)$request["loTiene"] : 0;
        $fecha = $conn->real_escape_string($request["fecha"] ?? null);

        $sql = "
            UPDATE tvencimientosvehiculos
            SET lotiene = $loTiene,
                fecha = " . ($fecha ? "'$fecha'" : "NULL") . "
            WHERE id = $id
        ";
        echo json_encode(["success" => $conn->query($sql)]);
        break;

    case "delete":
        $id = (int)$conn->real_escape_string($request["id"] ?? 0);
        $sql = "DELETE FROM tvencimientosvehiculos WHERE id = $id";
        echo json_encode(["success" => $conn->query($sql)]);
        break;
    case "aplicarASeleccionados":
        $idObligacionVehiculo = (int)($request["idObligacionVehiculo"] ?? 0);
        $fecha = $conn->real_escape_string($request["fecha"] ?? null);
        $idsVehiculos = $request["idsVehiculos"] ?? [];

        $success = true;

        foreach ($idsVehiculos as $idVehiculo) {
            $idVehiculo = (int)$idVehiculo;

            // Verificar si ya existe
            $check = $conn->query("
                SELECT id FROM tvencimientosvehiculos
                WHERE idVehiculo = $idVehiculo AND idObligacionVehiculo = $idObligacionVehiculo
            ");

            if ($check->num_rows > 0) {
                $idExistente = $check->fetch_assoc()["id"];
                $update = $conn->query("
                    UPDATE tvencimientosvehiculos
                    SET loTiene = 1, fecha = " . ($fecha ? "'$fecha'" : "NULL") . "
                    WHERE id = $idExistente
                ");
                if (!$update) $success = false;
            } else {
                $insert = $conn->query("
                    INSERT INTO tvencimientosvehiculos (idVehiculo, idObligacionVehiculo, loTiene, fecha)
                    VALUES ($idVehiculo, $idObligacionVehiculo, 1, " . ($fecha ? "'$fecha'" : "NULL") . ")
                ");
                if (!$insert) $success = false;
            }
        }

        echo json_encode(["success" => $success]);
        break;

    default:
        echo json_encode(["error" => "Acción no válida"]);
        break;
}
