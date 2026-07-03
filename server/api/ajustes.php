<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

switch ($action) {
  case "get":
    $filtros = [];
    if (!empty($data["fechaDesde"])) {
      $filtros[] = "a.fecha_hora >= '" . $conn->real_escape_string($data["fechaDesde"]) . "'";
    }
    if (!empty($data["fechaHasta"])) {
      $filtros[] = "a.fecha_hora <= '" . $conn->real_escape_string($data["fechaHasta"]) . " 23:59:59'";
    }
    if (!empty($data["idArticulo"])) {
      $filtros[] = "a.idArticulo = " . (int)$data["idArticulo"];
    }

    if (!empty($data["tipo"])) {
      $filtros[] = "a.tipo = '" . $conn->real_escape_string($data["tipo"]) . "'";
    }
    $where = count($filtros) ? "WHERE " . implode(" AND ", $filtros) : "";

    $sql = "SELECT a.*, t.nombre AS articulo, u.email AS usuario
            FROM tajustes a
            JOIN tarticulos t ON a.idArticulo = t.id
            JOIN tusuarios u ON a.email = u.email
            $where
            ORDER BY a.fecha_hora DESC";
    $res = $conn->query($sql);
    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
    break;

  case "insert":
    $idArticulo = (int)$data["idArticulo"];
    $tipo = $conn->real_escape_string($data["tipo"]);
    $cantidad = (float)$data["cantidad"];
    $motivo = $conn->real_escape_string($data["motivo"]);
    $email = $conn->real_escape_string($data["email"]);
    $esnuevo = isset($data["esnuevo"]) ? (int)$data["esnuevo"] : 0;

    $sql = "INSERT INTO tajustes (idArticulo, tipo, cantidad, motivo, email, esnuevo)
            VALUES ($idArticulo, '$tipo', $cantidad, '$motivo', '$email', $esnuevo)";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

  case "update":
    $id = (int)$data["id"];
    $idArticulo = (int)$data["idArticulo"];
    $tipo = $conn->real_escape_string($data["tipo"]);
    $cantidad = (float)$data["cantidad"];
    $motivo = $conn->real_escape_string($data["motivo"]);
    $esnuevo = isset($data["esnuevo"]) ? (int)$data["esnuevo"] : 0;

    $sql = "UPDATE tajustes
            SET idArticulo=$idArticulo, tipo='$tipo', cantidad=$cantidad, motivo='$motivo', esnuevo=$esnuevo
            WHERE id=$id";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

  case "delete":
    $id = (int)$data["id"];
    $sql = "DELETE FROM tajustes WHERE id=$id";
    echo json_encode(["success" => $conn->query($sql)]);
    break;
}
?>
