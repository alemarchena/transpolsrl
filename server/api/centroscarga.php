<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

switch ($action) {
  case "get":
    $res = $conn->query("SELECT * FROM tcentrosdecarga ORDER BY nombrecentro");
    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
    break;

  case "insert":
    $nombrecentro = $conn->real_escape_string($data['nombrecentro'] ?? '');
    $direccioncentro = $conn->real_escape_string($data['direccioncentro'] ?? '');
    
    $sql = "INSERT INTO tcentrosdecarga (nombrecentro, direccioncentro) VALUES ('$nombrecentro', '$direccioncentro')";
    echo json_encode(['success' => $conn->query($sql)]);
    break;

  case "update":
    $idcentro = (int)($data['idcentro'] ?? 0);
    $nombrecentro = $conn->real_escape_string($data['nombrecentro'] ?? '');
    $direccioncentro = $conn->real_escape_string($data['direccioncentro'] ?? '');
    
    $sql = "UPDATE tcentrosdecarga SET nombrecentro = '$nombrecentro', direccioncentro = '$direccioncentro' WHERE idcentro = $idcentro";
    echo json_encode(['success' => $conn->query($sql)]);
    break;

  case "delete":
    $idcentro = (int)($data['idcentro'] ?? 0);
    $sql = "DELETE FROM tcentrosdecarga WHERE idcentro = $idcentro";
    echo json_encode(['success' => $conn->query($sql)]);
    break;

  default:
    http_response_code(400);
    echo json_encode(['error' => 'Acción no válida']);
    break;
}
?>
