<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

switch ($action) {
  case "get":
    $sql = "SELECT tr.id, tr.idPersona, tr.idRol, tr.fecha_inicio, tr.activo,
                   CONCAT(tp.apellido, ', ', tp.nombre) AS persona,
                   trl.nombre AS rol
            FROM trrhh tr
            JOIN tpersonas tp ON tr.idPersona = tp.id
            JOIN troles trl ON tr.idRol = trl.id
            ORDER BY persona ASC";
    $res = $conn->query($sql);
    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
    break;

  case "insert":
    $idPersona = (int)($data["idPersona"] ?? 0);
    $idRol = (int)($data["idRol"] ?? 0);
    $fecha_inicio = $conn->real_escape_string($data["fecha_inicio"] ?? "");
    $activo = (int)($data["activo"] ?? 0);

    $sql = "INSERT INTO trrhh (idPersona, idRol, fecha_inicio, activo)
            VALUES ($idPersona, $idRol, '$fecha_inicio', $activo)";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

  case "update":
    $id = (int)($data["id"] ?? 0);
    $idPersona = (int)($data["idPersona"] ?? 0);
    $idRol = (int)($data["idRol"] ?? 0);
    $fecha_inicio = $conn->real_escape_string($data["fecha_inicio"] ?? "");
    $activo = (int)($data["activo"] ?? 0);

    $sql = "UPDATE trrhh
            SET idPersona = $idPersona,
                idRol = $idRol,
                fecha_inicio = '$fecha_inicio',
                activo = $activo
            WHERE id = $id";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

    case "delete":
        $id = (int)($data["id"] ?? 0);

        // Verificar si tiene vencimientos asociados
        $res = $conn->query("
            SELECT COUNT(*) AS total 
            FROM tvencimientos v
            INNER JOIN trrhh rr ON v.idPersona = rr.idPersona AND v.idRol = rr.idRol
            WHERE rr.id = $id
        ");
        $row = $res->fetch_assoc();
        if ((int)$row["total"] > 0) {
            echo json_encode([
                "success" => false,
                "error" => "No se puede eliminar: la asignación tiene vencimientos asociados."
            ]);
            exit;
        }

        // Si no tiene vencimientos asociados, eliminar
        $sql = "DELETE FROM trrhh WHERE id = $id";
        echo json_encode(["success" => $conn->query($sql)]);
        break;


  default:
    http_response_code(400);
    echo json_encode(["error" => "Acción no válida"]);
    break;
}
