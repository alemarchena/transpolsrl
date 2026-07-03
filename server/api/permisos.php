<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

switch ($action) {
  case "get":
    $res = $db->query("SELECT * FROM tpermisos ORDER BY id ASC");
    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
    break;

  case "insert":
    $nombre = $db->real_escape_string($data["nombre"]);
    $sql = "INSERT INTO tpermisos (nombre) VALUES ('$nombre')";
    echo json_encode(["success" => $db->query($sql)]);
    break;

  case "update":
    $id = (int)$data["id"];
    $nombre = $db->real_escape_string($data["nombre"]);
    $sql = "UPDATE tpermisos SET nombre = '$nombre' WHERE id = $id";
    echo json_encode(["success" => $db->query($sql)]);
    break;

  case "delete":
    $id = (int)$data["id"];
    // Verifica que no esté relacionado en tpermisos_detalle
    $check = $db->query("SELECT id FROM tpermisos_detalle WHERE idPermiso = $id LIMIT 1");
    if ($check->num_rows > 0) {
      echo json_encode(["success" => false, "error" => "El permiso tiene rutas asociadas"]);
    } else {
      $sql = "DELETE FROM tpermisos WHERE id = $id";
      echo json_encode(["success" => $db->query($sql)]);
    }
    break;

  default:
    echo json_encode(["error" => "Acción no válida"]);
    break;
}
