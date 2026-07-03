<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

switch ($action) {
  case "getAll":
    // Traer TODOS los vehículos (activos e inactivos)
    $res = $conn->query("SELECT * FROM tvehiculos ORDER BY numerointerno ASC");
    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
    break;

  case "get":
    // Mostrar solo vehículos activos (inactivo = 0)
    $res = $conn->query("SELECT * FROM tvehiculos WHERE inactivo = 0 ORDER BY numerointerno ASC");
    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
    break;

  case "getInactivos":
    // Mostrar vehículos inactivos
    $res = $conn->query("SELECT * FROM tvehiculos WHERE inactivo = 1 ORDER BY numerointerno ASC");
    $data = $res->fetch_all(MYSQLI_ASSOC);
    
    // Log para depuración
    error_log("Vehículos inactivos encontrados: " . count($data));
    error_log("Datos: " . print_r($data, true));
    
    echo json_encode($data);
    break;

  case "generarClave":
    $intentos = 0;
    $maxIntentos = 100;
    
    do {
      // Generar clave de 5 caracteres alfanuméricos
      $caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sin caracteres confusos
      $clave = '';
      for ($i = 0; $i < 5; $i++) {
        $clave .= $caracteres[random_int(0, strlen($caracteres) - 1)];
      }
      
      // Verificar que no exista en vehículos activos
      $stmt = $conn->prepare("SELECT id FROM tvehiculos WHERE claveAcceso = ? AND inactivo = 0");
      $stmt->bind_param("s", $clave);
      $stmt->execute();
      $result = $stmt->get_result();
      $existe = $result->num_rows > 0;
      $stmt->close();
      
      $intentos++;
    } while ($existe && $intentos < $maxIntentos);
    
    if ($intentos >= $maxIntentos) {
      echo json_encode(["success" => false, "error" => "No se pudo generar una clave única"]);
    } else {
      echo json_encode(["success" => true, "clave" => $clave]);
    }
    break;

  case "insert":
    $numerointerno = $conn->real_escape_string($data["numerointerno"] ?? "");
    $patente = $conn->real_escape_string($data["patente"] ?? "");
    $marca = $conn->real_escape_string($data["marca"] ?? "");
    $modelo = $conn->real_escape_string($data["modelo"] ?? "");
    $anio = (int)($data["anio"] ?? 0);
    $descripcion = $conn->real_escape_string($data["descripcion"] ?? "");    
    $cantidadbutacas = (int)($data["cantidadbutacas"]?? 0);
    $numerochasis = $conn->real_escape_string($data["numerochasis"]?? "");
    $kmfrecuenciacambioaceite = (int)($data["kmfrecuenciacambioaceite"] ?? 0);
    $esExterno = isset($data["esExterno"]) && $data["esExterno"] ? 1 : 0;
    $claveAcceso = $esExterno && !empty($data["claveAcceso"]) ? $conn->real_escape_string($data["claveAcceso"]) : NULL;
    $inactivo = 0; // Por defecto activo

    if ($claveAcceso !== NULL) {
      $stmt = $conn->prepare("SELECT id FROM tvehiculos WHERE claveAcceso = ? AND inactivo = 0");
      $stmt->bind_param("s", $claveAcceso);
      $stmt->execute();
      $result = $stmt->get_result();
      if ($result->num_rows > 0) {
        echo json_encode(["success" => false, "error" => "La clave de acceso ya existe. Por favor, use otra clave."]);
        $stmt->close();
        break;
      }
      $stmt->close();
    }

    $sql = "INSERT INTO tvehiculos (numerointerno, patente, marca, modelo, anio, descripcion, cantidadbutacas, numerochasis, kmfrecuenciacambioaceite, esExterno, claveAcceso, inactivo)
            VALUES ('$numerointerno', '$patente', '$marca', '$modelo', $anio, '$descripcion', $cantidadbutacas, '$numerochasis', $kmfrecuenciacambioaceite, $esExterno, " . ($claveAcceso ? "'$claveAcceso'" : "NULL") . ", $inactivo)";

    echo json_encode(["success" => $conn->query($sql)]);
    break;

  case "update":
    $id = (int)($data["id"] ?? 0);
    $numerointerno = $conn->real_escape_string($data["numerointerno"] ?? "");
    $patente = $conn->real_escape_string($data["patente"] ?? "");
    $marca = $conn->real_escape_string($data["marca"] ?? "");
    $modelo = $conn->real_escape_string($data["modelo"] ?? "");
    $anio = (int)($data["anio"] ?? 0);
    $descripcion = $conn->real_escape_string($data["descripcion"] ?? "");
    $cantidadbutacas = (int)($data["cantidadbutacas"]?? 0);
    $numerochasis = $conn->real_escape_string($data["numerochasis"] ?? "");
    $kmfrecuenciacambioaceite = (int)($data["kmfrecuenciacambioaceite"] ?? 0);
    $esExterno = isset($data["esExterno"]) && $data["esExterno"] ? 1 : 0;
    $claveAcceso = $esExterno && !empty($data["claveAcceso"]) ? $conn->real_escape_string($data["claveAcceso"]) : NULL;

    if ($claveAcceso !== NULL) {
      $stmt = $conn->prepare("SELECT id FROM tvehiculos WHERE claveAcceso = ? AND id != ? AND inactivo = 0");
      $stmt->bind_param("si", $claveAcceso, $id);
      $stmt->execute();
      $result = $stmt->get_result();
      if ($result->num_rows > 0) {
        echo json_encode(["success" => false, "error" => "La clave de acceso ya existe en otro vehículo. Por favor, use otra clave."]);
        $stmt->close();
        break;
      }
      $stmt->close();
    }

    $sql = "UPDATE tvehiculos 
            SET numerointerno = '$numerointerno',
                patente = '$patente',
                marca = '$marca',
                modelo = '$modelo',
                anio = $anio,
                descripcion = '$descripcion',
                cantidadbutacas = $cantidadbutacas,
                numerochasis = '$numerochasis',
                kmfrecuenciacambioaceite = $kmfrecuenciacambioaceite,
                esExterno = $esExterno,
                claveAcceso = " . ($claveAcceso ? "'$claveAcceso'" : "NULL") . "
            WHERE id = $id";

    echo json_encode(["success" => $conn->query($sql)]);
    break;

  case "desactivar":
    $id = (int)($data["id"] ?? 0);
    $sql = "UPDATE tvehiculos SET inactivo = 1 WHERE id = $id";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

  case "activar":
    $id = (int)($data["id"] ?? 0);
    $sql = "UPDATE tvehiculos SET inactivo = 0 WHERE id = $id";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

  case "delete":
    // Eliminación física permanente
    $id = (int)($data["id"] ?? 0);
    $sql = "DELETE FROM tvehiculos WHERE id = $id";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

  default:
    http_response_code(400);
    echo json_encode(["error" => "Acción no válida"]);
    break;
}
?>