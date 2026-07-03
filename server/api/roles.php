<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

switch ($action) {
  case "get":
    $res = $conn->query("SELECT * FROM troles ORDER BY nombre ASC");
    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
    break;

  case "insert":
    $nombre = $conn->real_escape_string($data["nombre"] ?? "");
    $sql = "INSERT INTO troles (nombre) VALUES ('$nombre')";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

  case "update":
    $id = (int)($data["id"] ?? 0);
    $nombre = $conn->real_escape_string($data["nombre"] ?? "");
    $sql = "UPDATE troles SET nombre = '$nombre' WHERE id = $id";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

  case "delete":
    $id = (int)($data["id"] ?? 0);

    $check = $conn->query("SELECT COUNT(*) AS total FROM trrhh WHERE idRol = $id");
    $count = $check->fetch_assoc()["total"];

    if ($count > 0) {
      echo json_encode([
        "success" => false,
        "error" => "No se puede eliminar el rol porque está asignado a una o más personas."
      ]);
      break;
    }

    $sql = "DELETE FROM troles WHERE id = $id";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

  default:
    http_response_code(400);
    echo json_encode(["error" => "Acción no válida"]);
    break;
}
