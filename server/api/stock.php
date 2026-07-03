<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

function obtenerMovimientos($conn, $idArticulo, $filtroEsNuevo = null) {
  $movimientos = [];

  // Compras
  $whereEsNuevoCompras = "";
  if ($filtroEsNuevo !== null) {
    $whereEsNuevoCompras = " AND D.esnuevo = " . (int)$filtroEsNuevo;
  }
  
  $sqlCompras = "
    SELECT C.fecha, 'compra' AS tipo, CAST(D.cantidad AS DECIMAL(10,2)) AS cantidad, '' AS detalle, D.esnuevo
    FROM tcompras_encabezado C
    JOIN tcompras_detalle D ON C.id = D.idCompra
    WHERE D.idArticulo = $idArticulo $whereEsNuevoCompras
  ";
  $res = $conn->query($sqlCompras);
  if ($res) while ($row = $res->fetch_assoc()) {
    $row['cantidad'] = (float)$row['cantidad'];
    $movimientos[] = $row;
  }

  // Ajustes
  $whereEsNuevo = "";
  if ($filtroEsNuevo !== null) {
    $whereEsNuevo = " AND esnuevo = " . (int)$filtroEsNuevo;
  }
  
  $sqlAjustes = "
    SELECT fecha_hora AS fecha, tipo, CAST(cantidad AS DECIMAL(10,2)) * IF(tipo = 'egreso', -1, 1) AS cantidad, motivo AS detalle, esnuevo
    FROM tajustes
    WHERE idArticulo = $idArticulo $whereEsNuevo
  ";
  $res = $conn->query($sqlAjustes);
  if ($res) while ($row = $res->fetch_assoc()) {
    $row['cantidad'] = (float)$row['cantidad'];
    $movimientos[] = $row;
  }

  // Servicios
  $sqlServicios = "
    SELECT fecha_servicio AS fecha, 'servicio' AS tipo, CAST(-cantidad AS DECIMAL(10,2)) AS cantidad, descripcion AS detalle, NULL AS esnuevo
    FROM tserviciosvehiculo
    WHERE idArticulo = $idArticulo
  ";
  $res = $conn->query($sqlServicios);
  if ($res) while ($row = $res->fetch_assoc()) {
    $row['cantidad'] = (float)$row['cantidad'];
    $movimientos[] = $row;
  }

  usort($movimientos, fn($a, $b) => strtotime($b["fecha"]) - strtotime($a["fecha"]));
  return $movimientos;
}

if ($action === "get") {
  $idArticulo = isset($data["idArticulo"]) ? (int)$data["idArticulo"] : 0;
  $filtroEsNuevo = isset($data["filtroEsNuevo"]) && $data["filtroEsNuevo"] !== "" ? (int)$data["filtroEsNuevo"] : null;
  
  $movimientos = obtenerMovimientos($conn, $idArticulo, $filtroEsNuevo);
  $stock = round(array_sum(array_column($movimientos, "cantidad")), 2);

  error_log("[v0 DEBUG] Movimientos para artículo $idArticulo: " . json_encode($movimientos));
  
  echo json_encode([
    "stock" => $stock,
    "movimientos" => $movimientos
  ]);
}

if ($action === "getAllStock") {
  $filtroEsNuevo = isset($data["filtroEsNuevo"]) && $data["filtroEsNuevo"] !== "" ? (int)$data["filtroEsNuevo"] : null;
  
  // $sql = "SELECT id, nombre, descripcion, stock_minimo FROM tarticulos";
  $sql = "
    SELECT 
      A.id,
      A.nombre,
      A.descripcion,
      A.stock_minimo,
      C.nombre AS categoria
    FROM tarticulos A
    LEFT JOIN tcategorias C ON A.idCategoria = C.id
    ";

  $res = $conn->query($sql);
  $articulos = [];

  if ($res) {
    while ($a = $res->fetch_assoc()) {
      $id = $a["id"];
      $movs = obtenerMovimientos($conn, $id, $filtroEsNuevo);
      $stock = round(array_sum(array_column($movs, "cantidad")), 2);

      $color = "";
      if ($stock < $a["stock_minimo"]) {
        $color = "red";
      } elseif ($stock == $a["stock_minimo"]) {
        $color = "yellow";
      } else {
        $color = "green";
      }

      $articulos[] = [
        "id" => $id,
        "nombre" => $a["nombre"],
        "descripcion" => $a["descripcion"],
        "categoria" => $a["categoria"] ?? "-",
        "stock" => $stock,
        "stockMinimo" => (float)$a["stock_minimo"],
        "color" => $color
      ];
    }
  }

  echo json_encode($articulos);
}

?>
