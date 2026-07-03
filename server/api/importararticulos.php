<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

switch ($action) {
  case "importar":
    // Recibir array de artículos desde el Excel
    $articulos = $data["articulos"] ?? [];
    
    if (empty($articulos)) {
      echo json_encode(["success" => false, "error" => "No se recibieron artículos para importar"]);
      break;
    }

    $conn->begin_transaction();
    
    try {
      $insertados = 0;
      $errores = [];
      
      foreach ($articulos as $index => $articulo) {
        $fila = $index + 2; // +2 porque empieza en fila 2 del Excel (después del encabezado)
        
        // Validaciones
        if (empty($articulo["nombre"])) {
          $errores[] = "Fila $fila: El nombre es obligatorio";
          continue;
        }
        
        if (empty($articulo["idCategoria"])) {
          $errores[] = "Fila $fila: La categoría es obligatoria";
          continue;
        }
        
        // Preparar datos
        $nombre = $conn->real_escape_string($articulo["nombre"]);
        $descripcion = $conn->real_escape_string($articulo["descripcion"] ?? "");
        $idCategoria = (int)$articulo["idCategoria"];
        $stock_minimo = (float)($articulo["stock_minimo"] ?? 0);
        $activo = (int)($articulo["activo"] ?? 1);
        
        // Verificar si la categoría existe
        $checkCategoria = $conn->query("SELECT id FROM tcategorias WHERE id = $idCategoria");
        if ($checkCategoria->num_rows === 0) {
          $errores[] = "Fila $fila: La categoría con ID $idCategoria no existe";
          continue;
        }
        
        // Verificar si el artículo ya existe
        $checkArticulo = $conn->query("SELECT id FROM tarticulos WHERE nombre = '$nombre'");
        if ($checkArticulo->num_rows > 0) {
          $errores[] = "Fila $fila: El artículo '$nombre' ya existe";
          continue;
        }
        
        // Insertar artículo
        $sql = "INSERT INTO tarticulos (nombre, descripcion, idCategoria, stock_minimo, activo) 
                VALUES ('$nombre', '$descripcion', $idCategoria, $stock_minimo, $activo)";
        
        if ($conn->query($sql)) {
          $insertados++;
        } else {
          $errores[] = "Fila $fila: Error al insertar - " . $conn->error;
        }
      }
      
      $conn->commit();
      
      echo json_encode([
        "success" => true,
        "insertados" => $insertados,
        "errores" => $errores,
        "total" => count($articulos)
      ]);
      
    } catch (Exception $e) {
      $conn->rollback();
      echo json_encode([
        "success" => false,
        "error" => "Error en la transacción: " . $e->getMessage()
      ]);
    }
    break;
    
  default:
    http_response_code(400);
    echo json_encode(["error" => "Acción no válida"]);
    break;
}
?>
