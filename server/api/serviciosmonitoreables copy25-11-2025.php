<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

switch ($action) {
  case "get":
    $res = $conn->query("SELECT * FROM tserviciosmonitoreables ORDER BY nombre");
    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
    break;

  case "insert":
    $nombre = $conn->real_escape_string($data['nombre'] ?? '');
    
    $sql = "INSERT INTO tserviciosmonitoreables (nombre) VALUES ('$nombre')";
    echo json_encode(['success' => $conn->query($sql)]);
    break;

  case "update":
    $id = (int)($data['id'] ?? 0);
    $nombre = $conn->real_escape_string($data['nombre'] ?? '');
    
    $sql = "UPDATE tserviciosmonitoreables SET nombre = '$nombre' WHERE id = $id";
    echo json_encode(['success' => $conn->query($sql)]);
    break;

  case "delete":
    $id = (int)($data['id'] ?? 0);
    $sql = "DELETE FROM tserviciosmonitoreables WHERE id = $id";
    echo json_encode(['success' => $conn->query($sql)]);
    break;

  default:
    http_response_code(400);
    echo json_encode(['error' => 'Acción no válida']);
    break;
}
?>
