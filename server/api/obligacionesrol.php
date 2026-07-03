<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

switch ($action) {
    case "get":
        $sql = "SELECT o.id, o.idRol, r.nombre AS rolNombre, o.nombre, o.loTiene, o.vencimiento
                FROM tobligacionesrol o
                JOIN troles r ON o.idRol = r.id";
        $res = $conn->query($sql);
        echo json_encode($res->fetch_all(MYSQLI_ASSOC));
        break;

    case "insert":
        $idRol = $conn->real_escape_string($data["idRol"]);
        $nombre = $conn->real_escape_string($data["nombre"]);
        $loTiene = $conn->real_escape_string($data["loTiene"]);
        $vencimiento = $conn->real_escape_string($data["vencimiento"]);

        $sql = "INSERT INTO tobligacionesrol (idRol, nombre, loTiene, vencimiento)
                VALUES ($idRol, '$nombre', $loTiene, $vencimiento)";
        echo $conn->query($sql) ? "1" : "0";
        break;

    case "update":
        $id = $conn->real_escape_string($data["id"]);
        $idRol = $conn->real_escape_string($data["idRol"]);
        $nombre = $conn->real_escape_string($data["nombre"]);
        $loTiene = $conn->real_escape_string($data["loTiene"]);
        $vencimiento = $conn->real_escape_string($data["vencimiento"]);

        $sql = "UPDATE tobligacionesrol 
                SET idRol = $idRol, nombre = '$nombre', loTiene = $loTiene, vencimiento = $vencimiento
                WHERE id = $id";
        echo $conn->query($sql) ? "1" : "0";
        break;

    case "delete":
        $id = $conn->real_escape_string($data["id"]);
        $sql = "DELETE FROM tobligacionesrol WHERE id = $id";
        echo $conn->query($sql) ? "1" : "0";
        break;

    default:
        echo json_encode(["error" => "Acción no válida"]);
        break;
}
