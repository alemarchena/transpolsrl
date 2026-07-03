<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

switch ($action) {
  case "get":
    $res = $conn->query("SELECT * FROM ttipocombustible ORDER BY nombrecombustible");
    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
    break;

  case "insert":
    $nombrecombustible = $conn->real_escape_string($data['nombrecombustible'] ?? '');
    
    $sql = "INSERT INTO ttipocombustible (nombrecombustible) VALUES ('$nombrecombustible')";
    echo json_encode(['success' => $conn->query($sql)]);
    break;

  case "update":
    $idtipo = (int)($data['idtipo'] ?? 0);
    $nombrecombustible = $conn->real_escape_string($data['nombrecombustible'] ?? '');
    
    $sql = "UPDATE ttipocombustible SET nombrecombustible = '$nombrecombustible' WHERE idtipo = $idtipo";
    echo json_encode(['success' => $conn->query($sql)]);
    break;

  case "delete":
    $idtipo = (int)($data['idtipo'] ?? 0);
    $sql = "DELETE FROM ttipocombustible WHERE idtipo = $idtipo";
    echo json_encode(['success' => $conn->query($sql)]);
    break;

  default:
    http_response_code(400);
    echo json_encode(['error' => 'Acción no válida']);
    break;
}
?>
