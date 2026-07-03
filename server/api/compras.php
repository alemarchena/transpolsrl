<?php
require_once("../config/headers.php");
require_once("../config/db.php");

header('Content-Type: application/json; charset=utf-8');
$post = json_decode(file_get_contents("php://input"), true);
$action = $post["action"] ?? "";

switch ($action) {
  case "get":
    $condiciones = [];

    if (!empty($post['fechaDesde'])) {
      $desde = $conn->real_escape_string(substr($post['fechaDesde'], 0, 10));
      $condiciones[] = "DATE(ce.fecha) >= '$desde'";
    }

    if (!empty($post['fechaHasta'])) {
      $hasta = $conn->real_escape_string(substr($post['fechaHasta'], 0, 10));
      $condiciones[] = "DATE(ce.fecha) <= '$hasta'";
    }

    if (!empty($post['tipo_factura'])) {
      $condiciones[] = "ce.tipo_factura = '" . $conn->real_escape_string($post['tipo_factura']) . "'";
    }

    if (!empty($post['nro_factura'])) {
      $condiciones[] = "ce.nro_factura LIKE '%" . $conn->real_escape_string($post['nro_factura']) . "%'";
    }

    $whereClause = count($condiciones) > 0 ? "WHERE " . implode(" AND ", $condiciones) : "";

    $query = "SELECT 
                ce.id,
                ce.fecha,
                ce.tipo_factura,
                ce.nro_factura,
                p.razon_social AS proveedor,
                u.email AS usuario,
                cd.id AS idDetalle,
                cd.idArticulo,
                a.nombre AS articulo,
                cd.cantidad,
                cd.precio_unitario,
                cd.total_bruto,
                cd.total_neto,
                cd.total_iva,
                cd.esnuevo
              FROM tcompras_encabezado ce
              JOIN tproveedores p ON ce.idProveedor = p.id
              LEFT JOIN tusuarios u ON ce.email = u.email
              JOIN tcompras_detalle cd ON cd.idCompra = ce.id
              JOIN tarticulos a ON cd.idArticulo = a.id
              $whereClause
              ORDER BY ce.fecha DESC";

    $res = $conn->query($query);
    echo $res
      ? json_encode($res->fetch_all(MYSQLI_ASSOC))
      : json_encode(["success" => false, "error" => $conn->error]);
    break;

  case "insert":
    $conn->begin_transaction();
    try {
      $fecha = $conn->real_escape_string($post["fecha"]);
      $tipo_factura = $conn->real_escape_string($post["tipo_factura"]);
      $nro_factura = $conn->real_escape_string($post["nro_factura"]);
      $idProveedor = (int)$post["idProveedor"];
      $email = $conn->real_escape_string($post["email"]);

      $stmtEnc = $conn->prepare("INSERT INTO tcompras_encabezado (fecha, tipo_factura, nro_factura, idProveedor, email) VALUES (?, ?, ?, ?, ?)");
      $stmtEnc->bind_param("sssis", $fecha, $tipo_factura, $nro_factura, $idProveedor, $email);

      if (!$stmtEnc->execute()) throw new Exception($stmtEnc->error);

      $idCompra = $conn->insert_id;

      $stmtDet = $conn->prepare("INSERT INTO tcompras_detalle (idCompra, idArticulo, cantidad, precio_unitario, total_neto, total_iva, total_bruto, esnuevo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      foreach ($post['detalles'] as $detalle) {
        $idArticulo = (int)$detalle['idArticulo'];
        $cantidad = (float)$detalle['cantidad'];
        $precio_unitario = (float)$detalle['precio_unitario'];
        $total_neto = (float)$detalle['total_neto'];
        $total_iva = (float)$detalle['total_iva'];
        $total_bruto = $cantidad * $precio_unitario;
        $esnuevo = isset($detalle['esnuevo']) ? (int)$detalle['esnuevo'] : 1;

        $stmtDet->bind_param("iidddddi", $idCompra, $idArticulo, $cantidad, $precio_unitario, $total_neto, $total_iva, $total_bruto, $esnuevo);
        if (!$stmtDet->execute()) throw new Exception($stmtDet->error);
      }

      $conn->commit();
      echo json_encode(["success" => true]);
    } catch (Exception $e) {
      $conn->rollback();
      echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
    break;

  case "delete":
    $id = (int)$post['id'];
    $res = $conn->query("DELETE FROM tcompras_encabezado WHERE id = $id");
    echo json_encode(["success" => $res && $conn->affected_rows > 0, "error" => $conn->error]);
    break;

  case "update":
    if (!isset($post["id"]) || !isset($post["idProveedor"])) {
      echo json_encode(["success" => false, "error" => "Datos incompletos"]);
      break;
    }

    $id = (int)$post["id"];
    $idProveedor = (int)$post["idProveedor"];

    $sql = "UPDATE tcompras_encabezado SET idProveedor = $idProveedor WHERE id = $id";
    $res = $conn->query($sql);
    echo json_encode(["success" => $res, "error" => $conn->error]);
    break;

  case "deleteDetalle":
    if (!isset($post["id"])) {
        echo json_encode(["success" => false, "error" => "Falta ID"]);
        break;
    }

    $idDetalle = (int)$post["id"];

    $resDetalle = $conn->query("SELECT idCompra FROM tcompras_detalle WHERE id = $idDetalle");
    if (!$resDetalle || $resDetalle->num_rows === 0) {
        echo json_encode(["success" => false, "error" => "Detalle no encontrado"]);
        break;
    }
    $row = $resDetalle->fetch_assoc();
    $idCompra = (int)$row["idCompra"];

    if ($conn->query("DELETE FROM tcompras_detalle WHERE id = $idDetalle")) {
        $resCheck = $conn->query("SELECT COUNT(*) AS total FROM tcompras_detalle WHERE idCompra = $idCompra");
        $rowCheck = $resCheck->fetch_assoc();

        if ((int)$rowCheck["total"] === 0) {
            $conn->query("DELETE FROM tcompras_encabezado WHERE id = $idCompra");
        }

        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Error al eliminar detalle: " . $conn->error]);
    }
    break;

  case "updateDetalle":
    if (
      !isset($post["id"]) ||
      !isset($post["cantidad"]) ||
      !isset($post["precio_unitario"]) ||
      !isset($post["total_neto"]) ||
      !isset($post["total_iva"])
    ) {
        echo json_encode(["success" => false, "error" => "Datos incompletos"]);
        break;
    }

    $id = (int)$post["id"];
    $cantidad = (float)$post["cantidad"];
    $precio_unitario = (float)$post["precio_unitario"];
    $total_neto = (float)$post["total_neto"];
    $total_iva = (float)$post["total_iva"];
    $total_bruto = $cantidad * $precio_unitario;
    $esnuevo = isset($post["esnuevo"]) ? (int)$post["esnuevo"] : 1;

    $sql = "UPDATE tcompras_detalle 
            SET cantidad = $cantidad,
                precio_unitario = $precio_unitario,
                total_neto = $total_neto,
                total_iva = $total_iva,
                total_bruto = $total_bruto,
                esnuevo = $esnuevo
            WHERE id = $id";

    $res = $conn->query($sql);
    echo json_encode(["success" => $res, "error" => $conn->error]);
    break;

  default:
    echo json_encode(["success" => false, "error" => "Acción inválida"]);
    break;
}
?>
