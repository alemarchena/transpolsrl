<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

switch ($action) {
  case "get":
    $res = $conn->query("SELECT * FROM tcategorias ORDER BY nombre ASC");
    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
    break;

  case "insert":
    $nombre = $conn->real_escape_string($data["nombre"] ?? "");
    $descripcion = $conn->real_escape_string($data["descripcion"] ?? "");
    $sql = "INSERT INTO tcategorias (nombre, descripcion) VALUES ('$nombre', '$descripcion')";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

  case "update":
    $id = (int)($data["id"] ?? 0);
    $nombre = $conn->real_escape_string($data["nombre"] ?? "");
    $descripcion = $conn->real_escape_string($data["descripcion"] ?? "");
    $sql = "UPDATE tcategorias 
            SET nombre = '$nombre', descripcion = '$descripcion' 
            WHERE id = $id";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

  case "delete":
    $id = $conn->real_escape_string($data['id']);

    // Validar si la categoría está asignada a algún artículo
    $check = $conn->query("SELECT COUNT(*) as total FROM tarticulos WHERE idCategoria = '$id'");
    $row = $check->fetch_assoc();

    if ($row['total'] > 0) {
        echo json_encode([
            "success" => false,
            "error" => "No se puede eliminar la categoría porque está asignada a uno o más artículos."
        ]);
        exit;
    }

    // Si no está asignada, eliminarla
    $delete = $conn->query("DELETE FROM tcategorias WHERE id = '$id'");
    echo json_encode(["success" => $delete]);
    break;


  default:
    http_response_code(400);
    echo json_encode(["error" => "Acción no válida"]);
    break;
}
