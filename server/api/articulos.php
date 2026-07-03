<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

switch ($action) {
  case "get":
    $res = $conn->query("SELECT A.*, C.nombre AS categoria 
                         FROM tarticulos A
                         LEFT JOIN tcategorias C ON A.idCategoria = C.id");
    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
    break;

  case "insert":
    $nombre     = $conn->real_escape_string($data["nombre"] ?? "");
    $descripcion= $conn->real_escape_string($data["descripcion"] ?? "");
    $idCategoria= (int)($data["idCategoria"] ?? "NULL");
    $stock_min  = (float)($data["stock_minimo"] ?? 0);

    $sql = "INSERT INTO tarticulos (nombre, descripcion, idCategoria, stock_minimo) 
            VALUES ('$nombre', '$descripcion', $idCategoria, $stock_min)";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

  case "update":
    $id         = (int)($data["id"] ?? 0);
    $nombre     = $conn->real_escape_string($data["nombre"] ?? "");
    $descripcion= $conn->real_escape_string($data["descripcion"] ?? "");
    $idCategoria= (int)($data["idCategoria"] ?? "NULL");
    $stock_min  = (float)($data["stock_minimo"] ?? 0);

    $sql = "UPDATE tarticulos 
            SET nombre = '$nombre', descripcion = '$descripcion', 
                idCategoria = $idCategoria, stock_minimo = $stock_min
            WHERE id = $id";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

  case "delete":
    $id = (int)($data["id"] ?? 0);
    $sql = "DELETE FROM tarticulos WHERE id = $id";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

  default:
    http_response_code(400);
    echo json_encode(["error" => "Acción no válida"]);
    break;
}
