<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

switch ($action) {
  case "get":
    $filtros = [];
    if (!empty($data["fechaDesde"])) {
      $filtros[] = "S.fecha_servicio >= '" . $conn->real_escape_string($data["fechaDesde"]) . "'";
    }
    if (!empty($data["fechaHasta"])) {
      $filtros[] = "S.fecha_servicio <= '" . $conn->real_escape_string($data["fechaHasta"]) . " 23:59:59'";
    }
    if (!empty($data["idVehiculo"])) {
      $filtros[] = "S.idVehiculo = " . (int)$data["idVehiculo"];
    }
    if (!empty($data["idArticulo"])) {
      $filtros[] = "S.idArticulo = " . (int)$data["idArticulo"];
    }

    $where = count($filtros) ? "WHERE " . implode(" AND ", $filtros) : "";
    $pagina = isset($data["pagina"]) ? max(1, (int)$data["pagina"]) : 1;
    $limite = 20;
    $offset = ($pagina - 1) * $limite;

    $sql_total = "SELECT COUNT(*) FROM tserviciosvehiculo S $where";
    $total = $conn->query($sql_total)->fetch_row()[0];
    $totalPaginas = ceil($total / $limite);

    $sql = "
      SELECT S.id, S.idVehiculo, S.idArticulo, S.cantidad, S.kmRecorridos, S.dniPersona, 
             S.fecha_servicio, S.descripcion, S.totalitemservicio, S.idserviciomonitoreable,
             V.patente, V.marca, V.modelo, V.numerointerno,
             A.nombre AS nombreArticulo, C.nombre AS categoria,
             P.nombre AS nombrePersona, P.apellido,
             SM.nombre AS nombreServicioMonitoreable
      FROM tserviciosvehiculo S
      JOIN tvehiculos V ON S.idVehiculo = V.id
      JOIN tarticulos A ON S.idArticulo = A.id
      JOIN tcategorias C ON A.idCategoria = C.id
      JOIN tpersonas P ON S.dniPersona = P.dni
      LEFT JOIN tserviciosmonitoreables SM ON S.idserviciomonitoreable = SM.id
      $where
      ORDER BY S.fecha_servicio DESC
      LIMIT $limite OFFSET $offset
    ";
    $res = $conn->query($sql);
    echo json_encode([
      "datos" => $res->fetch_all(MYSQLI_ASSOC),
      "totalPaginas" => $totalPaginas
    ]);
    break;

  case "insert":
    $idVehiculo = (int)$data["idVehiculo"];
    $idArticulo = (int)$data["idArticulo"];
    $cantidad = (float)$data["cantidad"];
    $kmRecorridos = isset($data["kmRecorridos"]) ? (int)$data["kmRecorridos"] : -1;
    $dniPersona = $conn->real_escape_string($data["dniPersona"] ?? "");
    $descripcion = $conn->real_escape_string($data["descripcion"] ?? "");
    $totalitemservicio = isset($data["totalitemservicio"]) ? (float)$data["totalitemservicio"] : 0;
    $fecha_servicio = $conn->real_escape_string($data["fecha_servicio"] ?? date("Y-m-d H:i:s"));
    $idserviciomonitoreable = isset($data["idserviciomonitoreable"]) ? (int)$data["idserviciomonitoreable"] : 0;

    if ($kmRecorridos < 0) {
      echo json_encode(["success" => false, "error" => "El campo Km Recorridos es obligatorio"]);
      exit;
    }

    $sql = "
      INSERT INTO tserviciosvehiculo (idVehiculo, idArticulo, cantidad, kmRecorridos, dniPersona, fecha_servicio, descripcion, totalitemservicio, idserviciomonitoreable)
      VALUES ($idVehiculo, $idArticulo, $cantidad, $kmRecorridos, '$dniPersona', '$fecha_servicio', '$descripcion', $totalitemservicio, $idserviciomonitoreable)
    ";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

  case "update":
    $id = (int)$data["id"];
    $idVehiculo = (int)$data["idVehiculo"];
    $idArticulo = (int)$data["idArticulo"];
    $cantidad = (float)$data["cantidad"];
    $kmRecorridos = isset($data["kmRecorridos"]) ? (int)$data["kmRecorridos"] : -1;
    $dniPersona = $conn->real_escape_string($data["dniPersona"] ?? "");
    $descripcion = $conn->real_escape_string($data["descripcion"] ?? "");
    $totalitemservicio = isset($data["totalitemservicio"]) ? (float)$data["totalitemservicio"] : 0;
    $fecha_servicio = $conn->real_escape_string($data["fecha_servicio"] ?? date("Y-m-d H:i:s"));
    $idserviciomonitoreable = isset($data["idserviciomonitoreable"]) ? (int)$data["idserviciomonitoreable"] : 0;

    if ($kmRecorridos < 0) {
      echo json_encode(["success" => false, "error" => "El campo Km Recorridos es obligatorio"]);
      exit;
    }

    $sql = "
      UPDATE tserviciosvehiculo
      SET idVehiculo = $idVehiculo,
          idArticulo = $idArticulo,
          cantidad = $cantidad,
          kmRecorridos = $kmRecorridos,
          dniPersona = '$dniPersona',
          fecha_servicio = '$fecha_servicio',
          descripcion = '$descripcion',
          totalitemservicio = $totalitemservicio,
          idserviciomonitoreable = $idserviciomonitoreable
      WHERE id = $id
    ";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

  case "delete":
    $id = (int)$data["id"];
    $sql = "DELETE FROM tserviciosvehiculo WHERE id = $id";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

  case "obtenerUltimoPrecio":
    $idArticulo = (int)$data["idArticulo"];
    $sql = "
      SELECT cd.precio_unitario
      FROM tcompras_detalle cd
      JOIN tcompras_encabezado ce ON cd.idCompra = ce.id
      WHERE cd.idArticulo = $idArticulo
      ORDER BY ce.fecha DESC
      LIMIT 1
    ";
    $res = $conn->query($sql);
    if ($res && $res->num_rows > 0) {
      $row = $res->fetch_assoc();
      echo json_encode(["success" => true, "precio" => $row["precio_unitario"]]);
    } else {
      echo json_encode(["success" => false, "precio" => null]);
    }
    break;

  default:
    echo json_encode(["error" => "Acción no válida"]);
}
?>
