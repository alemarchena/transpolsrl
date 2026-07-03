<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata, true);
$action = $request["action"] ?? '';

switch ($action) {
    case "get":
        $res = $conn->query("SELECT * FROM tobligacionesvehiculo ORDER BY nombre ASC");
        echo json_encode($res->fetch_all(MYSQLI_ASSOC));
        break;

    case "insert":
        $nombre = $conn->real_escape_string($request["nombre"] ?? '');
        $loTiene = isset($request["loTiene"]) ? (int)$request["loTiene"] : 0;
        $tieneVencimiento = isset($request["tieneVencimiento"]) ? (int)$request["tieneVencimiento"] : 0;

        $query = "INSERT INTO tobligacionesvehiculo (nombre, lotiene, tienevencimiento) VALUES ('$nombre', $loTiene, $tieneVencimiento)";
        echo json_encode(["success" => $conn->query($query)]);
        break;

    case "update":
        $id = (int)($request["id"] ?? 0);
        $nombre = $conn->real_escape_string($request["nombre"] ?? '');
        $loTiene = isset($request["loTiene"]) ? (int)$request["loTiene"] : 0;
        $tieneVencimiento = isset($request["tieneVencimiento"]) ? (int)$request["tieneVencimiento"] : 0;

        $query = "UPDATE tobligacionesvehiculo SET nombre = '$nombre', lotiene = $loTiene, tienevencimiento = $tieneVencimiento WHERE id = $id";
        echo json_encode(["success" => $conn->query($query)]);
        break;

    case "delete":
        $id = (int)($request["id"] ?? 0);
        $query = "DELETE FROM tobligacionesvehiculo WHERE id = $id";
        echo json_encode(["success" => $conn->query($query)]);
        break;

    default:
        echo json_encode(["error" => "Acción no válida"]);
        break;
}
